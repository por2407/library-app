const { router } = require("express").Router();
const {
  getAuthors,
  addAuthors,
  addAuthorsByBookId,
} = require("../controllers/authorsController");

router
  .get("/", getAuthors)
  .post("/", addAuthors)
  .post("/add", addAuthorsByBookId);
module.exports = router;
