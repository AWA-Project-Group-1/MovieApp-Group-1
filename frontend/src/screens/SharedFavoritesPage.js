import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './SharedFavoritesPage.module.css';
import logo from '../assets/images/movieapplogo.jpg';

const ITEMS_PER_PAGE = 10; // 5 movies + 5 series

const SharedFavoritesPage = () => {
  const { userId } = useParams();
  const [favorites, setFavorites] = useState([]);
  const [email, setEmail] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUserEmail() {
      try {
        const response = await fetch(`http://localhost:3001/api/favorites/user-email/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user email');
        }
        const data = await response.json();
        setEmail(data.email);
      } catch (error) {
        console.error('Error fetching user email:', error);
      }
    }

    async function fetchSharedFavorites() {
      try {
        const response = await fetch(
          `http://localhost:3001/api/favorites/shared-favorites/${userId}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch shared favorites from server');
        }
        const favoritesData = await response.json();

        const itemDetails = await Promise.all(
          favoritesData.map(async ({ id, title, type }) => {
            try {
              const endpoint =
                type === 'movie'
                  ? `https://api.themoviedb.org/3/movie/${id}?api_key=8e00f8de49614d9ebf140af3901aa5b5`
                  : `https://api.themoviedb.org/3/tv/${id}?api_key=8e00f8de49614d9ebf140af3901aa5b5`;

              const response = await fetch(endpoint);
              if (!response.ok) {
                throw new Error('Failed to fetch details');
              }
              const details = await response.json();
              return { ...details, type };
            } catch (error) {
              console.warn(`Failed to fetch details for ${title}:`, error);
              return { id, title, type }; // Fallback to database values
            }
          })
        );

        setFavorites(itemDetails);
      } catch (error) {
        console.error('Error fetching shared favorites:', error);
        setFavorites([]); // Fallback in case of a failure
      }
    }

    fetchUserEmail();
    fetchSharedFavorites();
  }, [userId]);

  // Group items by type
  const movies = favorites.filter((item) => item.type === 'movie');
  const tvSeries = favorites.filter((item) => item.type === 'tv');

  // Mix items: 5 movies and 5 TV series per page
  const mixedItems = [];
  for (let i = 0; i < Math.max(movies.length, tvSeries.length); i++) {
    if (i < movies.length) mixedItems.push(movies[i]);
    if (i < tvSeries.length) mixedItems.push(tvSeries[i]);
  }

  
 // Pagination logic
const startIndexMovies = (currentPage - 1) * 5; 
const startIndexSeries = (currentPage - 1) * 5; 
const visibleMovies = movies.slice(startIndexMovies, startIndexMovies + 5);
const visibleSeries = tvSeries.slice(startIndexSeries, startIndexSeries + 5);

// Combine movies and series for the current page
const visibleItems = [...visibleMovies, ...visibleSeries];
const totalPages = Math.ceil(Math.max(movies.length, tvSeries.length) / 5);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleCardClick = (item) => {
    if (item.type === 'movie') {
      navigate(`/detail/movie/${item.id}`);
    } else if (item.type === 'tv') {
      navigate(`/detail/tv/${item.id}`);
    }
  };

  return (
    <div className={styles.sharedFavoritesContainer}>
      <img src={logo} alt="Logo" className={styles.logo} />
      <button
        className={styles.homeButton}
        onClick={() => navigate('/')}>
          Go back to Homepage
      </button>
      <h1 className={styles.title}>Shared Favorites of {email}</h1>
      {visibleItems.length > 0 ? (
        <>
          {visibleItems.some((item) => item.type === 'movie') && (
            <div className={styles.section}>
              <h3 className={styles.sectionHeading}>Movies</h3>
              <div className={styles.favoritesGrid}>
                {visibleItems
                  .filter((item) => item.type === 'movie')
                  .map((item) => (
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
            </div>
          )}
          {visibleItems.some((item) => item.type === 'tv') && (
            <div className={styles.section}>
              <h3 className={styles.sectionHeading}>TV Series</h3>
              <div className={styles.favoritesGrid}>
                {visibleItems
                  .filter((item) => item.type === 'tv')
                  .map((item) => (
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
            </div>
          )}
        </>
      ) : (
        <p>No favorites available.</p>
      )}
      {mixedItems.length > ITEMS_PER_PAGE && (
        <div className={styles.pagination}>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={`${styles.pageButton} ${
                currentPage === i + 1 ? styles.activePage : ''
              }`}
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