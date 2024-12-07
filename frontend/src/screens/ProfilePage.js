import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchFavorites, removeFromFavorites } from '../api/favoriteapi';
import Navigation from '../components/Navigation';
import axios from 'axios';
import styles from './ProfilePage.module.css';
import UserContext from '../context/UserContext';

const ITEMS_PER_GROUP = 5; // 5 movies + 5 TV series per page

const Profile = () => {
  const [favorites, setFavorites] = useState([]);
  const [favoriteDetails, setFavoriteDetails] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    async function getFavorites() {
      try {
        if (user?.token) {
          const response = await fetchFavorites(user.token);
          const favoriteItems = response.data;

          const details = await Promise.all(
            favoriteItems.map(async ({ movie_id, type }) => {
              const endpoint =
                type === 'movie'
                  ? `https://api.themoviedb.org/3/movie/${movie_id}?api_key=8e00f8de49614d9ebf140af3901aa5b5`
                  : `https://api.themoviedb.org/3/tv/${movie_id}?api_key=8e00f8de49614d9ebf140af3901aa5b5`;

              const response = await fetch(endpoint);
              return { ...(await response.json()), type };
            })
          );

          setFavorites(favoriteItems);
          setFavoriteDetails(details);
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    }
    getFavorites();
  }, [user]);

  const handleDeleteAccount = async () => {
    if (!user?.token) return;

    const confirmDelete = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );
    if (!confirmDelete) return;

    try {
      await axios.delete('http://localhost:3001/api/auth/delete-account', {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      alert('Your account has been deleted.');

      setUser(null);
      localStorage.clear();

      navigate('/sign-up');
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account. Please try again later.');
    }
  };

  async function removeButtonClickHandler(movieId) {
    if (!user?.token) return;

    try {
      await removeFromFavorites(movieId, user.token);
      setFavorites(favorites.filter((item) => item.movie_id !== movieId));
      setFavoriteDetails(favoriteDetails.filter((item) => item.id !== movieId));
    } catch (error) {
      console.error('Error removing item from favorites:', error);
    }
  }

  // Group items by type
  const movies = favoriteDetails.filter((item) => item.type === 'movie');
  const tvSeries = favoriteDetails.filter((item) => item.type === 'tv');

  // Mix items: 5 movies and 5 TV series per page
  const mixedItems = [];
  for (let i = 0; i < Math.max(movies.length, tvSeries.length); i++) {
    if (i < movies.length) mixedItems.push(movies[i]);
    if (i < tvSeries.length) mixedItems.push(tvSeries[i]);
  }

  // Pagination logic
  const startIndex = (currentPage - 1) * ITEMS_PER_GROUP * 2;
  const visibleMovies = movies.slice(startIndex / 2, startIndex / 2 + ITEMS_PER_GROUP);
  const visibleSeries = tvSeries.slice(startIndex / 2, startIndex / 2 + ITEMS_PER_GROUP);

  const totalPages = Math.ceil(Math.max(movies.length, tvSeries.length) / ITEMS_PER_GROUP);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const shareableLink = user?.id
    ? `${window.location.origin}/shared-favorites/${user.id}`
    : 'Loading...';

  const copyToClipboard = () => {
    if (!user?.id) {
      alert('User ID not available. Please try again later.');
      return;
    }
    navigator.clipboard.writeText(shareableLink);
    alert('Sharable link copied to clipboard!');
  };

  return (
    <div>
      <Navigation />
      <div className={styles.profileContainer}>
        <h1>Profile</h1>
        <p>Welcome to your profile site</p>
        <div className={styles.profileDetails}>
          <div>
            <label>Email:</label>
            <span>{user?.email || 'No email available'}</span>
          </div>
        </div>
        <div className={styles.shareableLinkContainer}>
          <button onClick={copyToClipboard} className={styles.copyButton}>
            Copy Link to share favorites
          </button>
        </div>
        <div className={styles.deleteAccountContainer}>
          <button onClick={handleDeleteAccount} className={styles.deleteAccountButton}>
            Delete My Account
          </button>
        </div>
        <div className={styles.userListButtonContainer}>
            <button onClick={() => navigate('/user-list')} className={styles.userListButton}>
            View All Users
          </button>
</div>
      </div>
      <div className={styles.favoritesContainer}>
        <h2 className={styles.favoritesHeading}>Your Favorites</h2>

        {visibleMovies.length > 0 && (
          <>
            <h3>Movies</h3>
            <div className={styles.moviesContainer}>
              {visibleMovies.map((item) => (
                <div
                  key={item.id}
                  className={styles.movieCard}
                  onClick={() => navigate(`/detail/${item.type}/${item.id}`)}
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                    alt={item.title || item.name}
                    className={styles.movieImage}
                  />
                  <h5>{item.title}</h5>
                  <p>{item.release_date}</p>
                  <button
                    className={styles.removeButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeButtonClickHandler(item.id);
                    }}
                  >
                    Remove from favorites
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {visibleSeries.length > 0 && (
          <>
            <h3>TV Series</h3>
            <div className={styles.moviesContainer}>
              {visibleSeries.map((item) => (
                <div
                  key={item.id}
                  className={styles.movieCard}
                  onClick={() => navigate(`/detail/${item.type}/${item.id}`)}
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                    alt={item.name}
                    className={styles.movieImage}
                  />
                  <h5>{item.name}</h5>
                  <p>{item.first_air_date}</p>
                  <button
                    className={styles.removeButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeButtonClickHandler(item.id);
                    }}
                  >
                    Remove from favorites
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {mixedItems.length > ITEMS_PER_GROUP && (
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
    </div>
  );
};

export default Profile;