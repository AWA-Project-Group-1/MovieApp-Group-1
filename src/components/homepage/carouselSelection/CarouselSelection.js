import React, { useState, useEffect } from 'react';
import CustomCarousel from '../../elements/Carousel/Carousel';
import ViewAllButton from '../../elements/Button/ViewAllButton';
import './CarouselSelection.css';

const CarouselSelection = ({ title, fetchMovies, viewAllLink }) => {
    const [movies, setMovies] = useState([]);
    const [showAllMovies] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const movieData = await fetchMovies();
                setMovies(movieData);
            } catch (error) {
                console.error('Error fetching movie data:', error);
            }
        };

        fetchData();
    }, [fetchMovies]);

    const carouselMovies = movies.slice(0, 15).map((movie) => ({
        id: movie.id,
        src: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        title: movie.title,
        release_date: movie.release_date,
    }));

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
                {viewAllLink && <ViewAllButton link={viewAllLink} />}
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