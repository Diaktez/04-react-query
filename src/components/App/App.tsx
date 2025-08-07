import { useState, useEffect } from "react";
import SearchBar from "../SearchBar/SearchBar";
import { fetchMovies } from "../../services/movieService";
import { Toaster, toast } from "react-hot-toast";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import type { Movie } from "../../types/movie";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import css from "./App.module.css";
import ReactPaginate from "react-paginate";

export default function App() {
  const [searchTopic, setSearchTopic] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);

  const { data, isLoading, isError, isSuccess, isFetching } = useQuery({
    queryKey: ["movies", searchTopic, currentPage],
    queryFn: () => fetchMovies(searchTopic, currentPage),
    enabled: !!searchTopic,
    placeholderData: keepPreviousData,
  });

  const totalPages = data?.total_pages || 0;

  useEffect(() => {
    if (isSuccess && data?.results?.length === 0) {
      toast.error("No movies found for your request.");
    }
  }, [isSuccess, data]);

  const handleSearch = (newTopic: string) => {
    setSearchTopic(newTopic);
    setCurrentPage(1);
    setHasSearched(true);
  };
  console.log("data from query:", data);
  return (
    <>
      <SearchBar onSubmit={handleSearch} />

      {isSuccess && totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setCurrentPage(selected + 1)}
          forcePage={currentPage - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}

      {hasSearched && (isLoading || isFetching) && <Loader />}
      {isError && <ErrorMessage />}
      {!isError && (
        <MovieGrid movies={data?.results || []} onSelect={setSelectedMovie} />
      )}

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}

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
    </>
  );
}
