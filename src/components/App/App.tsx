import { useEffect, useState } from "react";
import MovieGrid from "../MovieGrid/MovieGrid";
import SearchBar from "../SearchBar/SearchBar";
import Loader from "../Loader/Loader";
import { Toaster } from "react-hot-toast";
import type { Movie } from "../../types/movie";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import fetchMovies from "../../services/movieService";
import ReactPaginate from "react-paginate";
import css from "./App.module.css";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { fetchPopularMovies } from "../../services/movieService";

function App() {
  const [query, setQuery] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["movies", query, page],
    queryFn: () => {
      if (query.trim().length > 0) {
        return fetchMovies(query, page);
      }
      return fetchPopularMovies(page);
    },
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (isSuccess && data?.results.length === 0) {
      toast("No movies found for your request.");
    }
  }, [isSuccess, data]);

  const movies = data?.results || [];
  const totalPages = data?.total_pages || 0;

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
  };

  return (
    <>
      <Toaster />
      <main>
        <div className="pattern" />

        <div className="wrapper">
          <header>
            <img src="/public/hero.png" alt="Hero Banner" />
            <h1>
              Find <span className="text-gradient">Movies</span> You'll Enjoy
              Without the Hussle
            </h1>
          </header>

          <SearchBar onSubmit={handleSearch} />

          {/* {isLoading && <Loader />}

          {isError && <ErrorMessage />} */}

     
          <section className="all-movies">
            <h2>All Movies</h2>
            {isLoading ? <Loader /> : isError ? <ErrorMessage /> :  <MovieGrid
            movies={movies}
            onSelect={(movie) => setSelectedMovie(movie)}
          />}
          </section>
         

               {totalPages > 1 && (
            <ReactPaginate
              pageCount={totalPages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={({ selected }) => setPage(selected + 1)}
              forcePage={page - 1}
              // containerClassName={css.pagination}
              // activeClassName={css.active}
              // nextLabel="→"
              // previousLabel="←"

               containerClassName="flex gap-2 justify-center mt-6"
  pageClassName="px-3 py-1 bg-gray-700 rounded"
  pageLinkClassName="px-3 py-1 text-white cursor-pointer"
  activeClassName="bg-gray-900"
  previousClassName="px-3 py-1 bg-gray-700 rounded text-white hover:bg-gray-600 transition"
  nextClassName="px-3 py-1 bg-gray-700 rounded text-white cursor-pointer"
//   containerClassName="flex gap-2 justify-center mt-6"
// pageClassName="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600"
// activeClassName="bg-blue-600"
// pageLinkClassName="text-white"
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
    </>
  );
}

export default App;
