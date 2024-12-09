import jwt from "jsonwebtoken";

const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
        return res.status(401).json({ message: "Token missing" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.error('JWT verification error:', error.message); // Log the error message
        return res.status(403).json({ error: "Invalid or expired token" });
    }
}


export default authenticate;