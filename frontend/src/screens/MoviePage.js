import React, { useState, useContext } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from "../components/Footer"
import styles from "../screens/TVSerial.module.css"
import Navigation from "../components/Navigation"
import MovieCards from "../components/MovieCards"
// import TVCards from "../components/TVCards"
import HeroSection from "../components/HeroSection"
// import { TVSeriesContext } from '../context/TVSeriesProvider';
import { MoiveTVSerialContext } from "../context/MoiveTVSerialProvider"
import {MovieGenreContext} from "../context/MovieGenreProvider"
// for the year
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// import MovieCarosel from "../components/MovieCarosel"
const MoviePage = () => {
        
    const MovieGenreData = useContext(MovieGenreContext)   
    const moiveTVSerialData = useContext(MoiveTVSerialContext)   
 
    const [selectGenre, setSelectGenre] = useState('')   
    const [selectYear, setSelectYear] = useState('');
    const [selectPopularity, setSelectPopularity] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
   

    const handleGenreChange = (event) => {
        setSelectGenre(event.target.value);
    };

    const yearChangeHandler = (date) => {
        setSelectYear(date)
    };

    const handlePopularityChange = (event) => {
        setSelectPopularity(event.target.value);
    };

    const handleSearchQueryChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredMovies = moiveTVSerialData.movies?.filter((movie) => {
        let isMatch = true;

        if (selectGenre && !movie.genre_ids.includes(Number(selectGenre))) {
            isMatch = false;
        }
        
        if (selectYear) {
            const movieYear = new Date(movie.release_date).getFullYear();
            const selectedYear = selectYear.getFullYear();
            // console.log(typeof movieYear);
            // console.log(typeof selectedYear);
            if (movieYear !== parseInt(selectedYear)) {
               
                isMatch = false;
            }
        }

        // Rating filter: Implement if necessary
        if (selectPopularity && movie.popularity <= selectPopularity) {
            isMatch = false;
        }
        // Search filter: Check if search query matches the movie title
        if (searchQuery && !movie.title.toLowerCase().includes(searchQuery.toLowerCase())) {
            isMatch = false;
        }

        return isMatch;
    });

    return (
        <div className={styles['nav-herosection-moviescard']}>
            {/* <div className={styles['nav-herosection']}>
             */}
            {/* <div className={`${styles['nav-herosection']} flex flex-col md:flex-row`}></div> */}
            <div className={`${styles['nav-herosection']} `}>
                <Navigation />
                {/* <hr /> */}
                <HeroSection  type="movie"/>
                {/* <MovieCarosel images={filteredMovies}/> */}
            </div>
            {/* <div className={styles['allfilter-container']}> */}
            <div className={`${styles['allfilter-container']} `}>

                <div className={styles['genre-filter-container']}>
                    <label >Filter by Genre : </label>             
                    <select value={selectGenre} onChange={handleGenreChange}>
                        <option value="">All</option>
                        {MovieGenreData.length > 0 ? (
                            MovieGenreData.map((genre) => (
                                <option key={genre.id} value={genre.id}>
                                    {genre.name}
                                </option>
                            ))
                        ) : (
                            <option value="" disabled>Loading genres...</option>
                        )}
                    </select>                    
                    
                </div>


                <div className={styles['year-filter-container']}>
                    <label >Filter by Year : </label>    
                    {/* <label className="text-xs sm:text-base md:text-lg lg:text-xl xl:text-2xl mb-3">Filter by Year : </label> */}
                    {/* <label>Filter by Year: </label> */}
                    <DatePicker
                            selected={selectYear}
                            onChange={ yearChangeHandler }
                            showYearPicker
                            dateFormat="yyyy"
                            className={styles["custom-datepicker"]}
                        />
                        {/* <p>Selected Year: {selectYear.getFullYear()}</p> */}

                </div>

             
                <div  className={styles['search-container']}>
                    <label >Search :  </label>
                    {/* <label className="text-xs sm:text-base md:text-lg lg:text-xl xl:text-2xl mb-3">Search :  </label> */}
                    {/* <label htmlFor="">Search: </label> */}
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchQueryChange}
                        placeholder="  Search by Movie Names"
                    />
                </div>

            </div>

            <div>
                <MovieCards movieCards={filteredMovies} />
            </div>
          
               
            <Footer />
        </div>
    );
}

export default MoviePage;

