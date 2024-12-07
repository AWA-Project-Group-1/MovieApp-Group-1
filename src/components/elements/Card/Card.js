import React from 'react';
import './card.css';

const MovieCard = ({ movie, onClick }) => {
    return (
        <div className="card" onClick={() => onClick(movie.id)}>
            <img
                className="card-img-top"
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
            />
            <div className="card-body">
                <h5 className="card-title">{movie.title}</h5>
            </div>
        </div>
    );
};

export default MovieCard;
