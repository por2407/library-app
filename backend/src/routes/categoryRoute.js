const { router } = require("express").Router();
const {
  getCategories,
  addCategories,
  addCategoriesByBookId,
} = require("../controllers/categoryController");

router
  .get("/", getCategories)
  .post("/", addCategories)
  .post("/add", addCategoriesByBookId);
module.exports = router;
