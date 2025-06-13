const user = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const joi = require("joi");

const loginSchema = joi.object({
  email: joi.string().email().required(),
});

const registerSchema = joi.object({
  username: joi.object().string().required(),
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
});

const generateToken = (getId) => {
  return jwt.sign({ getId }, "DEFAULT_SECRET_KEY", {
    expiresIn: 3 * 24 * 60 * 60,
  });
};

const registerUser = async (req, res) => {
  const { username, password, email } = req.body;

  const { error } = registerSchema.validate({ username, email, password });

  if (error)
    res.status(400).json({
      success: false,
      message: error.details[0].message,
    });

  try {
    const isEmailAlreadyInUse = user.findOne({ email });

    if (isEmailAlreadyInUse) {
      return res.status(400).json({
        success: false,
        message: "Email is already in use",
      });
    } else {
      const hashedPassword = await bcrypt.hash(password, 12);

      const newUser = user.create({
        username,
        email,
        password: hashedPassword,
      });

      if (newUser) {
        const token = generateToken(newUser._id);

        res.cookie("token", token);
      }

      res.status(200).json({
        success: true,
        message: "User registered successfully",
        userData: {
          username: newUser.username,
          email: newUser.email,
        },
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

module.exports = { registerUser };
