import {useState, useEffect}from 'react'
import Navigation from '../components/Navigation'
import HeroSection from '../components/HeroSection'
import Footer from "../components/Footer"
import styles from "./ShowTime.module.css"
import { Link } from 'react-router-dom';
import axios from 'axios';
const ShowTime = () => {
    const [showTime, setShowTime] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; 

    const url = `https://www.finnkino.fi/xml/Schedule/`
    useEffect(() => {    
    
        fetch(url)
          .then((res) => res.text()) // Parse the JSON response
          .then((data) => {
            const parser = new DOMParser();
            const dataDocument= parser.parseFromString(data, "application/xml");
            
            const showstime = Array.from(dataDocument.getElementsByTagName("Show")).map(show => ({
                title: show.getElementsByTagName("Title")[0].textContent,
                showStart: show.getElementsByTagName("dttmShowStart")[0].textContent,
                showEnd: show.getElementsByTagName("dttmShowEnd")[0].textContent,
                theatreID: show.getElementsByTagName("TheatreID")[0].textContent,
                showUrl:show.getElementsByTagName("ShowURL")[0].textContent,
                image:show.getElementsByTagName("EventMediumImagePortrait")[0].textContent
            }));
           
            setShowTime(showstime); // Set movie details to state
            console.log(`This is the detail: ${showstime}`)
           
          })
          .catch((err) => {
            console.error('Error fetching movie details:', err); // Handle errors
          });
      }, []);
      
   

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentMovies = showTime.slice(startIndex, endIndex);
      
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
    const [area, setArea] = useState('1029');  // Default area: 'Valitse alue/teatteri'
    const [movie, setMovie] = useState('');  // Default empty movie selection
    const [showtimes, setShowtimes] = useState([]);
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');  // New state to store the selected date

    // Utility function to format the date
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const options = {
            weekday: 'long', // Full day name (e.g., "Monday")
            year: 'numeric', // Full year (e.g., "2024")
            month: 'long', // Full month name (e.g., "November")
            day: 'numeric', // Day of the month (e.g., "15")
        };
        return date.toLocaleString('en-US', options);  // You can change 'en-US' to another locale if you prefer
    };

    // Theatre areas list
    const theatreAreas = [
        { id: '1029', name: 'Valitse alue/teatteri' },
        { id: '1014', name: 'Pääkaupunkiseutu' },
        { id: '1012', name: 'Espoo' },
        { id: '1039', name: 'Espoo: OMENA' },
        { id: '1038', name: 'Espoo: SELLO' },
        { id: '1002', name: 'Helsinki' },
        { id: '1045', name: 'Helsinki: ITIS' },
        { id: '1031', name: 'Helsinki: KINOPALATSI' },
        { id: '1032', name: 'Helsinki: MAXIM' },
        { id: '1033', name: 'Helsinki: TENNISPALATSI' },
        { id: '1013', name: 'Vantaa: FLAMINGO' },
        { id: '1015', name: 'Jyväskylä: FANTASIA' },
        { id: '1016', name: 'Kuopio: SCALA' },
        { id: '1017', name: 'Lahti: KUVAPALATSI' },
        { id: '1041', name: 'Lappeenranta: STRAND' },
        { id: '1018', name: 'Oulu: PLAZA' },
        { id: '1019', name: 'Pori: PROMENADI' },
        { id: '1021', name: 'Tampere' },
        { id: '1034', name: 'Tampere: CINE ATLAS' },
        { id: '1035', name: 'Tampere: PLEVNA' },
        { id: '1047', name: 'Turku ja Raisio' },
        { id: '1022', name: 'Turku: KINOPALATSI' },
        { id: '1046', name: 'Raisio: LUXE MYLLY' },
    ];

    // Utility function to generate next 7 days' dates
    const generateNext7Days = () => {
        const dates = [];
        const today = new Date();
        for (let i = 0; i < 7; i++) {
            const nextDay = new Date(today);
            nextDay.setDate(today.getDate() + i);
            const formattedDate = nextDay.toISOString().split('T')[0];  // Format as 'yyyy-mm-dd'
            dates.push({ label: formatDate(formattedDate), value: formattedDate });
        }
        return dates;
    };

    // Fetch movies based on the selected area
    const fetchMovies = async (selectedArea) => {
        setLoading(true);
        try {
            const response = await axios.get(`https://www.finnkino.fi/xml/Schedule?area=${selectedArea}`);
            console.log('Fetched Data:', response.data);  // Log raw response to check XML data

            // Parse XML
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(response.data, 'application/xml');
            const shows = xmlDoc.getElementsByTagName('Show');

            // Extract movie titles
            const movieList = Array.from(shows).map(show => show.getElementsByTagName('Title')[0]?.textContent);

            // Remove duplicates and set movies
            setMovies([...new Set(movieList)]);
            setMovie(movieList[0] || ''); // Default to first movie if available
        } catch (error) {
            setError('Failed to fetch movies for the selected area');
        } finally {
            setLoading(false);
        }
    };

    // Fetch showtimes based on the selected area, movie, and date
    const fetchShowtimes = async (selectedArea, selectedMovie, selectedDate) => {
        setLoading(true);
        try {
            const formattedDate = selectedDate.split('-').reverse().join('.');  // Convert to dd.mm.yyyy format

            const response = await axios.get(`https://www.finnkino.fi/xml/Schedule?area=${selectedArea}&dt=${formattedDate}&nrOfDays=1`);
            console.log('Fetched Data:', response.data);  // Log raw response to check XML data

            // Parse XML
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(response.data, 'application/xml');
            const shows = xmlDoc.getElementsByTagName('Show');

            // Filter showtimes for selected movie and exact date
            const filteredShowtimes = Array.from(shows)
                .filter(show => {
                    const time = show.getElementsByTagName('dttmShowStart')[0]?.textContent;
                    if (time) {
                        const date = time.split('T')[0];  // Extract the date part (yyyy-mm-dd)
                        return show.getElementsByTagName('Title')[0]?.textContent === selectedMovie && date === selectedDate;
                    }
                    return false;
                })
                .map(show => {
                    const time = show.getElementsByTagName('dttmShowStart')[0]?.textContent;
                    const showtime = time ? time.split('T')[1] : 'N/A';  // Extract showtime part
                    return {
                        title: show.getElementsByTagName('Title')[0]?.textContent,
                        time: showtime,
                        date: time ? time.split('T')[0] : 'N/A',  // Extract date
                    };
                });

            // Set showtimes
            setShowtimes(filteredShowtimes);
        } catch (error) {
            setError('Failed to fetch showtimes');
        } finally {
            setLoading(false);
        }
    };

    // Handle area selection change
    useEffect(() => {
        if (area !== '1029') {
            fetchMovies(area);  // Fetch movies when area is selected
        }
    }, [area]);

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (area !== '1029' && movie && selectedDate) {
            fetchShowtimes(area, movie, selectedDate);  // Fetch showtimes for selected movie, area, and date
        } else {
            setError('Please select a movie, area, and date.');
        }
    };



    return (
        <div className={styles["all-container"]}>
            <div className={styles["navigation-hero-container"]} >
                <Navigation />
                <HeroSection  type="movie"/>
            </div>
            

            <>

                {/* Theatre area selection */}
            <label htmlFor="area">Select a Theatre Area: </label>
            <select id="area" value={area} onChange={(e) => setArea(e.target.value)}>
                {theatreAreas.map((areaOption) => (
                    <option key={areaOption.id} value={areaOption.id}>
                        {areaOption.name}
                    </option>
                ))}
            </select>

            {/* Movie selection */}
            <label htmlFor="movie">Select a Movie: </label>
            <select id="movie" value={movie} onChange={(e) => setMovie(e.target.value)} disabled={area === '1029'}>
                <option value="">Select a movie</option>
                {movies.map((movie, index) => (
                    <option key={index} value={movie}>{movie}</option>
                ))}
            </select>

            {/* Date selection dropdown */}
            <label htmlFor="date">Select a Date: </label>
            <select
                id="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                disabled={area === '1029' || !movie}
            >
                <option value="">Select a date</option>
                {generateNext7Days().map((dateOption) => (
                    <option key={dateOption.value} value={dateOption.value}>
                        {dateOption.label}
                    </option>
                ))}
            </select>

            <button onClick={handleSubmit} disabled={loading || area === '1029' || !movie || !selectedDate}>
                Fetch Showtimes
            </button>

            {/* Showtimes or loading/error message */}
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}

            <div>
                <h2>Showtimes:</h2>
                <ul>
                    {showtimes.map((showtime, index) => (
                        <li key={index}>{showtime.title} - {showtime.time}</li>
                    ))}
                </ul>
            </div>
       
            
        </>
            {/* <div>
                { showTime.map(
                    (item)  => (
                        <div>
                            <img src={item.image} alt="" />
                            <h2>{item.title}</h2>
                            <p>ShowTime: {item.showStart}-{item.showEnd} </p>
                            <p>Bye Ticket: {item.showUrl}</p>
                            

                        </div>
                        
                    )                    
                )}
            </div> */}
            <div className={styles["container"]}>
                {currentMovies.map((item, index) => (
                <div key={index} className={styles["show-time-container"]}>
                    
                    <div className="show-left">
                        {/* <span className={styles["status-badge"]} >{new Date(item.showStart) > new Date() ? 'Coming Soon' : 'Now Showing'}</span>
                        
                        <img src={item.image} alt={item.title} className={styles["show-image"]} /> */}
                       <div className={styles["image-container"]}>
                            <span  className={styles["status-badge"]} >
                                {new Date(item.showStart) > new Date() ? 'Coming Soon' : 'Now Showing'}
                            </span>
                            <img src={item.image} alt={item.title} className={styles["show-image"]}/>
                        </div>
                    </div>
                    <div className={styles["show-right"]}  >
                        <h3>Movie Title:</h3>
                        <h5>{item.title}</h5>
                        <h3> Show Time: </h3>
                        <h5> {item.showStart} - {item.showEnd} </h5>
                        <h5>
                        

                            <Link to={item.showUrl} className={styles["buy-ticket-button"]}>Buy Ticket</Link>

                            {/* <a href={item.showUrl} target="_blank" rel="noopener noreferrer" className="buy-ticket-button">
                                Buy Ticket
                            </a> */}
                        </h5>
                    </div>

                    <div className={styles["show-rightmost"]}>

                    </div>
                </div>
                ))}
            </div>

            <div className={styles['pagination-controls']}>
                <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
                <span>Page {currentPage}</span>
                <button onClick={nextPage} disabled={currentMovies.length < itemsPerPage}>Next</button>
            </div>
        <Footer />
        </div>
    )
}

export default ShowTime
