import { useNavigate, useLocation } from 'react-router-dom';
import React, { useState, useContext, useEffect } from 'react';
import styles from "./MovieCards.module.css";
import { MovieGenreContext } from "../context/MovieGenreProvider";
import { addToFavorites, removeFromFavorites, fetchFavorites } from '../api/favoriteapi';

const MovieCards = ({ movieCards }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [favorites, setFavorites] = useState([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search); // To parse query parameters
  const genreName = queryParams.get('genre');
  const genreList = useContext(MovieGenreContext);

  // Fetch favorites on component load
  useEffect(() => {
    async function loadFavorites() {
      try {
        const response = await fetchFavorites();
        const favoriteIds = response.data.map((fav) => fav.movie_id); // Extract only the movie IDs
        setFavorites(favoriteIds); // Store favorite movie IDs
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    }
    loadFavorites();
  }, []);

  const filteredMovies = genreName
    ? movieCards.filter((movie) => {
        const movieGenreNames = movie.genre_ids.map(
          (id) => genreList.find((genre) => genre.id === id)?.name
        );
        return movieGenreNames.includes(genreName);
      })
    : movieCards;

  // Pagination calculations
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMovies = filteredMovies.slice(startIndex, endIndex);

  function productClickHandler(movieId) {
    navigate(`/detail/movie/${movieId}`);
  }

  function toggleFavoriteHandler(event, movieId) {
    event.stopPropagation();
    if (favorites.includes(movieId)) {
      removeFromFavorites(movieId)
        .then(() => {
          setFavorites((prevFavorites) =>
            prevFavorites.filter((id) => id !== movieId)
          );
        })
        .catch((error) => console.error('Error removing movie from favorites:', error));
    } else {
      addToFavorites(movieId, 'movie') // Add the type 'movie'
        .then(() => {
          setFavorites((prevFavorites) => [...prevFavorites, movieId]);
        })
        .catch((error) => console.error('Error adding movie to favorites:', error));
    }
  }

  // Navigation between pages
  function nextPage() {
    if (currentMovies.length === itemsPerPage) {
      setCurrentPage(currentPage + 1);
    }
  }

  function prevPage() {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  return (
    <div>
      <div className={styles['productcards_container']}>
        {currentMovies.map((item) => (
          <div
            className={styles['product-card-framework']}
            onClick={() => productClickHandler(item.id)}
            key={item.id}
          >
            <img
              className={styles['product-card']}
              src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
              alt={item.name}
            />
            <h5>{item.title}</h5>
            <p>{item.release_date}</p>
            <div className={styles['button-container']}>
              <button
                className={styles['button-click']}
                onClick={(e) => toggleFavoriteHandler(e, item.id)}
              >
                {favorites.includes(item.id) ? 'Remove from favorites' : 'Add to favorites'}
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className={styles['pagination-controls']}>
        <button onClick={prevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button onClick={nextPage} disabled={currentMovies.length < itemsPerPage}>
          Next
        </button>
      </div>
    </div>
  );
};

export default MovieCards;