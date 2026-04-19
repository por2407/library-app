const router = require("express").Router();
const {
  getAuthors,
  addAuthors,
  addAuthorsByBookId,
  deleteAuthor,
} = require("../controllers/authorsController");
const { authMiddleware, roleMiddleware } = require("../middlewares/authMiddleware");

router
  .get("/", getAuthors)
  .post("/", authMiddleware, roleMiddleware(["ADMIN"]), addAuthors)
  .post("/add", authMiddleware, roleMiddleware(["ADMIN"]), addAuthorsByBookId)
  .delete("/:id", authMiddleware, roleMiddleware(["ADMIN"]), deleteAuthor);
module.exports = router;

