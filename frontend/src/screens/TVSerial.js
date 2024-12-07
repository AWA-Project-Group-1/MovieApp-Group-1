import React, { useState, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from "../components/Footer"
import styles from "../screens/TVSerial.module.css"
import Navigation from "../components/Navigation"
import TVCards from "../components/TVCards"
import HeroSection from "../components/HeroSection"
// import { TVSeriesContext } from '../context/TVSeriesProvider';
import { MoiveTVSerialContext } from "../context/MoiveTVSerialProvider"
import {TVGenreContext} from "../context/TVGenreProvider"
// for the year
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


// import MovieCarosel from "../components/MovieCarosel"
const TVSerial = () => {
    // const tvSeriesData = useContext(TVSeriesContext);
   
    const moiveTVSerialData = useContext(MoiveTVSerialContext) 
    const TVGenreData = useContext(TVGenreContext)   
    // const [genres, setGenres] = useState([]);

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

    const filteredMovies = moiveTVSerialData.tvSeries?.filter((movie) => {
        let isMatch = true;

        if (selectGenre && !movie.genre_ids.includes(Number(selectGenre))) {
            isMatch = false;
        }
        
        if (selectYear) {
            const movieYear = new Date(movie.first_air_date).getFullYear();
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
        if (searchQuery && !movie.name.toLowerCase().includes(searchQuery.toLowerCase())) {
            isMatch = false;
        }

        return isMatch;
    });

    return (
        <div className={styles['nav-herosection-moviescard']}>
            {/* <div className={styles['nav-herosection']}> */}
            <div className={`${styles['nav-herosection']}`}>
                <Navigation />               
                <HeroSection type="tvserial"  />
           
            </div>
            {/* <div className={styles['allfilter-container']}> */}
            {/* <div className={`${styles['allfilter-container']} flex flex-col md:flex-row justify-between gap-4`}> */}
            <div className={styles['allfilter-container']}>            

                <div className={styles['genre-filter-container']}>
                    <label >Filter by Genre : </label>
                    <select value={selectGenre} onChange={handleGenreChange}>
                        <option value="">All</option>
                        {TVGenreData.length > 0 ? (
                            TVGenreData.map((genre) => (
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
                    <label >Search:  </label>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchQueryChange}
                        placeholder="  Search by TV Serial title"
                    />
                </div>

            </div>

            <div className={styles['tvcards-contianer']}>
                <TVCards movieCards={filteredMovies} />
            </div>

            <Footer />
        </div>
    );
}

export default TVSerial;

