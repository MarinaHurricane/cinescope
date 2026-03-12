// import { useEffect, useState } from "react";
// import MovieGrid from "../MovieGrid/MovieGrid";
// import SearchBar from "../SearchBar/SearchBar";
// import Loader from "../Loader/Loader";
// import { Toaster } from "react-hot-toast";
// import type { Movie } from "../../types/movie";
// import ErrorMessage from "../ErrorMessage/ErrorMessage";
// import MovieModal from "../MovieModal/MovieModal";
// import fetchMovies from "../../services/movieService";
// import ReactPaginate from "react-paginate";
// import css from "./App.module.css";
// import { useQuery, keepPreviousData } from "@tanstack/react-query";
// import toast from "react-hot-toast";
// import { fetchPopularMovies } from "../../services/movieService";
// import { getTrendingMovies, updateSearchCount } from "../../appwrite";
// import { TrendingMovie } from "../../types/movie";

// function App() {
//   const [query, setQuery] = useState("");
//   const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
//   const [page, setPage] = useState(1);
//   const [trendingMovies, setTrendingMovies] = useState<TrendingMovie[]>([]);

//   const { data, isLoading, isError, isSuccess, isFetching } = useQuery({
//     queryKey: ["movies", query, page],
//     queryFn: () => {
//       if (query.trim().length > 0) {
//         return fetchMovies(query, page);
//       }
//       return fetchPopularMovies(page);
//     },
//     placeholderData: keepPreviousData,
//   });

//   useEffect(() => {
//     if (isSuccess && data?.results.length === 0) {
//       toast("No movies found for your request.");
//     }
//   }, [isSuccess, data]);

//   const movies = data?.results || [];

//   const totalPages = data?.total_pages || 0;

//   useEffect(() => {
//     const results = data?.results;

//     if (!query || isFetching || !results || results.length === 0) return;

//     updateSearchCount({
//       searchTerm: query,
//       movie: results[0],
//     });
//   }, [query, data?.results, isFetching]);

//   useEffect(() => {
//     const loadTrendingMovies = async () => {
//       try {
//         const movies = await getTrendingMovies();
//         console.log(
//           movies.map((m) => ({ term: m.searchTerm, count: m.count })),
//         );

//         setTrendingMovies(movies);
//       } catch (error) {
//         console.error(`Error fetching trending movies: ${error}`);
//       }
//     };
//     loadTrendingMovies();
//   }, []);

//   const handleSearch = (newQuery: string) => {
//     setQuery(newQuery);
//     setPage(1);
//   };

//   return (
//     <>
//       <Toaster />
//       <main>
//         <div className="pattern" />.
//         <div className="wrapper">
//           <header>
//             <img src="/hero.png" alt="Hero Banner" />
//             <h1>
//               Find <span className="text-gradient">Movies</span> You'll Enjoy
//               Without the Hussle
//             </h1>
//             <SearchBar onSubmit={handleSearch} />
//           </header>

//           {trendingMovies.length > 0 && (
//             <section className="trending">
//               <h2>Trending Movies</h2>

//               <ul>
//                 {trendingMovies.map((movie, index) => {
//                   console.log("Trending row:", movie);
//                   return (
//                     <li key={movie.$id}>
//                       <p>{index + 1}</p>
//                       <p>{movie.title}</p>
//                       <img src={movie.poster_url} alt={movie.title} />
//                     </li>
//                   );
//                 })}
//               </ul>
//             </section>
//           )}

//           <section className="all-movies">
//             <h2>All Movies</h2>

//             {isLoading ? (
//               <Loader />
//             ) : isError ? (
//               <ErrorMessage />
//             ) : (
//               <MovieGrid
//                 movies={movies}
//                 onSelect={(movie) => setSelectedMovie(movie)}
//               />
//             )}
//           </section>

//           {totalPages > 1 && (
//             <ReactPaginate
//               pageCount={totalPages}
//               pageRangeDisplayed={5}
//               marginPagesDisplayed={1}
//               onPageChange={({ selected }) => setPage(selected + 1)}
//               forcePage={page - 1}
//               containerClassName="flex gap-2 justify-center mt-6"
//               pageClassName="px-3 py-1 bg-gray-700 rounded"
//               pageLinkClassName="px-3 py-1 text-white cursor-pointer"
//               activeClassName="bg-gray-900"
//               previousClassName="px-3 py-1 bg-gray-700 rounded text-white hover:bg-gray-600 transition"
//               nextClassName="px-3 py-1 bg-gray-700 rounded text-white cursor-pointer"
//             />
//           )}

//           {selectedMovie && (
//             <MovieModal
//               movie={selectedMovie}
//               onClose={() => setSelectedMovie(null)}
//             />
//           )}
//         </div>
//       </main>
//     </>
//   );
// }

// export default App;

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
    // Prevent stale search results from being saved when React Query keeps previous data
    if (isFetching) return;
    if (!results || results.length === 0) return;
    // Prevent duplicate Appwrite writes caused by React StrictMode double render
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
      <main>
        <div className="pattern" />

        <div className="wrapper">
          <header>
            <img src="/hero.png" alt="Hero Banner" />
            <h1>
              Find <span className="text-gradient">Movies</span> You'll Enjoy
              Without the Hussle
            </h1>
            <SearchBar onSubmit={handleSearch} />
          </header>

          {trendingMovies.length > 0 && (
            <section className="trending">
              <h2>Trending Movies</h2>

              <ul>
                {trendingMovies.map((movie, index) => (
                  <li key={movie.$id}>
                    <p>{index + 1}</p>
                    <p>{movie.title}</p>
                    <img src={movie.poster_url} alt={movie.title} />
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="all-movies">
            <h2>All Movies</h2>

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
              containerClassName="flex gap-2 justify-center mt-6"
              pageClassName="px-3 py-1 bg-gray-700 rounded"
              pageLinkClassName="px-3 py-1 text-white cursor-pointer"
              activeClassName="bg-gray-900"
              previousClassName="px-3 py-1 bg-gray-700 rounded text-white hover:bg-gray-600 transition"
              nextClassName="px-3 py-1 bg-gray-700 rounded text-white cursor-pointer"
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
