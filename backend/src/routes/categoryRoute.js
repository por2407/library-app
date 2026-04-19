const router = require("express").Router();
const {
  getCategories,
  addCategories,
  addCategoriesByBookId,
  deleteCategory,
} = require("../controllers/categoryController");
const { authMiddleware, roleMiddleware } = require("../middlewares/authMiddleware");

router
  .get("/", getCategories)
  .post("/", authMiddleware, roleMiddleware(["ADMIN"]), addCategories)
  .post("/add", authMiddleware, roleMiddleware(["ADMIN"]), addCategoriesByBookId)
  .delete("/:id", authMiddleware, roleMiddleware(["ADMIN"]), deleteCategory);
module.exports = router;

