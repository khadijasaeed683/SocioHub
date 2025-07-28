// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// // Basic token verification
// const protect = async (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith("Bearer "))
//     return res.status(401).json({ message: "No token provided" });

//   const token = authHeader.split(" ")[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log("Decoded token:", decoded);
//     req.user = await User.findById(decoded.id).select('-password');
//     next();
//     console.log("User authenticated:", req.user.username);
//   } catch (err) {
//     if (err.name === 'TokenExpiredError') {
//       return res.status(401).json({ message: "Session expired. Please log in again." });
//     }
//     res.status(401).json({ message: "Invalid token" });
//   }
// };

const protect = async (req, res, next) => {
  const token = req.cookies.token; // ✅ get from cookies, not headers
  // console.log("Cookies:", req.cookies);
  // console.log("Token from cookies:", req.cookies.token);

  if (!token) {
    console.log("No token found in cookies");
    return res.status(401).json({ message: "No token provided in cookies" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Session expired. Please log in again." });
    }
    res.status(401).json({ message: "Invalid token" });
  }
};
// Role checker middleware
const allowRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user)
      return res.status(401).json({ message: "User not authenticated" });

    if (!allowedRoles.includes(req.user.role))
      return res.status(403).json({ message: "Access denied: insufficient role" });

    next();
  };
};

const authAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role === 'admin') {
      next();
    } else {
      return res.status(403).json({ message: 'Not authorized as admin' });
    }
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = { protect, allowRoles, authAdmin };
