import css from './MovieGrid.module.css'
import type { Movie } from '../../types/movie'
import MovieCard from '../MovieCard/MovieCard';

interface MovieGridProps {
    onSelect: (movie: Movie) => void;
    movies: Movie [];
}

export default function MovieGrid( { onSelect, movies }: MovieGridProps ) {
      return (
         <ul className={css.grid}>
        {movies.map(movie => (
             <li key={movie.id} onClick={() => onSelect(movie)}>
    <MovieCard movie={movie}/>
  </li>
        ))}
</ul>
    )
}
  
