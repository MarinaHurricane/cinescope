import { useEffect, useState } from 'react'
import MovieGrid from '../MovieGrid/MovieGrid'
import SearchBar from '../SearchBar/SearchBar'
import Loader from '../Loader/Loader'
import { Toaster } from 'react-hot-toast'
import type { Movie } from '../../types/movie'
import ErrorMessage from '../ErrorMessage/ErrorMessage'
import MovieModal from '../MovieModal/MovieModal'
import fetchMovies from '../../services/movieService'
import toast from 'react-hot-toast'


function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (query: string) => {
    setQuery(query);
  }

  useEffect(() => {
    if(!query) return;

    Promise.resolve().then(() => setIsLoading(true));

    fetchMovies(query)
    .then((response) => 
    {
      setMovies([]);
      console.log(response)
      if(response.length === 0) {
        toast('No movies found for your request.')
      }
      setMovies(response)
      setError(false)
    }) 
    .catch (() => {
      setError(true);
    })
    .finally(() =>
      setIsLoading(false)
    )
  }, [query]);

  return (
    <>
    <Toaster />
    <SearchBar onSubmit={handleSearch}/>
    {isLoading && <Loader />}
    {error? <ErrorMessage />:  !isLoading &&
            <MovieGrid movies={movies} onSelect={(movie) => setSelectedMovie(movie)}/>} 
    {selectedMovie && (
             <MovieModal 
                movie={selectedMovie}
                onClose={() => setSelectedMovie(null)} />)}        
            
    </>
  )
}

export default App
