import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Placeholder from "./components/Placeholder"; // Used as a temporary homepage to show whether the login is successful
// import Homepage from "./components/Homepage"; // Waiting for addition homepage
// import CommentFeature from "./components/CommentFeature"; // Waiting for addition feature
// import Favorites from "./components/Favorites"; // Waiting for addition favorites
// import ProtectedRoute from "./components/ProtectedRoute"; // ProtectedRoute component
import UserContext from "./context/UserContext"; // Introducing UserContext

function App() {
  const [user, setUser] = useState(null); // User login status

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        <Routes>
          {/* Routes accessible to visitors */}
          <Route path="/" element={<SignIn setUser={setUser} />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/homepage" element={<Placeholder />} /> {/* Temporary homepage */}
          
          {/* Routes that require login */}
          {/* <Route
            path="/homepage"
            element={
              <ProtectedRoute user={user}>
                <Homepage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/comments"
            element={
              <ProtectedRoute user={user}>
                <CommentFeature />
              </ProtectedRoute>
            }
          />
          <Route
            path="/favorites"
            element={
              <ProtectedRoute user={user}>
                <Favorites />
              </ProtectedRoute>
            }
          /> */}
        </Routes>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
