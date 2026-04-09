const router = require("express").Router();
const {
  createBook,
  getBooks,
  editBook,
  delBook,
  getBooksById,
} = require("../controllers/booksController");

router
  .post("/", createBook)
  .get("/", getBooks)
  .get("/:id", getBooksById)
  .put("/edit/:id", editBook)
  .delete("/delete/:id", delBook);

module.exports = router;
