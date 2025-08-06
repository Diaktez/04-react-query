import { useState } from "react";
import SearchBar from "../SearchBar/SearchBar";
import { fetchMovies } from "../../services/movieService";
import { Toaster, toast } from "react-hot-toast";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import type { Movie } from "../../types/movie";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const handleSearch = async (newTopic: string) => {
    try {
      setMovies([]);
      setLoading(true);

      const newArticles = await fetchMovies(newTopic);

      if (newArticles.length === 0) {
        toast.error("No movies found for your request.");
        return;
      }

      setMovies(newArticles);
    } catch {
      setError(true);
      toast.error("Something went wrong during the search.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SearchBar onSubmit={handleSearch} />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#333",
            color: "#fff",
            fontSize: "16px",
            borderRadius: "8px",
          },
        }}
      />
      {loading && <Loader />}
      {error && <ErrorMessage />}
      {!error && <MovieGrid movies={movies} onSelect={setSelectedMovie} />}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </>
  );
}
