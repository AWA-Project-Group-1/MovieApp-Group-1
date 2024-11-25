import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './SharedFavoritesPage.module.css';

const ITEMS_PER_PAGE = 10; // Number of items per page

const SharedFavoritesPage = () => {
  const { userId } = useParams();
  const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchSharedFavorites() {
      try {
        const response = await fetch(`http://localhost:3001/api/favorites/shared-favorites/${userId}`);
        const data = await response.json();

        const itemDetails = await Promise.all(
          data.map(async ({ id, type }) => {
            const endpoint =
              type === 'movie'
                ? `https://api.themoviedb.org/3/movie/${id}?api_key=8e00f8de49614d9ebf140af3901aa5b5`
                : `https://api.themoviedb.org/3/tv/${id}?api_key=8e00f8de49614d9ebf140af3901aa5b5`;

            const response = await fetch(endpoint);
            const details = await response.json();
            return { ...details, type };
          })
        );

        setFavorites(itemDetails);
      } catch (error) {
        console.error('Error fetching shared favorites:', error);
      }
    }

    fetchSharedFavorites();
  }, [userId]);

  // Calculate the range of items to display
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const visibleFavorites = favorites.slice(startIndex, endIndex); // Items for the current page

  // Calculate total pages
  const totalPages = Math.ceil(favorites.length / ITEMS_PER_PAGE);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle card click
  function handleCardClick(item) {
    if (item.type === 'movie') {
      navigate(`/detail/movie/${item.id}`);
    } else if (item.type === 'tv') {
      navigate(`/detail/tv/${item.id}`);
    }
  }

  return (
    <div className={styles.sharedFavoritesContainer}>
      <h1 className={styles.title}>Shared Favorites of user {userId}</h1>
      {visibleFavorites.length > 0 ? (
        <div className={styles.favoritesGrid}>
          {visibleFavorites.map((item) => (
            <div
              key={item.id}
              className={styles.favoriteCard}
              onClick={() => handleCardClick(item)}
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                alt={item.title || item.name}
                className={styles.favoriteImage}
              />
              <h5>{item.title || item.name}</h5>
              <p>{item.release_date || item.first_air_date}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No favorites available.</p>
      )}

      {/* Pagination Controls */}
      {favorites.length > ITEMS_PER_PAGE && (
        <div className={styles.pagination}>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={`${styles.pageButton} ${currentPage === i + 1 ? styles.activePage : ''}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SharedFavoritesPage;