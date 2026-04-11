const router = require("express").Router();
const {
  createBook,
  getBooks,
  editBook,
  delBook,
  getBooksById,
  borrowsBook,
  returnBook,
  reserveBook,
  cancelReservation,
} = require("../controllers/booksController");

router
  .post("/", createBook)
  .get("/", getBooks)
  .get("/:id", getBooksById)
  .put("/edit/:id", editBook)
  .delete("/delete/:id", delBook)
  .post("/borrows/:id", borrowsBook)
  .put("/return/:id", returnBook)
  .post("/reserve", reserveBook)
  .put("/reserve/:id", cancelReservation);

module.exports = router;
