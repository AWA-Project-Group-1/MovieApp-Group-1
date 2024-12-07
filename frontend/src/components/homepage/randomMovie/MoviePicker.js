import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchGenres, fetchRandomMovie } from '../../../api/movieFetch';
import GenreSelector from './GenreSelector';
import RandomMovieButton from '../../elements/Button/RandomMovieButton';
import styles from './MoviePicker.module.css';

const MoviePicker = () => {
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAvailableGenres = async () => {
            try {
                const genreList = await fetchGenres();
                setGenres(genreList);
            } catch (error) {
                console.error('Error fetching genres:', error);
            }
        };

        fetchAvailableGenres();
    }, []);

    const handleRandomMovieFetch = async () => {
        setLoading(true);
        try {
            const movie = await fetchRandomMovie(selectedGenre);
            navigate(`/detail/movie/${movie.id}`);
        } catch (error) {
            console.error('Error fetching random movie:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.moviePickerContainer} >
            <h2 className={styles.randomTitle}>Need a Movie? We've Got You Covered!</h2>
            <p className={styles.description}>
                Feeling overwhelmed by the endless options? Let us help you pick
                a movie! Select a category below and discover a random movie to watch.
            </p>
            <GenreSelector
                genres={genres}
                selectedGenre={selectedGenre}
                onGenreChange={setSelectedGenre}
            />
            <RandomMovieButton
                onClick={handleRandomMovieFetch}
                loading={loading}
                disabled={!selectedGenre || loading}
            />
        </div >
    );
};

export default MoviePicker;
