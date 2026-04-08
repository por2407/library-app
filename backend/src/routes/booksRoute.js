const router = require("express").Router();
const {
  createBook,
  getBooks,
  editBook,
} = require("../controllers/booksController");

router.post("/", createBook).get("/", getBooks).put("/edit/:id", editBook);

module.exports = router;
