import { useEffect, useRef, useState } from "react";
import MovieGrid from "../MovieGrid/MovieGrid";
import SearchBar from "../SearchBar/SearchBar";
import Loader from "../Loader/Loader";
import { Toaster } from "react-hot-toast";
import type { Movie, TrendingMovie } from "../../types/movie";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import fetchMovies, { fetchPopularMovies } from "../../services/movieService";
import ReactPaginate from "react-paginate";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getTrendingMovies, updateSearchCount } from "../../appwrite";
import Footer from "../Footer/Footer";
import styles from "./App.module.css";

function App() {
  const [query, setQuery] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [page, setPage] = useState(1);
  const [trendingMovies, setTrendingMovies] = useState<TrendingMovie[]>([]);

  const lastSavedQueryRef = useRef("");

  const { data, isLoading, isError, isSuccess, isFetching } = useQuery({
    queryKey: ["movies", query, page],
    queryFn: () => {
      if (query.trim().length > 0) {
        return fetchMovies(query, page);
      }
      return fetchPopularMovies(page);
    },
    placeholderData: keepPreviousData,
  });

  const movies = data?.results || [];
  const totalPages = data?.total_pages || 0;

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`);
    }
  };

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  useEffect(() => {
    if (isSuccess && data?.results?.length === 0) {
      toast("No movies found for your request.");
    }
  }, [isSuccess, data]);

  useEffect(() => {
    const results = data?.results;

    if (!query.trim()) return;
    if (isFetching) return;
    if (!results || results.length === 0) return;
    if (lastSavedQueryRef.current === query) return;

    updateSearchCount({
      searchTerm: query,
      movie: results[0],
    }).then(() => {
      lastSavedQueryRef.current = query;
      loadTrendingMovies();
    });
  }, [query, data?.results, isFetching]);

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
    lastSavedQueryRef.current = "";
  };

  return (
    <>
      <Toaster />
      <main className={styles.app}>
        <div className="pattern" />

        <div className="wrapper">
          <header className={styles.header}>
            <h1>
              Find <span className="text-gradient">Movies</span> and Watch
              Trailers All in One Place
            </h1>
            <SearchBar onSubmit={handleSearch} />
          </header>

          {trendingMovies.length > 0 && (
            <section className="trending">
              <h2 className={styles.trendingTitle}>Trending Movies</h2>

              <ul className={styles.trendingList}>
                {trendingMovies.map((movie) => (
                  <li key={movie.$id}>
                    <p>{movie.title}</p>
                    <img src={movie.poster_url} alt={movie.title} />
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="all-movies">
            <h2 className={styles.allMoviesTitle}>All Movies</h2>

            {isLoading ? (
              <Loader />
            ) : isError ? (
              <ErrorMessage />
            ) : (
              <MovieGrid
                movies={movies}
                onSelect={(movie) => setSelectedMovie(movie)}
              />
            )}
          </section>

          {totalPages > 1 && (
            <ReactPaginate
              pageCount={totalPages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={({ selected }) => setPage(selected + 1)}
              forcePage={page - 1}
              containerClassName={styles.pagination}
              pageClassName={styles.page}
              pageLinkClassName={styles.pageLink}
              activeClassName={styles.active}
              previousClassName={styles.previous}
              nextClassName={styles.next}
            />
          )}

          {selectedMovie && (
            <MovieModal
              movie={selectedMovie}
              onClose={() => setSelectedMovie(null)}
            />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default App;