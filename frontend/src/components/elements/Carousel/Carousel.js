import React from 'react';
import { Link } from 'react-router-dom';
import BearCarousel, { BearSlideCard } from 'bear-react-carousel';
import 'bear-react-carousel/dist/index.css';  // Importing the carousel's default styles
import './carouselStyles.css'; // Import custom CSS file for additional styles
import { AverageStars } from '../Stars/AverageStars';

// Photo component to display images
const Photo = ({ src, alt }) => (
    <img
        src={src}
        alt={alt}
        className="carousel-photo" // Apply class for styling
    />
);

const CarouselSlide = ({ src, title, movieId, release_date, averageRating, reviewCount }) => {
    const releaseDate = new Date(release_date);
    const formattedReleaseDate = releaseDate.toISOString().split('T')[0];


    return (
        <BearSlideCard>
            <Link to={`/detail/movie/${movieId}`} className="carousel-link">
                <div className="carousel-card">
                    <Photo src={src} alt={title} />
                    <h3 className="carousel-title">{title}</h3>
                    <div className="carousel-rating">
                        <AverageStars value={averageRating} reviewCount={reviewCount} showBrackets={true} />
                    </div>
                    <p className="carousel-release-date">{formattedReleaseDate}</p>
                </div>
            </Link>
        </BearSlideCard>
    );
};


// CustomCarousel component to render the carousel
const CustomCarousel = ({ data, gridTheme }) => {
    const slideData = data.map((row) => (
        <CarouselSlide
            key={row.id}
            src={row.src}
            title={row.title}
            movieId={row.id}
            release_date={row.release_date}
            averageRating={row.averageRating}  // Passing the average rating
            reviewCount={row.reviewCount}  // Passing the review count
        />
    ));

    return (
        <BearCarousel
            data={slideData}
            height="auto"
            slidesPerView={1}
            isEnableNavButton
            isEnableLoop={false}  // Disable looping after the last slide
            breakpoints={{
                [gridTheme.md]: {
                    slidesPerView: 5,
                    isEnablePagination: false,
                },
            }}
        />
    );
};

export default CustomCarousel;
