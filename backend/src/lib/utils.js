import jwt from "jsonwebtoken"

export const generateToken= (userId,res) =>{

    const token = jwt.sign({userId}, process.env.JWT_SECRET,{
        expiresIn:"7d"
    })

    res.cookie("jwt",token, {
        maxAge: 7 * 24 * 60 * 60 * 1000 , //7d to milli second
        httpOnly: true , // prevents XSS attacks cross-site scripting attacks
        sameSite: "strict" , // prevents CSRF attacks cross-site request forgery attacks
        secure: process.env.NODE_ENV !== "development" //handling http / https requests
    });

    return token;
};