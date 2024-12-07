import React from 'react';
import styles from './About.module.css';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import poster3 from "../assets/images/poster3 (2).jpg";

const About = () => {
    return (
        <div>
            {/* zindex */}
            <div style={{ position: 'relative', zIndex: 100 }}> 
                <Navigation  />

            </div>
            
            <div className="container my-5">
                <div className="row">
                    <div className="col-lg-8 offset-lg-2">
                        {/* Introduction Card */}
                        <div className="card mb-4" style={{ borderColor: '#d24747', borderWidth: '2px' }}>
                            <div className="card-header" style={{ backgroundColor: '#d24747', color: 'white' }}>
                                <h5 className="mb-0">ABOUT</h5>
                            </div>
                            <div className="card-body">
                                <p className="text-muted">
                                    This website is a platform designed for movie and TV series enthusiasts to explore movies, TV shows, showtimes, and reviews.
                                    Powered by open data from TMDB and Finnkino, it offers a rich experience for users to discover new films and TV series,
                                    as well as track showtimes at local theaters.
                                </p>
                            </div>
                        </div>

                        {/* Features Card */}
                        <div className="card mb-4" style={{ borderColor: '#d24747', borderWidth: '2px' }}>
                            <div className="card-header" style={{ backgroundColor: '#d24747', color: 'white' }}>
                                <h5 className="mb-0">Features</h5>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    {/* Movie & TV Discovery */}
                                    <div className="col-md-4 mb-3">
                                        <div className="card" style={{ borderColor: '#d24747', height: '100%' }}>
                                            <div className="card-body">
                                                <h5 className="card-title" style={{ color: '#d24747' }}>
                                                    <i className="bi bi-search"></i> Movie & TV Discovery
                                                </h5>
                                                <p className="card-text">
                                                    Search and browse movies and TV shows, discover new ones, and filter content based on genre, release date, and more with detailed information about each movie or TV show, such as synopses, cast, ratings, and more. You can explore popular, top-rated, timeless, and upcoming movies and TV shows. Whether you're interested in the latest releases or classic favorites, this platform offers a variety of options tailored to your preferences.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Responsiveness */}
                                    <div className="col-md-4 mb-3">
                                        <div className="card" style={{ borderColor: '#d24747', height: '100%' }}>
                                            <div className="card-body">
                                                <h5 className="card-title" style={{ color: '#d24747' }}>
                                                    <i class="bi bi-laptop"></i> Enjoy Full Flexibility Across Devices
                                                </h5>
                                                <p className="card-text">
                                                    Our platform is designed for flexibility, allowing you to explore your favorite movies and TV shows from anywhere and on any device.
                                                    Whether you're using a desktop, tablet, or mobile phone, the experience is seamless and user-friendly.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Reviews and Favorites */}
                                    <div className="col-md-4 mb-3">
                                        <div className="card" style={{ borderColor: '#d24747', height: '100%' }}>
                                            <div className="card-body">
                                                <h5 className="card-title" style={{ color: '#d24747' }}>
                                                    <i className="bi bi-chat-left-dots"></i> Write and Browse Reviews
                                                </h5>
                                                <p className="card-text">
                                                    Our website lets signed-in users share their thoughts on movies by adding a review, including a description and rating. Everyone can browse all the reviews and view detailed information about each one, even without signing in.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                <div className="row">

                                    {/* Favorites List */}
                                    <div className="col-md-4 mb-3">
                                        <div className="card" style={{ borderColor: '#d24747', height: '100%' }}>
                                            <div className="card-body">
                                                <h5 className="card-title" style={{ color: '#d24747' }}>
                                                    <i className="bi bi-heart"></i> Create and Share Your Favorites List
                                                </h5>
                                                <p className="card-text">
                                                    Create a personal list of favorites which will be visible on your profile page. Share this list with others via a unique link.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Random Movie Picker */}
                                    <div className="col-md-4 mb-3">
                                        <div className="card" style={{ borderColor: '#d24747', height: '100%' }}>
                                            <div className="card-body">
                                                <h5 className="card-title" style={{ color: '#d24747' }}>
                                                    <i className="bi bi-shuffle"></i> Random Movie Picker
                                                </h5>
                                                <p className="card-text">
                                                    Can't decide what to watch? Use the Random Movie Picker for a surprise suggestion and explore something new!
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Group Features */}
                                    <div className="col-md-4 mb-3">
                                        <div className="card" style={{ borderColor: '#d24747', height: '100%' }}>
                                            <div className="card-body">
                                                <h5 className="card-title" style={{ color: '#d24747' }}>
                                                    <i className="bi bi-people"></i> Group Features
                                                </h5>
                                                <p className="card-text">
                                                    Create and join groups for movie recommendations, organize watch parties, or chat with other enthusiasts. Only group members can access the group page.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    {/* Group Management */}
                                    <div className="col-md-4 mb-3">
                                        <div className="card" style={{ borderColor: '#d24747', height: '100%' }}>
                                            <div className="card-body">
                                                <h5 className="card-title" style={{ color: '#d24747' }}>
                                                    <i className="bi bi-person-plus"></i> Manage Group Members
                                                </h5>
                                                <p className="card-text">
                                                    Group owners can send invitations, remove members, or allow members to leave groups. Manage the group efficiently and enhance interaction.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Customize Group Pages */}
                                    <div className="col-md-4 mb-3">
                                        <div className="card" style={{ borderColor: '#d24747', height: '100%' }}>
                                            <div className="card-body">
                                                <h5 className="card-title" style={{ color: '#d24747' }}>
                                                    <i className="bi bi-pencil"></i> Customize Group Pages
                                                </h5>
                                                <p className="card-text">
                                                    Members can enhance the group's page with movie/showtime information, recommendations, and more.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Showtimes at Finnkino */}
                                    <div className="col-md-4 mb-3">
                                        <div className="card" style={{ borderColor: '#d24747', height: '100%' }}>
                                            <div className="card-body">
                                                <h5 className="card-title" style={{ color: '#d24747' }}>
                                                    <i className="bi bi-calendar-event"></i> Showtimes at Finnkino
                                                </h5>
                                                <p className="card-text">
                                                    Browse showtimes for movies at Finnkino theaters. You can easily find show timings for upcoming shows, without signing in.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Background Card */}
                        <div className="card mb-4" style={{ borderColor: '#d24747', borderWidth: '2px' }}>
                            <div className="card-header" style={{ backgroundColor: '#d24747', color: 'white' }}>
                                <h5 className="mb-0">Background</h5>
                            </div>
                            <div className="card-body">
                                <p className="text-muted">
                                    Developed by students of Oulu University of Applied Sciences in Fall 2024, this website combines advanced features
                                    to enhance the movie and TV series-watching experience. It is a project created as part of our coursework, aiming to provide
                                    an interactive platform for entertainment enthusiasts.
                                </p>
                                <p className="text-muted">
                                    Have questions or feedback? Reach out to us via email:
                                    <a href="mailto:your-email@example.com" className={styles.contactLink}>
                                        <i className="bi bi-envelope" style={{ color: 'black', marginLeft: '10px' }}></i>
                                    </a>
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default About; 
