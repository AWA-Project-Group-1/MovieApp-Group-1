import { pool } from "../helpers/db.js";
import { Router } from "express";
import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { ApiError } from "../helpers/ApiError.js";

//const { sign } = jwt;
const router = Router();

router.post("/register", async (req, res, next) => {
    if (!req.body.email || req.body.email.length === 0) {
        return next(new ApiError("Invalid email for user", 400));
    }
    if (!req.body.password || req.body.password.length < 8) {
        return next(new ApiError("Invalid password (less than 8 characters)", 400));
    }

    hash(req.body.password, 10, (error, hashedPassword) => {
        if (error) next(error);
        try {
            pool.query("Insert into users (email, password) VALUES ($1, $2) RETURNING *",
                [req.body.email, hashedPassword],
                (error, result) => {
                    if (error) return next(error);
                    return res.status(201).json({ id: result.rows[0].id, email: result.rows[0].email });
                }
            )
        }   catch (error) {
            return next(error)
        }
    })
})

router.post("/login",(req, res, next) => {
    //const invalid_message = "Invalid credentials. Please try again.";
    try {
        pool.query('SELECT * FROM users WHERE email = $1',
            [req.body.email],
            (error, result) => {
                if (error) {
                    console.error("Database error 1: ", error);
                    return next(error)
                };  
                if (!result || !result.rows) {
                    console.error("Database error 2: ", error);
                    return next(new Error("Unable to retrieve data from database."))
                };
                if (result.rowCount === 0) {
                    console.error("No user found for email:", req.body.email);
                    return next(new Error("No user found for email:"))
                };
                
                const user = result.rows[0];
                compare(req.body.password, result.rows[0].password, (error, match) => {
                    if (error) {
                        console.error("Error comparing passwords", error);
                        return next(new Error("Error comparing passwords"))
                    };
                    if (!match) {
                        console.error("Invalid password for email", req.body.email);
                        return next(new Error("Invalid password for email"))
                    };
                        
                    const token = jwt.sign(
                        { userId: user.id, user: user.email },
                        process.env.JWT_SECRET_KEY,
                        { expiresIn: "1h" }
                    );

                    //const user = result.rows[0];
                    console.log("User logged in successfully with email:", req.body.email);

                    return res.status(200).json({ 
                        'id':user.id,
                        'email':user.email,
                        'token':token
                    });
                });
            }
        );
    } catch (error) {
        return next(error);
    }
})

  
export default router;
