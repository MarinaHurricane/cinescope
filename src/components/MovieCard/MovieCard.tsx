import type { Movie } from "../../types/movie";
import css from "./MovieCard.module.css";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({
  movie: { title, vote_average, poster_path, release_date, original_language },
}: MovieCardProps) {
  return (
    <div className={css.movieCard}>
      <img
        src={
          poster_path
            ? `https://image.tmdb.org/t/p/w500/${poster_path}`
            : "/no-movie.png"
        }
        alt={title}
      />

      <div className={css.info}>
        <h3>{title}</h3>

        <div className={css.content}>
          <div className={css.rating}>
            <img src="star.svg" alt="Star Icon" />
            <p>{vote_average ? vote_average.toFixed(1) : "N/A"}</p>
          </div>

          <span>•</span>
          <p className={css.lang}>{original_language}</p>

          <span>•</span>
          <p className={css.year}>
            {release_date ? release_date.split("-")[0] : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}

