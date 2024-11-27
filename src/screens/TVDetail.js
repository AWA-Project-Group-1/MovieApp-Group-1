import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navigation from "../components/Navigation"
import sytles from "./TVDetail.module.css"
import HeroSection from '../components/HeroSection';
import Footer  from "../components/Footer"
// import movieapplogo1 from "../assets/images/movieapplogo1.jpg"
import movieapplogo from "../assets/images/movieapplogo.jpg"
const TVDetail = () => {
  const { id } = useParams();  // Get the movieId from the URL
  const [movieDetail, setMovieDetail] = useState(null);
  const [tvSerialCredit, setTvSerialCredit] = useState(null);

  const apiKey = '814d8d230ad1294ccbdbb69cccb0bc29';  // API key
  const authorization = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4MTRkOGQyMzBhZDEyOTRjY2JkYmI2OWNjY2IwYmMyOSIsIm5iZiI6MTczMTQwMTUxNC4zNzIzMjk1LCJzdWIiOiI2NzMzMTViNjI5YWE4ZmYyNDRjMGUzODEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.0qof6UxtmX1ZydXb7hPBwnROQT3zdyKAbEXhXQ0OO4A';
  const url = `https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}&language=en-US`;  // API endpoint to fetch movie details
  const urlforcredit = `https://api.themoviedb.org/3/tv/${id}/credits?api_key=${apiKey}&language=en-US`; 
//   https://api.themoviedb.org/3/credit/credit_id
  // Fetch movie details based on movieId
  useEffect(() => {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: authorization,
        },
    };

    fetch(url, options)
      .then((res) => res.json()) // Parse the JSON response
      .then((data) => {
        setMovieDetail(data); // Set movie details to state
        console.log(`This is the detail: ${data}`)
        console.log(data.seasons)
      })
      .catch((err) => {
        console.error('Error fetching movie details:', err); // Handle errors
      });
  }, [id]);

  useEffect(() => {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: authorization,
        },
    };
    fetch(urlforcredit, options)
      .then((res) => res.json()) // Parse the JSON response
      .then((data) => {
        setTvSerialCredit(data); // Set movie details to state
        // console.log(data)
        console.log(`This is cast length: ${data?.cast?.length}`);
        console.log(`First cast member: ${JSON.stringify(data?.cast[0])}`);
        console.log(`This is crew length: ${data?.crew?.length}`);
        console.log(`First crew member: ${JSON.stringify(data?.crew[0])}`);
      })
      .catch((err) => {
        console.error('Error fetching movie details:', err); // Handle errors
      });
  }, []);

  if (!movieDetail) {
    return <div>Loading...</div>;  // Show a loading message until data is fetched
  }

  return (
    <div>
        <div className={sytles['nav-herosection']} >

            <Navigation />
            <HeroSection />

        </div>

        <div className={`${sytles['movie_framework']}`}>

           {/* <div className={`${sytles['image_container']} `> */}
           <div className={ `${sytles['image_container']} w-full lg:w-1/3 flex-shrink-0`}>
                <img 
                        src={`https://image.tmdb.org/t/p/w500${movieDetail.poster_path}`} 
                        alt={movieDetail.name}   />
           </div>
            
           <div className={`${sytles['information_container']} space-y-4`}>
                <div className={sytles['name_container']}>
                    <h2>{movieDetail.name}</h2>  
                    <p>{movieDetail.overview}</p> 
                </div>
                 
                <div className={sytles['data_container']}>
                    <h2>Release Date:</h2>
                    <p>{movieDetail.first_air_date}</p>  
                </div>
                <div className={sytles['rating_container']}>
                    <h2>Rating:</h2>
                    <p> {movieDetail.vote_average}</p>  
                </div>
                <div className={sytles['genre_container']}>
                    <h2>Genres: </h2>
                    <p>{movieDetail.genres.map(genre => genre.name).join(', ')}</p> 
                </div>
                 

            </div>


        </div>
        <hr />
        {/* <div className={sytles['cast-container']}> */}
        <div className={`${sytles['cast-container']} px-4 sm:px-6 md:px-8`}>
            <h2>Cast</h2>
            <div className={sytles['cast-scroll-container']}>
                <div className={sytles['cast-list']}>                    
                    {tvSerialCredit && tvSerialCredit.cast && tvSerialCredit.cast.length > 0 ? (
                        tvSerialCredit.cast.map((actor) => (
                            <div key={actor.id} className={sytles['cast-item']}>
                                {/* <div className={sytles['text-container']}>
                                    <p >{actor.name} as </p>
                                    <p> {actor.character} </p>
                                </div> */}

                                <div className={sytles['text-container']}>
                                    <p>{actor.name.split(' ').slice(0, 2).join(' ')} as</p>
                                    <p>{actor.character.split(' ').slice(0, 2).join(' ')}</p>
                                </div>
                                
                                <div className={sytles['actor-container']}>
                                    {/* Check if profile_path exists */}
                                    {actor.profile_path ? (
                                    <img 
                                        className={sytles['poster-container']}
                                        src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`} 
                                        alt={`Actor ${actor.name}`} 
                                    />
                                ) : (
                                    
                                    <img 
                                        className={sytles['poster-container']}
                                        src={movieapplogo}
                                        alt={`No image available for ${actor.name}`} 
                                    />
                                )}

                                </div>
                                
                            </div>
                        ))
                    ) : (
                        <p style={{ color: 'black' }}> No cast information available.</p> 
                    )}
                </div>
            </div>

        </div>

{/* 
        <div className={sytles['crew-container']}>
            <h2>Crew</h2>
            <div className={sytles['crew-scroll-container']}>            
                <div className={sytles['crew-list']}>
                    { tvSerialCredit && tvSerialCredit.crew && tvSerialCredit.crew.length > 0 ? (
                        tvSerialCredit.crew.map((crew) => (
                            <div  key={crew.id} className={sytles['crew-item']}>
                                {/* <p key={crew.id} className={sytles['cast-item']}></p> */}
                                {/* <p>{crew.name} </p>
                                <p> {crew.job} </p>
                        
                            </div>
                            
                        ))
                    ) : (
                        <p>No cast information available.</p>  
                    )}
                    
                </div>
            </div>

        </div> */} 
        <hr />
        <div className={sytles['crew-container']}>
                <h2>Crew</h2>
                <div className={sytles['crew-scroll-container'] }>
                    <div className={sytles['crew-list']}>
                        {tvSerialCredit && tvSerialCredit.crew && tvSerialCredit.crew.length > 0 ? (
                            tvSerialCredit.crew.map((crew) => (
                                <div key={crew.id} className={sytles['crew-item']}>
                                    <div><p>{crew.name}</p></div>
                                    <div><p>work as </p></div>
                                    <div> <p>{crew.job}</p></div>
                                    
                                </div>
                            ))
                        ) : (
                            <p style={{ color: 'black' }}>No crew information available.</p>   // More specific fallback message
                        )}
                    </div>
                </div>
        </div>

        




        <Footer />
    </div>
  )
  
};

export default TVDetail;