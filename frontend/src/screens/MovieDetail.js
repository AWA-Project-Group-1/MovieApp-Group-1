import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navigation from "../components/Navigation"
import sytles from "./TVDetail.module.css"
import HeroSection from '../components/HeroSection';
import Footer from "../components/Footer"
// import movieapplogo1 from "../assets/images/movieapplogo1.jpg"
import movieapplogo1 from "../assets/images/movieapplogo1.jpg"

import { fetchReviews, submitReview, deleteReview, fetchUserReview } from '../api/reviews.js'
import SubmitReview from '../components/reviews/SubmitReview'
import ReviewList from '../components/reviews/ReviewList';
import { Link, useLocation } from 'react-router-dom';

const MovieDetail = () => {
    const { id } = useParams();
    const location = useLocation();
    const [movieDetail, setMovieDetail] = useState(null);
    const [tvSerialCredit, setTvSerialCredit] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [userReview, setUserReview] = useState(null);
    const [previousReviews, setPreviousReviews] = useState([]); // State to track previous reviews data
    const [successMessage, setSuccessMessage] = useState(""); // state for success message

    const apiKey = process.env.REACT_APP_TMDB_API_KEY;  // API key
    const authorization = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4MTRkOGQyMzBhZDEyOTRjY2JkYmI2OWNjY2IwYmMyOSIsIm5iZiI6MTczMTQwMTUxNC4zNzIzMjk1LCJzdWIiOiI2NzMzMTViNjI5YWE4ZmYyNDRjMGUzODEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.0qof6UxtmX1ZydXb7hPBwnROQT3zdyKAbEXhXQ0OO4A';
    const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`;  // API endpoint to fetch movie details
    const urlforcredit = `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}&language=en-US`;


    // Fetch movie details based on movieId
    useEffect(() => {
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: authorization,
            },
        };

        fetch(url, options)
            .then((res) => res.json()) // Parse the JSON response
            .then((data) => {
                setMovieDetail(data); // Set movie details to state
                console.log(`This is the detail: ${data}`)
                console.log(data.seasons)
            })
            .catch((err) => {
                console.error('Error fetching movie details:', err); // Handle errors
            });
    }, [id]);

    useEffect(() => {
        // Extract the hash from the URL
        const hash = location.hash;

        if (hash) {
            const scrollToSection = () => {
                const element = document.getElementById(hash.substring(1)); // Remove '#' to get the ID
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            };

            // Ensure the DOM is fully loaded before scrolling
            setTimeout(scrollToSection, 300); // Delay allows the page to load fully
        }
    }, [location]);

    useEffect(() => {
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: authorization,
            },
        };
        fetch(urlforcredit, options)
            .then((res) => res.json()) // Parse the JSON response
            .then((data) => {
                setTvSerialCredit(data); // Set movie details to state
                // console.log(data)
                console.log(`This is cast length: ${data?.cast?.length}`);
                console.log(`First cast member: ${JSON.stringify(data?.cast[0])}`);
                console.log(`This is crew length: ${data?.crew?.length}`);
                console.log(`First crew member: ${JSON.stringify(data?.crew[0])}`);
            })
            .catch((err) => {
                console.error('Error fetching movie details:', err); // Handle errors
            });
    }, []);

    // Fetch reviews when the `id` changes
    const getReviews = async () => {
        try {
            const reviewsData = await fetchReviews(id, "movie");
            // Compare the current reviews with previous ones
            if (reviewsData.length !== previousReviews.length ||
                !reviewsData.every((r, idx) => r.id === previousReviews[idx]?.id)) {
                setReviews(reviewsData); // Update reviews if they have changed
                setPreviousReviews(reviewsData); // Save the new reviews as the previous ones
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    useEffect(() => {
        getReviews(); // Fetch reviews when component mounts or `id` changes
    }, [id, previousReviews]); // Trigger when `id` or `previousReviews` change

    // Handle review submission
    const handleReviewSubmit = async ({ rating, comment }) => {
        if (!rating || !comment) {
            alert('Please provide a rating and comment');
            return;
        }
        try {
            await submitReview(id, { rating, comment, type: "movie" });

            // After submitting, fetch the reviews again
            await getReviews();
            await getUserReview(); // Fetch the user's review again

            setSuccessMessage("Your review has been submitted successfully!");
            setTimeout(() => setSuccessMessage(""), 5000); // Auto-clear message
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

    // Handle review deletion
    const handleReviewDeletion = async (reviewId) => {
        const token = localStorage.getItem('token'); // Get token from localStorage

        if (!token) {
            console.error('User is not logged in.');
            return;  // Or show a message indicating the user isn't logged in
        }

        try {
            await deleteReview(reviewId, token);
            console.log('Review deleted');

            // If the deleted review is the current userReview, clear userReview
            if (userReview && userReview.id === reviewId) {
                setUserReview(null); // Clear the userReview if the user deletes their own review
            }

            // Fetch reviews again after deletion
            await getReviews();

        } catch (err) {
            console.error("Error deleting review:", err);
        }
    };

    // Fetch the logged-in user's review for the movie/show
    const getUserReview = async () => {
        try {
            const reviewData = await fetchUserReview("movie", id);
            setUserReview(reviewData); // Set the logged-in user's review
        } catch (error) {
            console.error('Error fetching user review:', error);
        }
    };

    useEffect(() => {
        if (id) {
            getUserReview(); // Fetch the user's review when the component loads or when id changes
        }
    }, [id]); // Trigger when the movie/show ID changes

    if (!movieDetail) {
        return <div>Loading...</div>;  // Show a loading message until data is fetched
    }

    const token = localStorage.getItem('token');

    return (
        <div>
            <div className={sytles['nav-hero-container']} >

                <Navigation />
                <HeroSection type="movie" />

            </div>

            <div className={sytles['movie_framework']}>

                <div className={sytles['image_container']}>
                    <img
                        src={`https://image.tmdb.org/t/p/w500${movieDetail.poster_path}`}
                        alt={movieDetail.name} />
                </div>

                <div className={sytles['information_container']}>

                    <div className={sytles['name_container']}>

                        <h2>{movieDetail.title}</h2>  {/* Display the movie title */}
                        <p>{movieDetail.overview}</p>  {/* Display movie overview */}
                    </div>

                    <div className={sytles['data_container']}>
                        <h2>Release Date:</h2>
                        <p>{movieDetail.release_date}</p>

                    </div>
                    <div className={sytles['rating_container']}>
                        <h2>Rating:</h2>
                        <p> {movieDetail.vote_average}</p>
                    </div>

                    <div className={sytles['genre_container']}>
                        <h2>Genres: </h2>
                        <p>{movieDetail.genres.map(genre => genre.name).join(', ')}</p>
                    </div>
                    {/* Display release date */}
                    {/* <p>Rating: {movieDetail.vote_average}</p>  Display rating */}
                    {/* <p>Genres: {movieDetail.genres.map(genre => genre.name).join(', ')}</p>  Display genres */}

                </div>


            </div>
            <hr />
            <div className={sytles['cast-container']}>
                <h2>Cast</h2>
                <div className={sytles['cast-scroll-container']}>
                    <div className={sytles['cast-list']}>
                        {tvSerialCredit && tvSerialCredit.cast && tvSerialCredit.cast.length > 0 ? (
                            tvSerialCredit.cast.map((actor) => (
                                <div key={actor.id} className={sytles['cast-item']}>
                                    <div className={sytles['text-container']}>
                                        <p>{actor.name.split(' ').slice(0, 2).join(' ')} as</p>
                                        <p>{actor.character.split(' ').slice(0, 2).join(' ')}</p>
                                    </div>
                                    {/* <p >{actor.name} as {actor.character}</p> */}
                                    {/* Check if profile_path exists */}
                                    <div className={sytles['actor-container']}>
                                        {actor.profile_path ? (
                                            <img
                                                className={sytles['poster-container']}
                                                src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`}
                                                alt={`Actor ${actor.name}`}
                                            />
                                        ) : (

                                            <img
                                                className={sytles['poster-container']}
                                                src={movieapplogo1}
                                                alt={`No image available for ${actor.name}`}
                                            />
                                        )}
                                    </div>

                                </div>
                            ))
                        ) : (
                            <p style={{ color: 'black' }}>No cast information available.</p>
                        )}
                    </div>
                </div>

            </div>

            {/* 
        <div className={sytles['crew-container']}>
            <h2>Crew</h2>
            <div className={sytles['crew-scroll-container']}>            
                <div className={sytles['crew-list']}>
                    { tvSerialCredit && tvSerialCredit.crew && tvSerialCredit.crew.length > 0 ? (
                        tvSerialCredit.crew.map((crew) => (
                            <div  key={crew.id} className={sytles['crew-item']}>
                                {/* <p key={crew.id} className={sytles['cast-item']}></p> */}
            {/* <p>{crew.name} </p>
                                <p> {crew.job} </p>
                        
                            </div>
                            
                        ))
                    ) : (
                        <p>No cast information available.</p>  
                    )}
                    
                </div>
            </div>

        </div> */}
            <hr />
            <div className={sytles['crew-container']}>
                <h2>Crew</h2>
                <div className={sytles['crew-scroll-container']}>
                    <div className={sytles['crew-list']}>
                        {tvSerialCredit && tvSerialCredit.crew && tvSerialCredit.crew.length > 0 ? (
                            tvSerialCredit.crew.map((crew) => (
                                <div key={crew.id} className={sytles['crew-item']}>
                                    <div><p>{crew.name}</p></div>
                                    <div><p>work as </p></div>
                                    <div> <p>{crew.job}</p></div>

                                </div>
                            ))
                        ) : (
                            <p style={{ color: 'black' }}>No cast information available.</p>   // More specific fallback message
                        )}
                    </div>
                </div>
            </div>

            {/* Review Submission Form (conditionally rendered if logged in) */}
            <div className="container center mt-4" id="reviews" >
                <hr></hr>
                <h2 style={{ marginLeft: "20px", marginTop: '60px' }}>Leave a Review</h2>
                <div className="my-3 p-3 border rounded mx-auto" style={{ maxWidth: '1440px', backgroundColor: '#f4f4f9' }}>
                    {token ? (
                        userReview ? (
                            <div style={{ marginTop: '10px' }} className="text-center my-4">
                                <p><b>Thank you for your review!</b></p>
                                <p>If you'd like to make changes, feel free to delete your review and submit a new one.</p>

                            </div>
                        ) : (
                            <SubmitReview onSubmitReview={handleReviewSubmit} movieId={id} />
                        )
                    ) : (
                        <div className="text-center my-4">
                            <p><b>Please <Link to="/sign-in" style={{ color: '#d24747' }}>sign in</Link> to submit a review.</b></p>
                        </div>
                    )}
                </div>

                {successMessage && (
                    <div className="alert alert-success mt-3 mx-auto" style={{ maxWidth: '1440px' }}>
                        {successMessage}
                    </div>
                )}
            </div>

            <div className="container text-center mt-4">
                <ReviewList
                    reviews={reviews}
                    onDeleteReview={handleReviewDeletion}
                    userReview={userReview}
                />
            </div>


            <Footer />
        </div>
    )

};

export default MovieDetail;