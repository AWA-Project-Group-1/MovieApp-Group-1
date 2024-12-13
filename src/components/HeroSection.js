
import React, { useContext,useState, useEffect} from 'react';
import styles from "./HeroSection.module.css";
// import { TVSeriesContext } from '../context/TVSeriesProvider';
import { MoiveTVSerialContext } from "../context/MoiveTVSerialProvider"

const HeroSection = ({type}) => {
  const moiveTVSerialData = useContext(MoiveTVSerialContext) 

  const backgroundImageforTV = moiveTVSerialData.tvSeries?.map(series => 
    `https://image.tmdb.org/t/p/original${series.backdrop_path}`
  ) || [];
  const backgroundImageforMovie = moiveTVSerialData.movies?.map(movie => 
    `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
  ) || [];
 
  

    //   : "";
    const images = type === "tvseries" ? backgroundImageforTV  : backgroundImageforMovie;

    // State to track the current image index
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
    // Automatically cycle through images
    useEffect(() => {
      if (images.length > 0) {
        const interval = setInterval(() => {
          setCurrentImageIndex(prevIndex => (prevIndex + 1) % images.length);
        }, 4000); 
  
        return () => clearInterval(interval); // Cleanup on component unmount
      }
    }, [images]);
  
    // Get the current background image
    const currentImage = images[currentImageIndex];
    
      return (
        <div
          className={`${styles["hero-section"]} text-center py-5`}
          style={{
            backgroundImage: `url(${currentImage})`,
            // width: "100%", 
            // height: "100%",
            // objectFit: "contain",
            backgroundSize: "cover",
            // backgroundRepeat: "no-repeat",
            backgroundPosition: "center 20%",
            // backgroundPosition: "center",
            transition: "background-image 0.5s ease-in-out",
          }}
        >
          <div className={styles["hero-content"]}>
            <h1>Discover Your {type.charAt(0).toUpperCase() + type.slice(1)}</h1>
            <h4>Explore the top-rated and latest {type} shows!</h4>
          </div>
        </div>
      );
    };
    
    export default HeroSection;