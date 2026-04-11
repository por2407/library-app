const { asyncHandler } = require("../utils/asyncHandler");
const { registerUser, loginUser, getUserById } = require("../services/authService");
const { cfg } = require("../config/env");

exports.createUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  await registerUser(name, email, password);
  return res.status(201).json({
    message: "User created successfully",
  });
});

exports.loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const token = await loginUser(email, password);
  res.cookie("token", token, {
    httpOnly: true,
    secure: cfg.nodeEnv === "prod",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });
  return res.status(200).json({
    message: "User logged in successfully",
  });
});

exports.me = asyncHandler(async (req, res, next) => {
  const { id } = req.user;
  const user = await getUserById(id);
  return res.status(200).json({
    message: "User data retrieved successfully",
    data: user,
  });
});


