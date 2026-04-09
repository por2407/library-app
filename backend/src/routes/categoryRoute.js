const { router } = require("express").Router();
const { getCategories,  addCategories} = require("../controllers/categoryController");

router.get("/", getCategories).post("/", addCategories);
module.exports = router;