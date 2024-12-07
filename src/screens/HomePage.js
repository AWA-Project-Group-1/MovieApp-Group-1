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
        'release_date.gte': new Date().toISOString().split('T')[0],  // Ensures only upcoming movies
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
            <div style={{ position: 'relative', zIndex: 10 }}>{/*  heyanwen made  */}
                <Navigation />
            </div>

            {/* Slideshow Section */}
            <div
                className="position-relative overflow-hidden w-100"
                style={{ height: '85vh' }}  // Adjust the height of the slideshow based on viewport height (60% of screen height)
            >
                {images.map((image, index) => (
                    <img
                        key={index}
                        src={image.src}
                        alt={`Slideshow Image ${index + 1}`}
                        className="w-100 h-100 position-absolute"
                        style={{
                            objectFit: 'cover',
                            objectPosition: image.position,
                            top: 0,
                            left: 0,
                            zIndex: index === currentImage ? 0 : -1,
                        }}
                    />
                ))}

                {/* Search Overlay */}
                <div
                    className="d-flex flex-column align-items-center justify-content-center position-absolute w-100 h-100"
                    style={{
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 0,
                        color: 'white',
                        textAlign: 'center',
                    }}
                >
                    <h1 className="display-4" style={{ fontWeight: 'bold', fontSize: '3rem', color: 'white' }}>Welcome to NordFlix!</h1>
                    <p className="lead" style={{ fontSize: '1.25rem', color: 'white' }}>Discover Movies and TV Shows. Your Next Favorite is Just a Click Away!</p>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchQueryChange}
                        placeholder="Search by Movie or TV Serial title"
                        className="form-control w-75 w-md-50"
                        style={{
                            borderRadius: '15px',
                            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                            maxWidth: '750px',
                            height: '45px',
                            marginTop: '30px'
                        }}
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
                <div style={{ marginLeft: '25px' }}>
                    <h2 className="carousel-selection-title ms-3" >Searched Movies</h2>
                    <p style={{ marginLeft: '25px', marginTop: '20px' }}>Sorry, no movies found matching your search. Please try again with different keywords.</p>
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
                <div style={{ marginLeft: '25px', marginTop: '30px' }}>
                    <h2 className="carousel-selection-title ms-3 mt-3">Searched TV Series</h2>
                    <p style={{ marginLeft: '25px', marginTop: '20px' }}>Sorry, no TV series found matching your search. Please try again with different keywords.</p>
                </div>
            )}

            <CarouselSelection
                title="Trending Movies"
                fetchMovies={fetchPopularMovies}
                viewAllLink="/movies"
            />
            <hr></hr>

            <CarouselSelection
                title="Top Movies"
                fetchMovies={fetchTopMovies}
            />

            <hr></hr>

            <div className="my-4" style={{ margin: '40px' }}>
                <MoviePicker />
            </div>

            <hr></hr>

            <CarouselSelection
                title="Timeless Movies (1900s)"
                fetchMovies={fetchOldMovies}
            />

            <hr></hr>

            <CarouselSelection
                title="Coming Soon"
                fetchMovies={fetchUpcomingMovies}
            />

            <hr></hr>

            <CarouselSelectionTV
                title="Popular TV Series"
                fetchMovies={topTVSeries}
                viewAllLink="/tvserial"
            />

            <hr></hr>

            <CarouselSelectionTV
                title="Classic TV Gems from the 1900s" // Changed title
                fetchMovies={fetchOldTV} // Changed function to fetch top rated TV series
            />

           <Footer />

        </div>
    );
}

export default HomePage;
