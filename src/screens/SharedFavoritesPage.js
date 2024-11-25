import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './SharedFavoritesPage.module.css';

const SharedFavoritesPage = () => {
  const { userId } = useParams(); // Get the userId from the URL
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    async function fetchSharedFavorites() {
      try {
        const response = await fetch(`http://localhost:3001/api/favorites/shared-favorites/${userId}`);
        const data = await response.json();

        // Fetch detailed data for each favorite item
        const itemDetails = await Promise.all(
          data.map(async ({ id, type }) => {
            const endpoint =
              type === 'movie'
                ? `https://api.themoviedb.org/3/movie/${id}?api_key=8e00f8de49614d9ebf140af3901aa5b5`
                : `https://api.themoviedb.org/3/tv/${id}?api_key=8e00f8de49614d9ebf140af3901aa5b5`;

            const response = await fetch(endpoint);
            const details = await response.json();
            return { ...details, type }; // Attach the type to the data
          })
        );

        setFavorites(itemDetails); // Store the detailed items
      } catch (error) {
        console.error('Error fetching shared favorites:', error);
      }
    }

    fetchSharedFavorites();
  }, [userId]);

  // Handle card click to redirect to the details page
  function handleCardClick(item) {
    if (item.type === 'movie') {
      navigate(`/detail/movie/${item.id}`); // Redirect to movie details page
    } else if (item.type === 'tv') {
      navigate(`/detail/tv/${item.id}`); // Redirect to TV series details page
    }
  }

  return (
    <div className={styles.sharedFavoritesContainer}>
      <h1 className={styles.title}>Shared Favorites of user {userId} </h1>
      {favorites.length > 0 ? (
        <div className={styles.favoritesGrid}>
          {favorites.map((item) => (
            <div
              key={item.id}
              className={styles.favoriteCard}
              onClick={() => handleCardClick(item)} // Add click handler
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
    </div>
  );
};

export default SharedFavoritesPage;