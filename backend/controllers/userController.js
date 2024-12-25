const { validationResult } = require("express-validator");
const User = require("../models/User");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const registerUser = async(req, res)=>{
    console.log(req.body);
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json({errors:errors.array()});
    }
    
    try {
        const {username, email, password} = req.body;

        let isEmailExist = await User.findOne({email});
        if(isEmailExist) {
            return res.status(400).json({message:"Employee is already exist with this Email id! please Login"})
        }

        let salt = await bcrypt.genSalt(10);
        let hashedPassword = await bcrypt.hash(password,salt);

        const user = await User.create({username, email, password:hashedPassword})

        res.status(200).json({message:'User registered successfully', user});

    } catch(error) {
        res.status(500).json({error:true,message:error.message});
    }
}

const loginUser = async(req,res)=>{

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors:errors.array()})
    }

    try {
        const {email, password} = req.body;

        if(!email) {
            return res.status(400).json({message:"Email is required"})
        }
        const isEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

        let isUserExist;

        if(isEmail) {
            // if it is an email, search by email
            isUserExist = await User.findOne({email})
        }

        console.log("request body", req.body);
        
        console.log("Database query result",isUserExist);
        

        if (!isUserExist) {
            return res.status(400).json({ error: true, message: "User does not exist! Please signup first." });
        }

        // if(isEmployeeExist) {
        const isPasswordMatching = await bcrypt.compare(password,isUserExist.password)

        if(!isPasswordMatching) {
            return res.status(400).json({error:true, message:"Invalid Password"})
        }

        const token = jwt.sign({id:isUserExist._id,email:isUserExist.email}, process.env.JWT_SECRET, {expiresIn:'4h'})

        console.log("token: ", token)

        res.status(200).json({error:false, message:"Successfully logged In", token})

    } catch(error) {
        console.log(error);
        res.status(500).json({ error: true, message: error.message })
    }
}

module.exports = {registerUser, loginUser}