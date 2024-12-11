import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './SharedFavoritesPage.module.css';
import logo from '../assets/images/movieapplogo.jpg';
import Footer from '../components/Footer';

const ITEMS_PER_PAGE = 10;

const SharedFavoritesPage = () => {
  const { userId } = useParams();
  const [favorites, setFavorites] = useState([]);
  const [email, setEmail] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const baseUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    async function fetchUserEmail() {
      try {
        const response = await fetch(`${baseUrl}/api/favorites/user-email/${userId}`);
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
          `${baseUrl}/api/favorites/shared-favorites/${userId}`
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
                  ? `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.REACT_APP_API_KEY}`
                  : `https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.REACT_APP_API_KEY}`;

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

  const movies = favorites.filter((item) => item.type === 'movie');
  const tvSeries = favorites.filter((item) => item.type === 'tv');

  const startIndex = (currentPage - 1) * 5;
  const visibleMovies = movies.slice(startIndex, startIndex + 5);
  const visibleSeries = tvSeries.slice(startIndex, startIndex + 5);

  const totalPages = Math.ceil(Math.max(movies.length, tvSeries.length) / 5);

  const handlePageChange = (direction) => {
    if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
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
      <button className={styles.homeButton} onClick={() => navigate('/')}>
        Go back to Homepage
      </button>
      <h1 className={styles.title}>Shared Favorites of {email}</h1>
      {visibleMovies.length > 0 && (
        <>
          <h3 className={styles.sectionHeading}>Movies</h3>
          <div className={styles.favoritesGrid}>
            {visibleMovies.map((item) => (
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
        </>
      )}
      {visibleSeries.length > 0 && (
        <>
          <h3 className={styles.sectionHeading}>TV Series</h3>
          <div className={styles.favoritesGrid}>
            {visibleSeries.map((item) => (
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
        </>
      )}
      <div className={styles.pagination}>
        <button
          onClick={() => handlePageChange('prev')}
          disabled={currentPage === 1}
          className={styles.pageButton}
        >
          Previous
        </button>
        <span>
          <strong>{`Page ${currentPage} of ${totalPages}`}</strong>
        </span>
        <button
          onClick={() => handlePageChange('next')}
          disabled={currentPage === totalPages}
          className={styles.pageButton}
        >
          Next
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default SharedFavoritesPage;
