// import { useNavigate, useLocation } from 'react-router-dom';
// import React, {useState,useContext} from 'react'
import { useNavigate,useParams, useLocation } from 'react-router-dom';
import React, {useState,useContext} from 'react'
import styles from "./MovieCards.module.css"
import {MovieGenreContext} from "../context/MovieGenreProvider"
const MovieCards = ({ movieCards}) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; 


  const location = useLocation();
  const queryParams = new URLSearchParams(location.search); // To parse query parameters
  const genreName = queryParams.get('genre');
  // Calculate the index range for the current page
  const genreList = useContext(MovieGenreContext);

  const filteredMovies = genreName
  ? movieCards.filter((movie) => {
      // For each movie, map its genre IDs to genre names
      const movieGenreNames = movie.genre_ids.map(
        (id) => genreList.find((genre) => genre.id === id)?.name
      );

      // Filter movies whose genres match the genreName from the URL
      return movieGenreNames.includes(genreName);
    })
  : movieCards;

  // Calculate the index range for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMovies = filteredMovies.slice(startIndex, endIndex);


  function productClickHandler(movieId){
    // console.log("This is movieTVSerialData:", data);
    navigate(`/detail/movie/${movieId}`);
  }

  function addButtonClickHandler(event){
    event.stopPropagation();
    navigate(`/profile`);
    
  }
// for th navi from page to page
  function nextPage() {
    if (currentMovies.length === itemsPerPage) {
      setCurrentPage(currentPage + 1);
    }
  }

  function prevPage() {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }


  return (
    <div>
      <div className={styles['productcards_container']} > {/* Apply the class here */}
      { currentMovies.map(item => (
        <div 
          className={styles['product-card-framework']} 
          onClick={() => productClickHandler(item.id)}  
          key={item.id}>
          <img className={styles['product-card']} src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} alt={item.name} />
         
          <h5>{item.title}</h5>
          
          <p>{item.release_date}</p>
          <div className={styles['button-container']}>
            <button className={styles['button-click']} onClick={addButtonClickHandler}>Add to favourite</button>
          </div>
        </div>
      ))}
      
      </div>
        <div className={styles['pagination-controls']}>
          <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
          <span>Page {currentPage}</span>
          <button onClick={nextPage} disabled={currentMovies.length < itemsPerPage}>Next</button>
        </div>
    </div>
    
    
  );
};

export default MovieCards