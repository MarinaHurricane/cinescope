import axios from "axios";
import type { Movie } from "../types/movie";

interface FetchMoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export default function fetchMovies(
  query: string,
  page: number = 1,
): Promise<FetchMoviesResponse> {
  const myKey = import.meta.env.VITE_TMDB_TOKEN;
  const url = "https://api.themoviedb.org/3/search/movie";

  return axios
    .get<FetchMoviesResponse>(url, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${myKey}`,
      },
      params: {
        query: encodeURIComponent(query),
        page,
      },
    })
    .then((response) => response.data);
}

export function fetchPopularMovies(
  page: number = 1,
): Promise<FetchMoviesResponse> {
  const myKey = import.meta.env.VITE_TMDB_TOKEN;
  const url = "https://api.themoviedb.org/3/movie/popular";
  return axios
    .get<FetchMoviesResponse>(url, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${myKey}`,
      },
      params: {
        page,
      },
    })
    .then((response) => response.data);
}

export async function fetchMovieVideos(movieId: number) {
  const myKey = import.meta.env.VITE_TMDB_TOKEN;

  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/videos`,
    {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${myKey}`,
      },
    },
  );

  const data = await response.json();
  return data.results;
}
