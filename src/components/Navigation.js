import React from 'react';
import styles from "./Navigation.module.css";
import movieapplogo from "../assets/images/movieapplogo.jpg";
import { useNavigate } from "react-router-dom"

const Navitation = ({genres}) => {
  const navigate = useNavigate();
  
  function showtimeClickHandler(){
    navigate ("/showtime")
  }
 const moviegenre = [ "Action","Adventure","Animation", "Comedy", "Crime", "Documentary", "Drama",
  "Family",
  "Fantasy",
  "History",
  "Horror",
  "Music",
  "Mystery",
  "Romance",
  "Science Fiction",
  "TV Movie",
  "Thriller",
  "War",
  "Western"
]
  function tvserialClickHandler(){
    navigate ('/tvserial')

  }
  function homeclickedHandler(){
    navigate("/")

  }
  function movieclickHandler(){
    navigate("/")
  }
  function groupPageClickHandler() {
    navigate("/group");
  }

  
  return (
    <div className={styles["nav-container"]}>
      <div className={styles["nav-link" ]} id={styles["movieapplogo-container"]}> 
        <img src={movieapplogo} alt="Movie App Logo" /> {/* Added meaningful alt text */}
      </div>
      {/* <li className={styles["nav-link" ]} id={styles["movieapplogo-container"]}> */}
                {/* <img src={movieapplog} alt="Movie App Logo" /> Added meaningful alt text */}
            {/* </li> */}
        <ul className={styles["nav-links"]}>

            

            <li className={styles["nav-link" ]}><a href="" onClick={ homeclickedHandler}>Home</a> </li>     
        
            <li className={styles["nav-link" ]} id="li1">
                <a href="" onClick={movieclickHandler}>Movie  </a>
                <span style={{ verticalAlign: 'middle', position: 'relative', top: '-6px' }}>&#8964;</span>
                <ul className={styles["dropdown1"]}>  


                  {
                    moviegenre.map( (movie ) =>
                      <li><a href="">{movie}</a></li>
                    )
                  }               
                </ul>
            </li> 
            <li className={styles["nav-link" ]} id="li1">
                <a href="" onClick={ tvserialClickHandler }>TV Serial  </a>
                <span style={{ verticalAlign: 'middle', position: 'relative', top: '-6px' }}>&#8964;</span>
                <ul className={styles["dropdown1"]}>
                {genres && genres.length > 0 ? (
                  genres.map((genre) => (
                    <li key={genre.id}>
                      <a href="pdffiles.html">{genre.name}</a>
                    </li>
                  ))
                ) : (
                  <li>No genres available</li>
                )}
          </ul>
            </li> 
            <li className={styles["nav-link" ]} id="li1">
                <a href="" onClick={ showtimeClickHandler}>Show Time  </a>
            </li >
          
            <li className={styles["nav-link"]}>
              <a href="" onClick={groupPageClickHandler}>Group Page</a>
            </li>
            
        </ul>
        <hr style={{ border: '1px solid balck', margin: '10px 0' }} />
                        

    </div>
        
             
    
  )
}

export default Navitation
