import React, { useState } from 'react';
import Rating from './Rating';
import Commenting from './Commenting';

const SubmitReview = ({ onSubmitReview }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        // Allow submission even if the comment is empty
        onSubmitReview({ rating, comment });
        setComment("");
        setRating(0);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="ms-3">
                <br></br>
                <Rating rating={rating} setRating={setRating} />
            </div>
            <br />
            <div className="ms-3">
                <Commenting comment={comment} setComment={setComment} />
            </div>
            <div className="d-flex justify-content-end">
                <button
                    type="submit"
                    className="btn btn-danger btn-sm"
                    style={{ width: '120px' }}
                >
                    Submit
                </button>
            </div>
        </form>
    );
};

export default SubmitReview;
