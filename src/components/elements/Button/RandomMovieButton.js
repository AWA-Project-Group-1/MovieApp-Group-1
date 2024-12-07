// RandomMovieButton.js
import React from 'react';

const RandomMovieButton = ({ onClick, loading, disabled }) => {
    return (
        <button onClick={onClick} disabled={disabled}>
            {loading ? 'Loading...' : 'Pick a Movie!'}
        </button>
    );
};

export default RandomMovieButton;
