// middleware auth
let dotenv = require('dotenv');
dotenv.config();
const jwt = require('jsonwebtoken');
let User = require('../model/userSchema'); // Import the User model
const secret =  process.env.JWT_SECRET; // Replace with your actual secret key    
module.exports = (req, res, next) => { 
  const apiKey = req?.headers?.key ; // Check for API key in headers or query parameters
  const envKey = process.env.NODE_ENV == 'PROD' ? process.env.API_KEY_PROD : process.env.NODE_ENV == 'QA' ? process.env.API_KEY_QA : process.env.API_KEY; // Use environment variables for API keys
   if (!apiKey || apiKey !== envKey ) { 
    return res.status(403).json({ message: 'Forbidden: Invalid API Key' });
  } 
  const token = req?.headers?.authorization?.replace("req.headers['Authorization'].") || req?.headers?.Authorization?.replace("req.headers['Authorization'].") ; // Check both lowercase
  // console.error('Token:', token); // Log the token for debugging
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Failed to authenticate token' });
    }if(decoded?.exp < Date.now() / 1000) {
      return res.status(403).json({ message: 'Token has expired' });
    }if (!decoded) {
      return res.status(403).json({ message: 'Invalid token' });
    }if (decoded.issuer !== process.env.ISSUER) {
      return res.status(403).json({ message: 'Invalid Issuer' });
    }if(decoded.audience !== process.env.AUDIENCE) {
      return res.status(403).json({ message: 'Invalid Audience' });
    }
    // Check if the user exists in the database (optional, depending on your use case)
    const userData = User.findOne({ username: decoded.username, token: token });
      if (!userData) {
        return res.status(403).json({ message: 'User not found' });
      } 
    req.user = decoded; // Attach user info to request
    next(); // Proceed to the next middleware or route handler
  });
};