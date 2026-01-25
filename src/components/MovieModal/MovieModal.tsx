import css from './MovieModal.module.css'
import type { Movie } from '../../types/movie'
import { createPortal } from 'react-dom';
import { useEffect } from 'react';

interface MovieModalProps {
    movie: Movie;
    onClose: () => void;
}

export default function MovieModal( { movie, onClose }: MovieModalProps) {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        const handleKeyDown = (e: KeyboardEvent) => {
            if(e.code === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
             document.body.style.overflow = '';
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);
    
  return createPortal(
        <div className={css.backdrop} role="dialog" aria-modal="true" 
        onClick={(e: React.MouseEvent<HTMLDivElement> ) => {
            if(e.target !== e.currentTarget) return;
            onClose()
        }}>
        <div className={css.modal}>
            <button className={css.closeButton} aria-label="Close modal" onClick={onClose}>
            &times;
            </button>
            <img
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt="movie_title"
            className={css.image}
            />
            <div className={css.content}>
            <h2>{movie.title}</h2>
            <p>{movie.overview}</p>
            <p>
                <strong>Release Date:</strong> {movie.release_date}
            </p>
            <p>
                <strong>Rating:</strong> {movie.vote_average}
            </p>
            </div>
        </div>
        </div>,
        document.body
    );
}