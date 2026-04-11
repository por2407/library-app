const { asyncHandler } = require("../utils/asyncHandler");
const {
  createBookService,
  getBooksService,
  getBooksByIdService,
  editBookService,
  delBookService,

  borrowsBookService,
  returnBookService,
  reserveBookService,
} = require("../services/bookService");

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

exports.getBooksById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const book = await getBooksByIdService(id);
  return res.status(200).json({
    message: "Book retrieved successfully",
    data: book,
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

exports.delBook = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  await delBookService(id);

  return res.status(200).json({
    message: "Book deleted successfully",
  });
});

exports.borrowsBook = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { id: userId } = req.user;
  const { dueDate } = req.body;
  await borrowsBookService(id, userId, dueDate);
  return res.status(200).json({
    message: "Book borrowed successfully",
  });
});

exports.returnBook = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { id: userId } = req.user;
  await returnBookService(id, userId);
  return res.status(200).json({
    message: "Book returned successfully",
  });
});

exports.reserveBook = asyncHandler(async (req, res, next) => {
  const { id: userId } = req.user;
  const { bookId, dueDate } = req.body;
  await reserveBookService(bookId, userId, dueDate);
  return res.status(200).json({
    message: "Book reserved successfully",
  });
});

exports.cancelReservation = asyncHandler(async (req, res, next) => {
  const { id: userId } = req.user;
  const { bookId } = req.params;
  await cancelReservationService(bookId, userId);
  return res.status(200).json({
    message: "Book reservation cancelled successfully",
  });
});
