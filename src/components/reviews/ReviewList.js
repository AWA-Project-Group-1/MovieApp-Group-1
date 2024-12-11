import React, { useState, useMemo, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Ensure Bootstrap Icons are imported
import { AverageStars } from '../elements/Stars/AverageStars';
import { RatingStars } from '../elements/Stars/RatingStars';

const ReviewList = ({ reviews, onDeleteReview, userReview }) => {
    const [sortOption, setSortOption] = useState('');
    const [deletedReview, setDeletedReview] = useState(null); // Holds the ID of the deleted review
    const [currentUserReview, setCurrentUserReview] = useState(userReview); // State for user review
    const [visibleReviews, setVisibleReviews] = useState(5); // Initial number of visible reviews

    // Calculate the total reviews and average rating
    const totalReviews = reviews.length;
    const averageRating = useMemo(() => {
        if (totalReviews === 0) return 0;
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        return (sum / totalReviews).toFixed(1); // Round to 1 decimal place
    }, [reviews]);

    // Count the number of reviews per rating value (1-5)
    const ratingCounts = useMemo(() => {
        const counts = [0, 0, 0, 0, 0];
        reviews.forEach((review) => {
            if (review.rating >= 1 && review.rating <= 5) {
                counts[review.rating - 1]++;
            }
        });
        return counts;
    }, [reviews]);


    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
        });
    };

    const sortReviews = (reviews) => {
        if (sortOption === 'rating-high-to-low') {
            return [...reviews].sort((a, b) => b.rating - a.rating);
        }
        if (sortOption === 'rating-low-to-high') {
            return [...reviews].sort((a, b) => a.rating - b.rating);
        }
        if (sortOption === 'date-new-to-old') {
            return [...reviews].sort(
                (a, b) => new Date(b.created_at) - new Date(a.created_at)
            );
        }
        if (sortOption === 'date-old-to-new') {
            return [...reviews].sort(
                (a, b) => new Date(a.created_at) - new Date(b.created_at)
            );
        }
        return reviews;
    };

    const sortedReviews = sortReviews(reviews);

    // Handle "Get More Reviews" button click
    const handleLoadMore = () => {
        setVisibleReviews(prev => prev + 5); // Load 5 more reviews each time
    };

    const interpolateColor = (startColor, endColor, factor) => {
        const [r1, g1, b1] = startColor;
        const [r2, g2, b2] = endColor;
        const r = Math.round(r1 + factor * (r2 - r1));
        const g = Math.round(g1 + factor * (g2 - g1));
        const b = Math.round(b1 + factor * (b2 - b1));
        return `rgb(${r}, ${g}, ${b})`;
    };

    const getColorFromRating = (rating) => {
        const purple = [48, 3, 54]; // RGB for purple
        const red = [242, 48, 48];   // RGB for red
        const factor = (rating - 1) / 4; // Calculate interpolation factor (0 to 1)
        return interpolateColor(purple, red, factor);
    };

    const handleDeleteReview = (reviewId) => {
        const confirmed = window.confirm("Are you sure you want to delete this review?");
        if (confirmed) {
            onDeleteReview(reviewId); // This calls the function passed from MovieDetail
            setDeletedReview(reviewId);
            setCurrentUserReview(null); // Remove the user's review if deleted
            setTimeout(() => setDeletedReview(null), 3000);
        }
    };

    return (
        <div>
            {/* User's Review (if available) */}
            {userReview && (
                <div className="card mb-4 shadow-sm" style={{ border: '2px solid #d24747', margin: '15px', backgroundColor: 'rgb(244, 244, 249)' }}>
                    <div className="card-body">
                        <div className="d-flex justify-content-between mb-3">
                            <span><b>{userReview.email}</b></span>
                            <div className="d-flex align-items-center ms-auto">
                                <span className="text-muted me-3">{formatTimestamp(userReview.created_at)}</span>
                                <button
                                    onClick={() => handleDeleteReview(userReview.id)}
                                    className="btn btn-link p-0 text-danger d-flex align-items-center"
                                    style={{ textDecoration: 'none' }}
                                >
                                    <i className="bi bi-trash me-1"></i>
                                </button>
                            </div>
                        </div>
                        <div className="mb-3">
                            <div className="d-flex mb-2" style={{ marginLeft: '10px' }}>
                                <RatingStars rating={(userReview.rating)} />
                            </div>
                            <p className="d-flex mb-2" style={{ marginLeft: '10px' }}>
                                {userReview.comment}
                            </p>
                        </div>
                    </div>
                </div>
            )}
            <div className="container py-5">
                <h3 className="d-flex mb-4">Reviews</h3>

                {/* If there are no reviews */}
                {totalReviews === 0 ? (
                    <div className="text-center text-muted py-5" style={{ border: '2px solid #d24747', backgroundColor: 'rgb(244, 244, 249)', borderRadius: '5px' }}>
                        <i className="bi bi-star" style={{ fontSize: '2rem', color: 'gray' }}></i>
                        <h5>No Reviews Yet</h5>
                        <p>Be the first to share your thoughts and help others!</p>
                    </div>
                ) : (

                    <div style={{ backgroundColor: '#f4f4f9', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
                        <div className="d-flex justify-content-start mb-4">
                            <div className="left-column">
                                <span style={{ fontSize: '2.8rem', fontWeight: 'bold' }}>{averageRating}</span>
                            </div>

                            <div className="right-column" style={{ marginLeft: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <div className="d-flex" >
                                    <AverageStars value={(averageRating)} showBrackets={false} />
                                </div>
                                <div>
                                    <span>from {totalReviews} reviews</span>
                                </div>
                            </div>
                        </div>

                        <div className="mb-4">
                            {ratingCounts.map((count, index) => (
                                <div key={index} className="mb-3 d-flex align-items-center">
                                    <div className="d-flex align-items-center" style={{ width: '50px' }}>
                                        <span style={{ marginRight: '10px' }}>{index + 1}</span>
                                        <i className="bi bi-star-fill" style={{ color: 'gold', fontSize: '1.3rem' }}></i>
                                    </div>
                                    <div
                                        style={{
                                            width: `${(count / totalReviews) * 100}%`,
                                            height: '10px',
                                            backgroundColor: getColorFromRating(index + 1),
                                            borderRadius: '5px',
                                            marginLeft: '10px',
                                        }}
                                    ></div>
                                    <span className="ml-2" style={{ marginLeft: '10px' }}>{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {totalReviews > 0 && (
                    <>
                        <div className="mb-3 text-end">
                            <label className="mr-2">Sort reviews by:</label>
                            <select
                                className="form-select form-select-sm d-inline-block"
                                style={{ width: '150px' }}
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                            >
                                <option value="">Options</option>
                                <option value="rating-high-to-low">Rating: High to Low</option>
                                <option value="rating-low-to-high">Rating: Low to High</option>
                                <option value="date-new-to-old">Date: New to Old</option>
                                <option value="date-old-to-new">Date: Old to New</option>
                            </select>
                        </div>

                        {sortedReviews.slice(0, visibleReviews).map((review) => (
                            <div key={review.id} className="card mb-4 shadow-sm" style={{ backgroundColor: 'rgb(244, 244, 249)' }}>
                                <div className="card-body">
                                    <div className="d-flex justify-content-between mb-3">
                                        <span><b>{review.email}</b></span>
                                        <div className="d-flex align-items-center ms-auto">
                                            <span className="text-muted me-3">{formatTimestamp(review.created_at)}</span>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <div className="d-flex mb-2" style={{ marginLeft: '10px' }}>
                                            <RatingStars rating={(review.rating)} />
                                        </div>
                                        <p className="d-flex mb-2" style={{ marginLeft: '10px' }}>
                                            {review.comment}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Load More Reviews */}
                        {visibleReviews < totalReviews && (
                            <button
                                onClick={handleLoadMore}
                                className="btn btn-sm"
                                style={{
                                    backgroundColor: '#f23030',
                                    color: 'white',
                                    marginTop: '20px',
                                    marginLeft: 'auto',
                                    marginRight: '0',
                                    display: 'inline-block',
                                    padding: '5px 10px',
                                    fontSize: '0.875rem'
                                }}
                            >
                                Get More Reviews
                            </button>
                        )}

                    </>
                )}
            </div>
        </div >
    );
};

export default ReviewList;