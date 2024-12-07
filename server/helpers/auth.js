import jwt from "jsonwebtoken";
const { verify } = jwt;
const authorizationRequired = "Authorization required";
const invalidCredentials = "Invalid credentials";

const auth = (req, res, next) => {
    console.log("Authenticating request...");

    if (!req.headers.authorization) {
        console.warn("Authorization header missing.");
        res.statusMessage = authorizationRequired;
        res.status(401).json({message: authorizationRequired});
    }
    try {
        const token = req.headers.authorization.split(" ")[1];
        console.log("Verifying token:", token);
        jwt.verify(token, process.env.JWT_SECRET_KEY)
        next()
    } catch (err) {
        console.error("Token verification failed:", err);
        res.statusMessage = invalidCredentials;
        res.status(403).json({message: invalidCredentials})
    }
};
export { auth }
