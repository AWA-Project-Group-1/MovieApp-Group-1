import jwt from "jsonwebtoken";
//const { verify } = jwt;
//const authorizationRequired = "Authorization required";
//const invalidCredentials = "Invalid credentials";

//const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).send("Access Denied");

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) return res.status(403).send("Invalid Token");
    console.log("Decoded User:", user);
    req.user = user;
    next();
  });
}

export { authenticateToken };

//module.exports = authenticateToken;
