const { asyncHandler } = require("../utils/asyncHandler");
const { registerUser, loginUser, getUserById, updateUserProfile } = require("../services/authService");
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
  const { token, user } = await loginUser(email, password);
  res.cookie("token", token, {
    httpOnly: cfg.nodeEnv === "prod",
    secure: cfg.nodeEnv === "prod",
    sameSite: "lax",
    path: "/",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });
  return res.status(200).json({
    message: "User logged in successfully",
    data: user,
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

exports.logoutUser = asyncHandler(async (req, res, next) => {
  res.clearCookie("token", {
    httpOnly: cfg.nodeEnv === "prod",
    secure: cfg.nodeEnv === "prod",
    sameSite: "lax",
    path: "/",
  });
  return res.status(200).json({
    message: "User logged out successfully",
  });
});

exports.updateProfile = asyncHandler(async (req, res, next) => {
  const { id } = req.user;
  const { name, email } = req.body;
  const user = await updateUserProfile(id, name, email);
  return res.status(200).json({
    message: "Profile updated successfully",
    data: user,
  });
});



