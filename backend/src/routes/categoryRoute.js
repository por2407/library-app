const router = require("express").Router();
const {
  getCategories,
  addCategories,
  addCategoriesByBookId,
} = require("../controllers/categoryController");
const { authMiddleware, roleMiddleware } = require("../middlewares/authMiddleware");

router
  .get("/", getCategories)
  .post("/", authMiddleware, roleMiddleware(["ADMIN"]), addCategories)
  .post("/add", authMiddleware, roleMiddleware(["ADMIN"]), addCategoriesByBookId);
module.exports = router;

