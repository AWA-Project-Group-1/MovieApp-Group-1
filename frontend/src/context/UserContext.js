import { createContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    const id = localStorage.getItem("id"); // Retrieve the user ID
    const username = localStorage.getItem("username");  //heyanwen added
    console.log(token, email, id, username);   //heyanwen added
    if (token && email && id && username) {  //heyanwen added username 
      setUser({ token, email, id, username}); // Include the ID in the user object
    }
  }, []);


  

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;