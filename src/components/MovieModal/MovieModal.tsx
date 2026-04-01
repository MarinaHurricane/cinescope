import css from "./MovieModal.module.css";
import type { Movie } from "../../types/movie";
import { createPortal } from "react-dom";
import { useEffect } from "react";
import { fetchMovieVideos } from "../../services/movieService";
import { useState } from "react";

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

export default function MovieModal({ movie, onClose }: MovieModalProps) {
  const [trailerKey, setTrailerKey] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    const loadTrailer = async () => {
      const videos = await fetchMovieVideos(movie.id);

      const trailer = videos.find(
        (video: any) => video.type === "Trailer" && video.site === "YouTube",
      );

      if (trailer) {
        setTrailerKey(trailer.key);
      }
    };

    loadTrailer();
  }, [movie.id]);

  return createPortal(
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={(e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target !== e.currentTarget) return;
        onClose();
      }}
    >
      <div className={css.modal}>
        <button
          className={css.closeButton}
          aria-label="Close modal"
          onClick={onClose}
        >
          &times;
        </button>

        <h2>{movie.title}</h2>

        {trailerKey && (
          <div className={css.videoContainer}>
            <iframe
              className={css.video}
              width="100%"
              height="400"
              src={`https://www.youtube.com/embed/${trailerKey}`}
              title="Movie Trailer"
              allowFullScreen
            />
          </div>
        )}
        <div className={css.content}>
          <h2>{movie.title}</h2>
          <p>{movie.overview}</p>
        </div>
      </div>
    </div>,
    document.body,
  );
}
