//* ..auth -> authentication
// isStudent, isAdmin -> authorization

const Jwt = require("jsonwebtoken")
require("dotenv").config();

exports.auth = (req,res,next) =>{
    try {
        
        //* Extracting Token
        //* "Authorization":"Bearer "<token>;
        // console.log("Header - Safest Way of Extracting Token: ", req.header("Authorization").replace("Bearer ",""));

        const authHeader = req.header("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authorization header missing or malformed",
            });
        }
        
        const token = authHeader.replace("Bearer ", "");
        if(!token){
            return res.status(201).json({
                success:false,
                message:"Token is Missing"
            })
        }

        // Verify the Token

        try {
            const decode = Jwt.verify(token,process.env.JWT_SECRET);
            req.user = decode;
            // console.log("👤 Authenticated user:", req.user);
            next();
        } catch (error) {
            return res.status(401).json({
                success:false,
                message:"Ivalid Token!"
            })
        }

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Something went wrong, While verifying the Token"
        })
    }
}