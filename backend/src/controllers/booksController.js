const { asyncHandler } = require("../utils/asyncHandler");
const { createBookService } = require("../services/bookService");

exports.createBook = asyncHandler(async (req, res, next) => {
  const book = await createBookService(req.body);
  return res.status(200).json({
    message: "Book created successfully",
    data: book,
  });
});
