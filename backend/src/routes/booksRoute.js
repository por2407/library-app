const router = require('express').Router();
const { createBook } = require('../controllers/booksController');

router.post('/', createBook);

module.exports = router;