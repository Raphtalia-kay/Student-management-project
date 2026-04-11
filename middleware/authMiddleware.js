import rateLimit from "express-rate-limit";
import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.accesstoken;
    if (!token) {
      return res.status(401).json({
        message: "No token provided",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const authorizeRoles = (...roles) =>{
  return (req,res,next) => {
    if(!req.user || !roles.includes(req.user.role)){
      return res.status(403).json({
        message : "forbidden"
      })
    }
    next()
  }
}

export const authLimiter = rateLimit({
  windowMs : 10 * 60 *1000,
  limit : 5,
  standardHeaders : "draft-8",
  legacyHeaders : false,
  message : "Too many login attempsts from this IP, please try again after 10 minutes"
})