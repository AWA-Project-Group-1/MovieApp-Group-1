import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/movieapplogo.jpg";
import "./SignIn.css";
import UserContext from "../context/UserContext";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleSignIn = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/auth/signin",
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("email", email);
      localStorage.setItem("id", response.data.id);
      localStorage.setItem("username", response.data.username); //heyanwen added
      localStorage.setItem("email", response.data.email);//heyanwen added

      // Set global user information
      setUser({ token: response.data.token, email, id: response.data.id, username: response.data.username });

      setMessage("Sign in successful");
      setEmail("");
      setPassword("");
      navigate("/"); // Jump to homepage after signing in
    } catch (error) {
      if (error.response) {
        setMessage(`Error: ${error.response.data.error}`);
      } else if (error.request) {
        setMessage("No response received from the server");
      } else {
        setMessage(`Request error: ${error.message}`);
      }
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-form">
        <img src={logo} alt="Logo" className="logo" />
        <h2>Sign In</h2>
        {message && <div className="message">{message}</div>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleSignIn}>Sign In</button>
        <p>
          Don't have an account?{" "}
          <button onClick={() => navigate("/sign-up")}>Sign Up</button>
        </p>
      </div>
    </div>
  );
}

export default SignIn;
