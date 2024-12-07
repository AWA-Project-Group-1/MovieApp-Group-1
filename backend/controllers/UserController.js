import { compare, hash } from "bcrypt";
import { insertUser } from "../models/User.js";
import { ApiError } from "../helpers/ApiError.js";
import { sign } from "jsonwebtoken";

const createUserObject = (id, email, token = undefined) => {
    return {
        'id':id,
        'email':email,
        ...(token !== undefined) && { 'token': token };
    };
}

const postRegistration = async (req, res, next) => {
    try {
        if (!req.body.email || req.body.email.length === 0) {
            return next(new ApiError('Invalid email for user', 400));
        }
        if (!req.body.password || req.body.password.length < 8) {
            return next(new ApiError('Invalid password < 8 characters', 400));
        }
        const hashedPassword = await hash(req.body.password, 10);
        const userFromDb = await insertUser(req.body.email, hashedPassword);
        const user = userFromDb.rows[0];
        return res.status(201).json(createUserObject(user.id, user.email));
    } catch (error) {
        return next(error);
    }
}


const postLogin = async(req, res, next) => {
    const invalid_credentials_message = 'Invalid credentials.';
    try {
        const userFromDb = await selectUserByEmail(req.body.email);
        if (userFromDb.rowCount === 0) {
            console.log("userFromDb:", userFromDb);
            console.log("No user found for email:", req.body.email);
            return next(new ApiError(invalid_credentials_message, 401));
        }

        const user = userFromDb.rows[0];
        if (!await compare(req.body.password, user.password)) {
            console.error("Invalid password for email:", req.body.email);
            return next(new ApiError(invalid_credentials_message, 401));
        }

        const token = sign({ user: req.body.email }, process.env.JWT_SECRET_KEY);
        console.log("JWT_SECRET_KEY", process.env.JWT_SECRET_KEY);
        return res.status(200).json(createUserObject(user.id, user.email, token));
    } catch (error) {
        console.error("Login error:", error);
        return next(error);
    }
};
export { postRegistration, postLogin };