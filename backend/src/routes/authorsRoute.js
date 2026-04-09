const {router} = require("express").Router();
const {getAuthors, addAuthors} = require("../controllers/authorsController");

router.get("/", getAuthors).post("/", addAuthors);
module.exports = router;