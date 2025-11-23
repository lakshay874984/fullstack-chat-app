import jwt from 'jsonwebtoken';
import user from '../models/user.model.js';
 
export const  protectRoute = async (req, res, next) => {
    try{
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({message: "Unauthorized- No token provided"});
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({message: "Unauthorized- Invalid token"});

    }
    const userdata = await user.findById(decoded.userId).select('-password');
    if(!userdata){
        return res.status(401).json({message: "Unauthorized- User not found"});
    }
    req.user = userdata;
    next();
    }   
    catch(err){
        console.log(err);
        res.status(500).json({message: "Internal Server Error"});
    } }