
import React, {useContext} from 'react';
import styles from "./HeroSection.module.css";
import { TVSeriesContext } from '../context/TVSeriesProvider';


const HeroSection = () => {
  const tvSeriesData = useContext(TVSeriesContext);
  const mostPopularSeries = tvSeriesData.reduce((prev, current) => {
    return prev.popularity > current.popularity ? prev : current;
  }, {});

  // const mostPopularSeries = tvSeriesData.filter(item = >)

  // Construct the background image URL
  const backgroundImage = mostPopularSeries?.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${mostPopularSeries.backdrop_path}` 
    : '';

  return (
    <div className={`${styles['hero-section']} text-center py-5`} style={{ 
      backgroundImage: `url(${backgroundImage})`}}>
      <div className={styles['hero-content']}>
        <h1>Discover Your Movies</h1>
        <p>Explore the top-rated and latest movies and TV shows!</p>
        <a href="/movies" className="btn btn-primary mx-2">See More</a>
      </div>
    </div>
  );
};

export default HeroSection;
