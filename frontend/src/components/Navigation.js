import React, { useState,useContext} from 'react';
import { Link } from 'react-router-dom';
import styles from "./Navigation.module.css";
import movieapplogo from "../assets/images/movieapplogo.jpg";
import { useNavigate } from "react-router-dom"
import {TVGenreContext} from "../context/TVGenreProvider"
import {MovieGenreContext} from "../context/MovieGenreProvider"
import UserContext from "../context/UserContext"
// import TVGenreContext from "./context/TVGenreProvider.js"
const Navitation = () => {
  const navigate = useNavigate();
  // const [genreSelectedForTV, setGenreSelectedForTV] = useState("")
  // const [genreSelectedorMovie, setGenreSelectedForMovie] = useState("")
  const [hamburgerMenu, setHamburgerMenuMenu] = useState(false)
  const { user, setUser } = useContext(UserContext);

  function hamburgerMenuClickedHandler() {
    setHamburgerMenuMenu((prevState) => !prevState);
  }
   
  // }

  // function hamburgerMenuClickedHandler() {
  //   setHamburgerMenuMenu((prevState) => {
  //     console.log("Hamburger menu toggled: ", !prevState);
  //     return !prevState;
  //   });
  // }

  const TVGenreData= useContext(TVGenreContext) 
  const MovieGenreData= useContext(MovieGenreContext)     
  function showtimeClickHandler(){
    navigate ("/showtime")
  }

 function  signinclickedHandler(){
  navigate ("/showtime")
 }
  function tvserialClickHandler(){
    navigate ('/tvserial')

  }
  function homeclickedHandler(){
    navigate("/")

  }
  function movieclickHandler(){
    navigate("/movies")
  }

  function TVgenreInNavigationBar(genre){
    navigate(`/tvserial?genre=${genre.name}`)

  }

  function MoviegenreInNavigationBar(genre){
    navigate(`/movies?genre=${genre.name}`)

  }

  function profileclickHandler(){
    navigate("/profile")
  }
  // heyanwen added
  const logoutHandler = () => {
    setUser(null);
    localStorage.removeItem("token"); 
    localStorage.removeItem("email"); 
    localStorage.removeItem("id"); 
    localStorage.removeItem("username"); 
    navigate("/"); // Navigate to home page (or other route)
  };


  // function logoutHandler() {
  //   setUser(null);
  //   localStorage.removeItem("token");
  //   navigate("/");
  // }
  
  return (
    <div className={styles["nav-container"]}>
      <div className={styles["logo-contianer" ]} id={styles["movieapplogo-container"]}> 
        <img src={movieapplogo} alt="Movie App Logo" /> 
      </div>


      <div className={styles["hamburger-container"]}>

        <button className={styles["hamburger"]}
          onClick={hamburgerMenuClickedHandler}
          aria-label="Toggle Menu">
          <span className={hamburgerMenu && styles.active }></span>
          <span className={hamburgerMenu &&  styles.active }></span>
          <span className={hamburgerMenu &&  styles.active }></span>
        </button>

        
  
        { user ? (
        <ul className={`${hamburgerMenu ? styles["show-menu"] : styles["hide-menu"]}`}>
            <li className={styles["nav-link" ]}><Link onClick={homeclickedHandler} to="/">Home</Link></li>
            <li className={styles["nav-link" ]}><Link onClick={movieclickHandler} to="/movies">Movies</Link></li>
            <li className={styles["nav-link" ]}><Link onClick={tvserialClickHandler} to="/tvserial">TV Serial</Link></li>
            <li className={styles["nav-link" ]}><Link onClick={showtimeClickHandler} to="/showtime">Show Time</Link></li>
            <li className={styles["nav-link" ]}><Link onClick={profileclickHandler} to="/profile">Profile Page</Link></li>
            <li className={styles["nav-link" ]}><Link onClick={homeclickedHandler} to="/group">Group Page</Link></li>
            {/* <li className={styles["logout-button-hamburgerbar-container"]}> */}
              <button onClick={logoutHandler} className={styles["logout-button-hamburgerbar"]}>Logout</button>
            {/* </li> */}
          </ul>):(
            <ul className={`${hamburgerMenu ? styles["show-menu"] : styles["hide-menu"]}`}>
              <li className={styles["nav-link" ]}><Link onClick={homeclickedHandler} to="/">Home</Link></li>
              <li className={styles["nav-link" ]}><Link onClick={movieclickHandler} to="/movies">Movies</Link></li>
              <li className={styles["nav-link" ]}><Link onClick={tvserialClickHandler} to="/tvserial">TV Serial</Link></li>
              <li className={styles["nav-link" ]}> <Link onClick={showtimeClickHandler} to="/showtime">Show Time</Link></li>
              <li className={styles["nav-link" ]}><Link onClick={profileclickHandler} to="/profile">Profile</Link></li>
              <li className={styles["nav-link"]}>
                <Link to="/sign-in">Sign In</Link> | <Link to="/sign-up">Sign Up</Link>
              </li>
              {/* <li><Link onClick={signinclickedHandler} to="/sign-in">SignIn/SignUp</Link></li> */}
          </ul>
          )
          }


      </div>
      
     

     
    <ul className={styles["nav-links"]}>           

        <li className={styles["nav-link" ]}><Link onClick={homeclickedHandler} to="/">Home</Link></li>     
    
        <li className={styles["nav-link" ]} id="li1">
        
            <Link onClick={movieclickHandler} to="/movies">Movies</Link>
            <span style={{ verticalAlign: 'middle', position: 'relative', top: '-4px' }}>&#8964;</span>
            <ul className={styles["dropdown1"]}>  


              {MovieGenreData && MovieGenreData.length > 0 ? (
                MovieGenreData.map((genre) => (
                  <li key={genre.id}>
                    <a href=""  onClick={() => MoviegenreInNavigationBar(genre)}>{genre.name}</a>
                  </li>
                ))
              ) : (
                <li>No genres available</li>
              )}          
            </ul>
        </li> 


        <li className={styles["nav-link" ]} id="li1">
          <Link onClick={ tvserialClickHandler} to="/tvserial"> TV Serial</Link>
          
            <span style={{ verticalAlign: 'middle', position: 'relative', top: '-4px' }}>&#8964;</span>
            <ul className={styles["dropdown1"]}>
            {TVGenreData && TVGenreData.length > 0 ? (
              TVGenreData.map((genre) => (
                <li key={genre.id}>
                  <a href=""  onClick={() => TVgenreInNavigationBar(genre)}>{genre.name}</a>
                </li>
              ))
            ) : (
              <li>No genres available</li>
            )}
          </ul>
        </li> 


        <li className={styles["nav-link" ]} id="li1">
          <Link onClick={showtimeClickHandler} to="/showtime">Show Time</Link>
        </li >
      
       
        {user ? (
          <li className={styles["nav-link"]} style={{ backgroundColor: "  #f44336",fontWeight:"bold", borderRadius:"5px",paddingLeft:"2px"}}>
              Welcome, {user.username && user.username.length > 10 ? `${user.username.slice(0, 10)}...` : user.username || "❤️"}
              <span style={{ verticalAlign: 'middle', position: 'relative', top: '-4px', fontWeight: "lighter" }}>&#8964;</span>
           
            {/* <li  style={{ backgroundColor: "  #f44336", borderRadius:"5px",paddingLeft:"2px"}}> Welcome, {user.username || "❤️"}<span style={{ verticalAlign: 'middle', position: 'relative', top: '-4px' , fontWeight:"lighter"}}>&#8964;</span></li> */}
            {/* <li ><span style={{ verticalAlign: 'middle', position: 'relative', top: '-4px' , fontWeight:"lighter"}}>&#8964;</span></li> */}
            <ul className={styles["dropdown2"]}>  
                <li className={styles["profile-grouppage-innav"]}><Link className={styles["profile-group-link"]} onClick={homeclickedHandler} to="/profile">Profile Page</Link></li>
                <li className={styles["profile-grouppage-innav"]}><Link  className={styles["profile-group-link"]}  onClick={homeclickedHandler} to="/group">Group Page</Link></li>
                <li className={styles["profile-grouppage-innav"]}><button onClick={logoutHandler} className={styles["logout-button"]}>Logout</button></li>
            </ul>
       
          </li>
          
        ) : (
          <li className={styles["nav-link"]}>
            <Link to="/sign-in">Sign In</Link> | <Link to="/sign-up">Sign Up</Link>
          </li>
        )}
      {/* </li> */}
      </ul>
      {/* <hr style={{ border: '1px solid black', margin: '10px 0' }} /> */}
    </div>
  );
};

export default Navitation
