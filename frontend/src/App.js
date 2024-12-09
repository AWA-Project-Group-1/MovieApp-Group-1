// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import MovieDetails from './screens/MovieDetailsPage';
// import AllMovies from './screens/AllMovies';
import HomePage from './screens/HomePage';
import './App.css';
import { GroupProvider } from "./context/GroupProvider";
import GroupPage from "./screens/GroupPage";
import GroupDetailsPage from "./components/GroupDetailsPage.js"; // Import new page

// heyanwen
import TVSerial from "./screens/TVSerial.js"
import MovieShowtimes from "./screens/MovieShowtimes.js"
// import TVDetail from "./screens/TVDetail.js"
import { MoiveTVSerialProvider } from "./context/MoiveTVSerialProvider"
import MoviePage from "./screens/MoviePage.js"
import MovieDetail from "./screens/MovieDetail.js";
import TVDetail from './screens/TVDetail.js';
import HeroSection from './components/HeroSection.js';
import { TVGenreProvider } from "./context/TVGenreProvider.js"
import { MovieGenreProvider } from "./context/MovieGenreProvider.js"
import Profile from './screens/ProfilePage.js';
import SharedFavoritesPage from './screens/SharedFavoritesPage.js';
import UserListPage from './screens/UserListPage';
// import TVGenreProvider from "./context/TVGenreProvider.js"


// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ShowTime from "./screens/ShowTime.js"
// import { TVSeriesProvider } from './context/TVSeriesProvider';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import { UserProvider } from './context/UserContext';

import About from './screens/About.js';

const App = () => (
  <UserProvider>
    <MoiveTVSerialProvider>
      <TVGenreProvider>
        <MovieGenreProvider>
          <GroupProvider>
            <Router>
              <Routes>
                {/* Add a new route for group functionality */}
                <Route path="/group" element={<GroupPage />} />
                <Route path="/group/:id" element={<GroupDetailsPage />} />
                <Route path="/" element={<HomePage />} />
                {/* <Route path="/movie/:id" Component={MovieDetails} /> */}
                {/* <Route path="/movies/top-rated" element={<AllMovies type="top-rated" />} />
                <Route path="/movies/upcoming" element={<AllMovies type="upcoming" />} /> */}
                <Route path='/tvserial' element={<TVSerial />} />
                <Route path='/movies' element={<MoviePage />} />
                {/* <Route path="/detail/:movieId" element={<TVDetail />} />  */}
                {/* <Route path="/showtime" element={<MovieShowtimes />} /> */}
                <Route path="/showtime" element={<ShowTime />} />
                <Route path="/detail/movie/:id" element={<MovieDetail />} />
                <Route path="/detail/tv/:id" element={<TVDetail />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/shared-favorites/:userId" element={<SharedFavoritesPage />} />
                <Route path="/user-list" element={<UserListPage />} />
                <Route path="/:tvormovie" element={<HeroSection />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/about" element={<About />} />

              </Routes>
            </Router>
          </GroupProvider>
        </MovieGenreProvider>
      </TVGenreProvider>

    </MoiveTVSerialProvider>
  </UserProvider>

);

export default App;
