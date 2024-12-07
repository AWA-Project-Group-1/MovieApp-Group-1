import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from "./MovieCards.module.css";
import { MovieGenreContext } from "../context/MovieGenreProvider";
import { addToFavorites, removeFromFavorites, fetchFavorites } from '../api/favoriteapi';
import UserContext from '../context/UserContext';
import { fetchReviews, fetchReviewedContent } from "../api/reviews";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { AverageStars } from './elements/Stars/AverageStars';

const MovieCards = ({ movieCards }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [favorites, setFavorites] = useState([]);
  const [showLoginPopup, setShowLoginPopup] = useState(false); // State for login popup
  const { user } = useContext(UserContext); // Access the logged-in user's token
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search); // To parse query parameters
  const genreName = queryParams.get('genre');
  const genreList = useContext(MovieGenreContext);
  const [averageRatings, setAverageRatings] = useState({}); // Store average ratings
  const [reviewCounts, setReviewCounts] = useState({}); // Store number of reviews
  const [reviewedContent, setReviewedContent] = useState([]);

  useEffect(() => {
    async function loadFavorites() {
      try {
        if (user?.token) {
          const response = await fetchFavorites(user.token);
          setFavorites(response.data.map((item) => item.movie_id)); // Store favorite movie IDs
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    }
    loadFavorites();
  }, [user]);

  useEffect(() => {
    async function loadRatings() {
      const ratings = {};
      const counts = {};
      for (const movie of movieCards) {
        try {
          const reviews = await fetchReviews(movie.id, 'movie');
          const average =
            reviews.length > 0
              ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
              : 0;
          ratings[movie.id] = average;
          counts[movie.id] = reviews.length; // Store the number of reviews
        } catch (error) {
          console.error('Error fetching reviews for movie ID:', movie.id, error);
        }
      }
      setAverageRatings(ratings);
      setReviewCounts(counts);
    }
    loadRatings();
  }, [movieCards]);

  useEffect(() => {
    async function loadReviewedContentData() {
      if (user?.token) {
        const contentType = 'movie';  // Set 'movie' or 'tv' dynamically based on context
        const reviewedIds = await fetchReviewedContent(user.token, contentType);
        setReviewedContent(reviewedIds);
      }
    }
    loadReviewedContentData();
  }, [user]);

  const filteredMovies = genreName
    ? movieCards.filter((movie) => {
      const movieGenreNames = movie.genre_ids.map(
        (id) => genreList.find((genre) => genre.id === id)?.name
      );
      return movieGenreNames.includes(genreName);
    })
    : movieCards;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentMovies = filteredMovies.slice(startIndex, startIndex + itemsPerPage);

  function productClickHandler(movieId) {
    navigate(`/detail/movie/${movieId}`);
  }

  function reviewsClickHandler(movieId) {
    navigate(`/detail/movie/${movieId}#reviews`);

    // Poll for the target element
    const intervalId = setInterval(() => {
      const reviewsElement = document.querySelector('#reviews');
      if (reviewsElement) {
        clearInterval(intervalId); // Stop checking once the element exists
        reviewsElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100); // Check every 100ms
  }

  function toggleFavoriteHandler(event, movieId) {
    event.stopPropagation();
    if (!user?.token) {
      setShowLoginPopup(true); // Show the login popup
      setTimeout(() => setShowLoginPopup(false), 3000); // Auto-hide the popup after 3 seconds
      return;
    }

    if (favorites.includes(movieId)) {
      removeFromFavorites(movieId, user.token)
        .then(() => setFavorites(favorites.filter((id) => id !== movieId)))
        .catch((error) => console.error('Error removing movie from favorites:', error));
    } else {
      addToFavorites(movieId, 'movie', user.token)
        .then(() => setFavorites([...favorites, movieId]))
        .catch((error) => console.error('Error adding movie to favorites:', error));
    }
  }

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
            <div className={styles['image-container']}>
              <img
                className={styles['product-card']}
                src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                alt={item.name}
              />
            </div>
            <div className={styles['text-container']}>
              <h5>{item.title.length > 17 ? `${item.title.slice(0, 17)}...` : item.title}</h5>
              {/* Render average rating as stars and review count */}
              <div className={styles['rating-container']}>
                <AverageStars value={(averageRatings[item.id] || 0)} reviewCount={reviewCounts[item.id] || 0} showBrackets={true} />
              </div>
              <p>{item.release_date}</p>
              <div className={styles['button-container']}>
                <div className={styles['review-button-container']} onClick={(e) => {
                  e.stopPropagation(); // Ensure this click doesn’t trigger parent div
                  reviewsClickHandler(item.id);
                }}>
                  {reviewedContent.includes(item.id) ? (
                    <button className={styles['button-click']}>
                      ✍🏿 Review  <br />  provided
                    </button>
                  ) : (
                    <button className={styles['button-click']}>
                      ✍️ Give <br /> Review
                    </button>
                  )}
                </div>
                <div className={styles['addfavourites-button-container']}>
                  <button
                    className={styles['button-click']}
                    onClick={(e) => toggleFavoriteHandler(e, item.id)}
                  >
                    {favorites.includes(item.id) ? '🖤Delete favorites' : '❤️Add to favorites'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className={styles['pagination-controls']}>
        <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
        <span>Page {currentPage}</span>
        <button onClick={nextPage} disabled={currentMovies.length < itemsPerPage}>Next</button>
      </div>
      {showLoginPopup && (
        <div className={styles['login-popup']}>
          Please log in to save movies to your favorites.
        </div>
      )}
    </div>
  );
};

export default MovieCards;
