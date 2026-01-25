import axios from "axios";
import type { Movie } from "../types/movie";

interface FetchMoviesResponse {
    page: number;
    results: Movie [];
    total_pages: number;
    total_results: number;
}

export default function fetchMovies(query: string):Promise<Movie[]> {
    const myKey = import.meta.env.VITE_TMDB_TOKEN;
    const url = 'https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&page=1';
    
    return axios.get<FetchMoviesResponse>(url, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${myKey}`
      },
      params: {
        query,
      }
    }).then ((response) => response.data.results);
}