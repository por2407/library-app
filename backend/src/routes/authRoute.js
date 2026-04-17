const router = require("express").Router();
const {
  createUser,
  loginUser,
  me,
  logoutUser,
} = require("../controllers/authController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router
  .post("/register", createUser)
  .post("/login", loginUser)
  .get("/me", authMiddleware, me)
  .post("/logout", authMiddleware, logoutUser);

module.exports = router;
