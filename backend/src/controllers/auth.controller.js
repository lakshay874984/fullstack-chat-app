 // Create a router instance
import bcrypt from 'bcryptjs';
import { generateToken } from '../lib/utils.js';
import User from '../models/user.model.js';
import cloudinary from "../lib/cloudinary.js";
 export const login = async (req, res) => {
     console.log("Received from frontend:", req.body);
    const { email , password } = req.body;
  
    try{
        const user = await User.findOne({email});
        console.log("User from DB:", user);
console.log("Password entered:", password);
console.log("Hashed password:", user.password);

       
        if(!user){
            return res.status(400).json({message: "Invalid Credentials"});
        }
        const ispasswordcorrect =  await bcrypt.compare(password, user.password);
        if(!ispasswordcorrect){
            return res.status(400).json({message: "Invalid Credentials"});
        }
        generateToken(user._id,res);
        return res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilepic: user.profilepic,
        });

    }
    catch(err){
        console.log(err);
        res.status(500).json({message: "Internal Server Error"});
    }
    
    res.send('Login Route');
}

export const signup = async (req, res) => {
    const {fullName, email, password} = req.body;
    if(!fullName || !email || !password){
        return  res.status(400).json({message: "Please provide all required fields"});
    }
    try{
        if(password.length < 6){
            return res.status(400).json({message: "Password must be at least 6 characters long"});
        }
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({message: "User already exists"});
        }
        const salt  = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const newuser = new User({
            fullName,
            email,
            password: hashedPassword,
        });
        if(newuser){
            generateToken(newuser._id,res);
            await newuser.save();
            return res.status(201).json({
                _id: newuser._id,
                fullName: newuser.fullName,
                email: newuser.email,
                profilepic: newuser.profilepic,
            });

            // genre
        }
        else {
            return res.status(400).json({message: "Invalid user data"});
        }
        //hash password

    }
    catch(err){
        console.log(err);
        res.status(500).json({message: "Internal Server Error"});
    }
    res.send('Signup Route');
}
 

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: "strict",
            maxAge: 0
        });

        res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};




export const updateprofile = async (req, res) => {
  try {
    const { profilepic } = req.body; // frontend sends profilePic (capital P)
    const userId = req.user._id;

    if (!profilepic) {
      return res.status(400).json({ message: "Please provide profile picture URL" });
    }

    // Upload base64 string to Cloudinary
    const uploadedResponse = await cloudinary.uploader.upload(profilepic, {
  folder: "chatty_profiles",
});

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilepic: uploadedResponse.secure_url },
      { new: true }
    ).select("-password");

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const checkAuth = async (req, res) => {
    try{
        res.status(200).json(req.user);
    }
    catch(err){
        console.log("Error in checkAuth controlled", err.message);
        res.status(500).json({message: "Internal Server Error"});
    }};