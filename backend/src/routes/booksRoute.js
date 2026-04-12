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
  historyBorrow,
  historyBorrowAll,
} = require("../controllers/booksController");
const { authMiddleware, roleMiddleware } = require("../middlewares/authMiddleware");

router
  // Static routes first to avoid collision with /:id
  .get("/borrows/my", authMiddleware, historyBorrow)
  .get("/borrows/history", authMiddleware, roleMiddleware(["ADMIN"]), historyBorrowAll)
  .get("/", getBooks)
  .get("/:id", getBooksById)
  .post("/", authMiddleware, roleMiddleware(["ADMIN"]), createBook)
  .put("/edit/:id", authMiddleware, roleMiddleware(["ADMIN"]), editBook)
  .delete("/delete/:id", authMiddleware, roleMiddleware(["ADMIN"]), delBook)
  .post("/borrows/:id", authMiddleware, borrowsBook)
  .put("/return/:id", authMiddleware, returnBook)
  .post("/reserve", authMiddleware, reserveBook)
  .put("/reserve/:bookId", authMiddleware, cancelReservation);

module.exports = router;

