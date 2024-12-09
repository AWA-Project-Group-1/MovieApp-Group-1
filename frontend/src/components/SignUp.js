import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/movieapplogo.jpg";
import "./SignUp.css";

const baseUrl = process.env.REACT_APP_BACKEND_URL;

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async () => {
    try {
      await axios.post(
        `${baseUrl}/api/auth/signup`,
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );
      setMessage("Sign up successful! Redirecting to sign in...");
      setEmail("");
      setPassword("");
      setTimeout(() => {
        navigate("/sign-in"); // Jump to sign in page
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.error || "Sign up failed");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <img src={logo} alt="Logo" className="logo" />
        <h2>Sign Up</h2>
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
        <button onClick={handleSignUp}>Sign Up</button>
        <p>
          Already have an account?{" "}
          <button onClick={() => navigate("/")}>Sign In</button>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
