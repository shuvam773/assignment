const bcrypt = require('bcrypt')
const UserModel = require('../models/userModel')
const jwt = require('jsonwebtoken')

const  signup = async (req, res) => {
    try {
        const {name, email, password} = req.body
        const user =  await UserModel.findOne({email})
        if(user){
            return res.status(409).json({message:"User already exists", status:false})
        }
        const userModel = new UserModel({name, email, password})
        userModel.password = await bcrypt.hash(password, 10)
        await userModel.save()
        res.status(201).json({message:"User created successfully", status:true})
    } catch (error) {
        res.status(500).json({message:error.message, status:false})
    }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(403).json({ message: "User does not exist", status: false });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(403).json({ message: "Invalid credentials", status: false });
    }

    // create JWT - Include ALL necessary user data
    const jwtToken = jwt.sign(
      { 
        email: user.email, 
        userId: user._id, 
        role: user.role,
        name: user.name
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    // set cookie BEFORE sending response
    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // send success response - Include user role
    return res.status(200).json({
      message: "Login Successful",
      status: true,
      jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
};


const logout = (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully", status: true });
}


module.exports = {
    signup,
    login,
    logout
}