import React, { useState, useEffect, useContext, useRef } from 'react';
import CarouselSelection from '../components/homepage/carouselSelection/CarouselSelection';
import CarouselSelectionTV from '../components/homepage/carouselSelection/CarouselTV';
import MoviePicker from '../components/homepage/randomMovie/MoviePicker';
import { discoverMovies, discoverOldMovies, fetchTopMovies, fetchUpcomingMovies } from '../api/movieFetch';
import { topTVSeries, discoverOldTv } from '../api/tvFetch';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navigation from "../components/Navigation";
import poster from "../assets/images/poster.png";
import poster2 from "../assets/images/poster2.jpg";
import poster3 from "../assets/images/poster3 (2).jpg";
import Footer from "../components/Footer";
import { MoiveTVSerialContext } from "../context/MoiveTVSerialProvider";
import styles from './HomePage.module.css'; // Import CSS module

const HomePage = () => {
    const [currentImage, setCurrentImage] = useState(0);
    const images = [
        { src: poster, position: '50% 75%' },
        { src: poster2, position: '50% 20%' },
        { src: poster3, position: '50% 60%' },
    ];

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentImage((prevImage) => {
                const nextImage = (prevImage + 1) % images.length;
                return nextImage;
            });
        }, 5000);

        return () => clearInterval(intervalId);
    }, [images.length]);

    const fetchPopularMovies = () => discoverMovies({ sort_by: 'popularity.desc' });
    const fetchOldMovies = () => discoverOldMovies({
        sort_by: 'release_date.asc',
        'release_date.gte': new Date().toISOString().split('T')[0],
    });
    const fetchOldTV = () => discoverOldTv({
        sort_by: 'release_date.asc',
        'release_date.gte': new Date().toISOString().split('T')[0],
    });

    const [searchQuery, setSearchQuery] = useState('');
    const moiveTVSerialData = useContext(MoiveTVSerialContext);

    const handleSearchQueryChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredMovies = moiveTVSerialData.movies?.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    const filteredTVSerials = moiveTVSerialData.tvSeries?.filter(serial =>
        serial.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const searchResultRef = useRef(null);

    useEffect(() => {
        if (searchQuery.length > 0 && searchResultRef.current) {
            searchResultRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [searchQuery]);

    return (
        <div>
            <div className={styles.navContainer} style={{ position: 'relative', zIndex: '10' }}>
                <Navigation />
            </div>

            {/* Slideshow Section */}
            <div className={styles.slideshow}>
                {images.map((image, index) => (
                    <img
                        key={index}
                        src={image.src}
                        alt={`Slideshow Image ${index + 1}`}
                        className={`${styles.slideshowImage} ${index === currentImage ? '' : 'd-none'}`}
                        style={{ objectPosition: image.position }}
                    />
                ))}

                <div className={styles.gradientOverlay}></div>

                <div className={styles.searchOverlay}>
                    <h1>Welcome to NordFlix!</h1>
                    <p>Discover Movies and TV Shows. Your Next Favorite is Just a Click Away!</p>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchQueryChange}
                        placeholder="Search by Movie or TV Serial title"
                        className={`${styles.searchInput}`}
                    />
                </div>
            </div>

            {/* Search Results Section */}
            <div ref={searchResultRef} className="mt-5" />

            {/* Filtered Movies */}
            {searchQuery.length > 0 && filteredMovies.length > 0 && (
                <CarouselSelection
                    title="Searched Movies"
                    searchedmovies={filteredMovies}
                />
            )}

            {searchQuery.length > 0 && filteredMovies.length === 0 && (
                <div className={styles.noResults}>
                    <h2 className="carousel-selection-title ms-3" style={{ marginLeft: '22px' }}>
                        <span style={{ fontSize: '50px', color: '#d24747', fontWeight: 'bold' }}>I</span>
                        Searched Movies
                    </h2>

                    <p>Sorry, no movies found matching your search. Please try again with different keywords.</p>
                </div>
            )}

            {/* Filtered TV Series */}
            {searchQuery.length > 0 && filteredTVSerials.length > 0 && (
                <CarouselSelectionTV
                    title="Searched TV Series"
                    searchedTVseries={filteredTVSerials}
                />
            )}

            {searchQuery.length > 0 && filteredTVSerials.length === 0 && (
                <div className={styles.noResults}>
                    <h2 className="carousel-selection-title ms-3" style={{ marginLeft: '22px' }}>
                        <span style={{ fontSize: '50px', color: '#d24747', fontWeight: 'bold' }}>I</span>
                        Searched TV Series
                    </h2>

                    <p>Sorry, no TV series found matching your search. Please try again with different keywords.</p>
                </div>
            )}

            <CarouselSelection
                title="Trending Movies"
                fetchMovies={fetchPopularMovies}
                viewAllLink="/movies"
            />
            <hr />

            <CarouselSelectionTV
                title="Popular TV Series"
                fetchMovies={topTVSeries}
                viewAllLink="/tvserial"
            />
            <hr />

            <div className="my-4" style={{ margin: '45px' }}>
                <MoviePicker />
            </div>
            <hr />

            <CarouselSelection
                title="Top-Tier Movies"
                fetchMovies={fetchTopMovies}
            />

            <div className="my-4" style={{ background: 'linear-gradient(to left, #d24747, white)', border: '1px solid grey' }}>
                <CarouselSelection
                    title="Timeless Movies (1900s)"
                    fetchMovies={fetchOldMovies}
                />
            </div>

            <CarouselSelection
                title="On the Horizon"
                fetchMovies={fetchUpcomingMovies}
            />

            <div className="my-4" style={{ background: 'linear-gradient(to left, #d24747, white)', border: '1px solid grey' }}>
                <CarouselSelectionTV
                    title="Classic TV Gems from the 1900s"
                    fetchMovies={fetchOldTV}
                />
            </div>

            <Footer />
        </div>
    );
}

export default HomePage;
