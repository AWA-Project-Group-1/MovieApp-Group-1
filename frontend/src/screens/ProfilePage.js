// Profile.js
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchFavorites, removeFromFavorites } from '../api/favoriteapi';
import Navigation from '../components/Navigation';
import axios from 'axios';
import styles from './ProfilePage.module.css';
import UserContext from '../context/UserContext';
import Footer from "../components/Footer";

const ITEMS_PER_GROUP = 5;

const Profile = () => {
  const [favorites, setFavorites] = useState([]);
  const [favoriteDetails, setFavoriteDetails] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const baseUrl = process.env.REACT_APP_BACKEND_URL;

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
                  ? `https://api.themoviedb.org/3/movie/${movie_id}?api_key=${process.env.REACT_APP_API_KEY}`
                  : `https://api.themoviedb.org/3/tv/${movie_id}?api_key=${process.env.REACT_APP_API_KEY}`;

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
      await axios.delete(`${baseUrl}/api/auth/delete-account`, {
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

  const movies = favoriteDetails.filter((item) => item.type === 'movie');
  const tvSeries = favoriteDetails.filter((item) => item.type === 'tv');

  const startIndex = (currentPage - 1) * ITEMS_PER_GROUP;
  const visibleMovies = movies.slice(startIndex, startIndex + ITEMS_PER_GROUP);
  const visibleSeries = tvSeries.slice(startIndex, startIndex + ITEMS_PER_GROUP);

  const totalPages = Math.ceil(Math.max(movies.length, tvSeries.length) / ITEMS_PER_GROUP);

  const handlePageChange = (direction) => {
    if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
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
            <div className={styles.moviesheading}>
              <h3>Movies</h3>
            </div>
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
            <div className={styles.moviesheading}>
              <h3>TV Series</h3>
            </div>
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

        <div className={styles.pagination}>
          <button
            onClick={() => handlePageChange('prev')}
            disabled={currentPage === 1}
            className={styles.pageButton}
          >
            Previous
          </button>
          <span><strong>{`Page ${currentPage} of ${totalPages}`}</strong></span>
          <button
            onClick={() => handlePageChange('next')}
            disabled={currentPage === totalPages}
            className={styles.pageButton}
          >
            Next
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
