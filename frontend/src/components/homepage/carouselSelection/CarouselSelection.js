import React, { useState, useEffect } from 'react';
import CustomCarousel from '../../elements/Carousel/Carousel';
import ViewAllButton from '../../elements/Button/ViewAllButton';
import './CarouselSelection.css';
import { fetchReviews } from "../../../api/reviews";
import 'bootstrap-icons/font/bootstrap-icons.css';

const CarouselSelection = ({ title, fetchMovies, searchedmovies, viewAllLink }) => {
    const [movies, setMovies] = useState([]);
    const [averageRatings, setAverageRatings] = useState({});
    const [reviewCounts, setReviewCounts] = useState({});

    useEffect(() => {
        if (searchedmovies) {
            setMovies(searchedmovies);
            return;
        }
        const fetchData = async () => {
            try {
                const movieData = await fetchMovies();
                setMovies(movieData);
            } catch (error) {
                console.error('Error fetching movie data:', error);
            }
        };

        fetchData();
    }, [fetchMovies, searchedmovies]);

    useEffect(() => {
        async function loadRatings() {
            const ratings = {};
            const counts = {};

            for (const movie of movies) {
                try {
                    const reviews = await fetchReviews(movie.id, 'movie');
                    const average =
                        reviews.length > 0
                            ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
                            : 0;
                    ratings[movie.id] = average;
                    counts[movie.id] = reviews.length;
                } catch (error) {
                    console.error('Error fetching reviews for movie ID:', movie.id, error);
                }
            }

            setAverageRatings(ratings);
            setReviewCounts(counts);
        }
        if (movies.length > 0) {
            loadRatings();
        }
    }, [movies]);

    const carouselMovies = movies.slice(0, 15).map((movie) => ({
        id: movie.id,
        src: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        title: movie.title,
        release_date: movie.release_date,
        averageRating: averageRatings[movie.id] || 0,
        reviewCount: reviewCounts[movie.id] || 0,
    }));

    return (
        <div className="carousel-selection">
            <div className="carousel-selection-header">
                <h2 className="carousel-selection-title"><span style={{ fontSize: '50px', color: '#d24747' }}>I</span> {title}</h2>
                {viewAllLink && <ViewAllButton link={viewAllLink} />}
            </div>
            {movies.length > 0 ? (
                <div className="carousel-selection-carousel">
                    <CustomCarousel data={carouselMovies} gridTheme={{ md: 768 }} />
                </div>
            ) : (
                <p className="carousel-selection-loading">Loading movies...</p>
            )}
        </div>
    );
};

export default CarouselSelection;
