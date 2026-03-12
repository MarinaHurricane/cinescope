export interface Movie {
    id: number;
    poster_path: string;
    backdrop_path: string;
    title: string;
    overview: string;
    release_date: string;
    vote_average: number;
    original_language: string;
}


export interface TrendingMovie {
  $id: string;
  title: string;
  searchTerm: string;
  count: number;
  movie_id: number;
  poster_url: string;
}