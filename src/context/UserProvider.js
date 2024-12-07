import { useState, useEffect } from "react";
import { UserContext } from "./UserContext.js";
import axios from 'axios';

const url = process.env.REACT_APP_API_URL;

export default function UserProvider({children}) {
    const userFromSessionStorage = sessionStorage.getItem('user');
    const tokenFromSessionStorage = sessionStorage.getItem('token');

    const [user, setUser] = useState(
        userFromSessionStorage ? JSON.parse(userFromSessionStorage) : { email: "", password: "" }
    );
    
    useEffect(() => {
        console.log("Initializing UserProvider...");
        console.log("User from sessionStorage:", userFromSessionStorage);
        console.log("Token from sessionStorage:", tokenFromSessionStorage);
    
        if (userFromSessionStorage && tokenFromSessionStorage) {
          setUser({ ...JSON.parse(userFromSessionStorage), token: tokenFromSessionStorage });
        } else {
          console.warn("No user or token found in sessionStorage");
        }
    }, [userFromSessionStorage, tokenFromSessionStorage]);

    const signUp = async () => {
        const json = JSON.stringify(user);
        const headers = {headers: {'Content-Type': 'application/json'}};
        
        try {
            console.log("Attempting to sign up with:", user); // debug
            await axios.post(url + '/user/register', json, headers);
            setUser({email: '', password: ''});
        } catch (error) {
            throw error;
        }
    };

    const signIn = async () => {
        const json = JSON.stringify(user);
        const headers = {headers: {'Content-Type': 'application/json'}};
        console.log("Attempting to sign in with:", json); // debug

        try {
            console.log("Attempting to sign-in with:", user); // debug
            const response = await axios.post(url + "/user/login", json, headers);
            console.log("Server response:", response.data); // debug
            //const token = response.data.token;
            if (response.data.token) {
                console.log("Token received:", response.data.token);
        
                sessionStorage.setItem("user", JSON.stringify(response.data));
                sessionStorage.setItem("token", response.data.token);
        
                console.log("Token stored in sessionStorage:", sessionStorage.getItem("token"));
        
                setUser({ ...response.data, token: response.data.token });
              } else {
                console.warn("No token received from server!");
              }

        } catch (error) {
            console.error("Sign-in error:", error.response?.data || error.message);
            setUser({ email: "", password: "" }); // Reset thông tin user nếu đăng nhập thất bại
            throw error; 
          }
    };

    const signOut = () => {
        console.log("Signing out...");
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("token");
        setUser({ email: "", password: "" }); // Reset state
        console.log("User and token cleared from sessionStorage.");
      };

    return (
        <UserContext.Provider value={{user, setUser, signUp, signIn, signOut}}>
            {children}
        </UserContext.Provider>
    );
}