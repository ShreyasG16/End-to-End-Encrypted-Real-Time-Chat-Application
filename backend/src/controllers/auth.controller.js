import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req,res) => {
    let { fullName, email, password } = req.body;

    // Ensuring they're strings
    if (typeof fullName !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
        return res.status(400).json({ message: "Invalid input types" });
    }

    fullName = fullName.trim();
    email = email.trim().toLowerCase();
    password = password.trim();

    
    try
    {
      if(!fullName || !email || !password)
      {
         return res.status(400).json({message: "All fields are required"});
      }

      if(password.length < 6)
      {
         return res.status(400).json({message: "Password must be at least 6 characters"});
      }

      const user = await User.findOne({email})

      if (user) return res.status(400).json({message: "Email already exists"});

      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password,salt)

      const newUser = new User({
         fullName:fullName,
         email:email,
         password:hashedPassword
      })

      if(newUser)
      {
        //generate jwt token here
        generateToken(newUser._id,res) //mongodb store as _id and not as id
        await newUser.save();

        res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            profilePic: newUser.profilePic,
            createdAt: newUser.createdAt
        });
      }
      else
      {
        res.status(400).json({message: "Invalid user data"});
      }
    }
    catch(error)
    {
        console.log("Error in signup controller",error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
};

export const login = async (req,res) => {
    let { email, password } = req.body;

  if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ message: "Invalid input types" });
  }

  email = email.trim().toLowerCase();
  password = password.trim();


    try
    {
      const user = await User.findOne({email});

      if(!user)
      {
         return res.status(400).json({message: "Invalid Credentials"});
      }

      const isPasswordCorrect = await bcrypt.compare(password,user.password);

      if(!isPasswordCorrect)
      {
         return res.status(400).json({message: "Invalid Credentials"});
      }

      generateToken(user._id,res)

      res.status(200).json({
        _id:user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
        
      });
    }
    catch(error)
    {
        console.log("Error in login controller",error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
};

export const logout = (req,res) => {
    //just clearing out the cookies
    try {
       res.cookie("jwt","",{maxAge:0})
       res.status(200).json({message:"Logged Out Successfully!"})
    }
    catch(error)
    {
       console.log("Error in logout controller",error.message);
       res.status(500).json({message: "Internal Server Error"});
    }
};

export const updateProfile = async (req,res) => {
  try{
    const {profilePic} = req.body;
    const userId = req.user._id;

    if(!profilePic)
    {
       res.status(400).json({message:"Profile Pic is Required!"})
    }
    
    const uploadResponse = await cloudinary.uploader.upload(profilePic)
    const updatedUser = await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true})
    
    res.status(200).json(updatedUser)
  }
  catch(error)
  {
    console.log("Error in Update Profile",error.message);
    res.status(500).json({message: "Internal Server Error"});
  }
};

export const checkAuth = (req,res) => {
  try{
    res.status(200).json(req.user);
  }
  catch(error)
  {
    console.log("Error in checkAuth controller",error.message);
    res.status(500).json({message: "Internal Server Error"});
  }
}