import { useContext } from "react";
import { UserContext } from "./UserContext.js";

const useUser = () => { return useContext(UserContext); }

export default useUser;