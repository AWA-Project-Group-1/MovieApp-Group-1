import React, { useState, useEffect } from 'react';
import { fetchTopMovies } from '../../../api/movieFetch';  // Example API function for fetching top movies
import CustomCarousel from '../../elements/Carousel/Carousel';  // Assuming CustomCarousel is the carousel component
import ViewAllButton from '../../elements/Button/ViewAllButton';  // Import ViewAllButton component
import './CarouselSelection.css';  // Import the CSS file

const CarouselSelection = ({ title, fetchMovies, viewAllLink }) => {
    const [movies, setMovies] = useState([]);
    const [showAllMovies, setShowAllMovies] = useState(false);  // State to toggle between showing first 10 and all movies

    useEffect(() => {
        const fetchData = async () => {
            try {
                const movieData = await fetchMovies();
                setMovies(movieData); // Store the fetched movies in state
            } catch (error) {
                console.error('Error fetching movie data:', error);
            }
        };

        fetchData(); // Fetch movies when the component mounts
    }, [fetchMovies]);

    // Show first 10 movies for carousel
    const carouselMovies = movies.slice(0, 15).map((movie) => ({
        id: movie.id,
        src: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        title: movie.title,
        release_date: movie.release_date,
    }));

    // Show all movies when "View All" button is clicked
    const allMovies = movies.map((movie) => ({
        id: movie.id,
        src: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        title: movie.title,
        release_date: movie.release_date,
    }));

    return (
        <div className="carousel-selection">
            <div className="carousel-selection-header">
                <h2 className="carousel-selection-title">{title}</h2>
                {/* Using ViewAllButton to toggle the view */}
                <ViewAllButton link={viewAllLink} onClick={() => setShowAllMovies(!showAllMovies)} />
            </div>

            {movies.length > 0 ? (
                <div className="carousel-selection-carousel">
                    <CustomCarousel data={showAllMovies ? allMovies : carouselMovies} gridTheme={{ md: 768 }} />
                </div>
            ) : (
                <p className="carousel-selection-loading">Loading movies...</p>
            )}
        </div>
    );
};

export default CarouselSelection;
