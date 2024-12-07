import React, { useState } from "react";
import "./Commenting.css";

const Commenting = ({ comment, setComment }) => {
    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    return (
        <textarea
            className="full-width-textarea"
            value={comment}
            onChange={handleCommentChange}
            placeholder="Add your comment"
        />
    );
};

export default Commenting;
