import React from 'react';

const Rating = ({ rating, setRating }) => {
    const handleStarClick = (value) => {
        setRating(value);
    };

    return (
        <div className="d-flex justify-content-start">
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    className={`bi ${star <= rating ? 'bi-star-fill text-warning' : 'bi-star text-muted'}`}
                    onClick={() => handleStarClick(star)}
                    style={{ cursor: 'pointer', fontSize: '1.5em' }}
                ></span>
            ))}
        </div>
    );
};

export default Rating;
