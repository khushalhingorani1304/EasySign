const bcrypt = require("bcrypt");
const Jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();

// ------------------ SIGNUP ------------------
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists!",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashPassword,
    });

    const payload = { email: user.email, id: user._id };
    const token = Jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    return res.status(200).json({
      success: true,
      message: "User created successfully",
      user: {
        name: user.name,
        email: user.email,
        id: user._id,
      },
      token,
    });

  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error occurred while signing up",
    });
  }
};

// ------------------ LOGIN ------------------
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Account does not exist. Please Sign Up!",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(403).json({
        success: false,
        message: "Incorrect password",
      });
    }

    const payload = { email: user.email, id: user._id };
    const token = Jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "4h",
    });

    user = user.toObject();
    user.token = token;
    delete user.password;

    return res
      .cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      })
      .status(200)
      .json({
        success: true,
        user,
        token,
        message: "Successfully Logged In!",
      });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error occurred while attempting login!",
    });
  }
};
