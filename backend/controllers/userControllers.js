const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
// @desc register a user
// @route POST /api/users/register
// @access public
const registerUser = async (req, res) => {
  // console.log(req.body)
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!!");
  }

  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400).json({ registered: true });
    // throw new Error("User already registered!!");
  }

  //hashed password
  const hashPassword = await bcrypt.hash(password, 10);
  console.log("Hashed Password", hashPassword);
  // create user in database
  const user = await User.create({
    username,
    email,
    password: hashPassword,
  });
  console.log(`User created ${user}`);
  if (user) {
    res.status(200).json({ _id: user._id, email: user.email });
  } else {
    res.status(400);
    throw new Error("User data is not valid");
  }
  // res.json({ message: "Register the user" });
};

// @desc login user
// @route POST /api/users/login
// @access public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }

  const user = await User.findOne({ email });
  //compare password with hashpassword
  if (user && (await bcrypt.compare(password, user.password))) {
    //embedding the payload and create jwt access token
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user._id,
        },
      },
      process.env.ACCESS_TOKEN_SECERT
      // { expiresIn: "15m"}
    );

    const options = {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Set an expiration time
      httpOnly: true,
      secure: true,
      sameSite: "none", // or 'strict' depending on your requirements
    };

    res.status(200).cookie("token", accessToken, options).json({
      success: true,
      user,
      accessToken,
    });
  } else {
    res.status(401).json({ invalidEmailPassword: true });
    // throw new Error("email or password is not valid")
  }
  // res.json({ message: "Login user" });
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  await User.deleteOne({ _id: req.params.id });
  res
    .status(200)
    .send(
      `User:${user.username} with email:${user.email} deleted successfully`
    );
});

// @desc currnet user info
// @route GET /api/users/current
// @access private
const currentUser = asyncHandler(async (req, res) => {
  res.json(req.user);
});

// Logout user by clearing the access token cookie
const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none", // or 'strict' depending on your requirements
  }); // Clear the accessToken cookie

  res.status(200).json({ message: "Logged out successfully" });
});

module.exports = {
  registerUser,
  loginUser,
  currentUser,
  deleteUser,
  logoutUser,
};
