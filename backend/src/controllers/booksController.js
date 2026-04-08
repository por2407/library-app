const { asyncHandler } = require("../utils/asyncHandler");
const { createBookService, getBooksService, editBookService } = require("../services/bookService");

exports.createBook = asyncHandler(async (req, res, next) => {
  const book = await createBookService(req.body);
  return res.status(200).json({
    message: "Book created successfully",
    data: book,
  });
});

exports.getBooks = asyncHandler(async (req, res, next) => {
  const books = await getBooksService();
  return res.status(200).json({
    message: "Books retrieved successfully",
    data: books,
  });
});

exports.editBook = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const book = await editBookService(id, req.body);

  return res.status(200).json({
    message: "Book edited successfully",
    data: book,
  });
});

