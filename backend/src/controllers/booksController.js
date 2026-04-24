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
  historyBorrowService,
  historyBorrowAllService,
  cancelReservationService,
  getReservationByUser,
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
  await borrowsBookService(id, userId);
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
  const { bookId } = req.body;
  await reserveBookService(bookId, userId);
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

exports.historyBorrow = asyncHandler(async (req, res, next) => {
  const { id: userId } = req.user;
  const history = await historyBorrowService(userId);
  return res.status(200).json({
    message: "Borrow history retrieved successfully",
    data: history,
  });
});

exports.historyBorrowAll = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  const result = await historyBorrowAllService(
    parseInt(page),
    parseInt(limit),
  );
  return res.status(200).json({
    message: "All borrow history retrieved successfully",
    data: result.history,
    pagination: result.pagination,
  });
});
exports.getReservationByUser = asyncHandler(async (req, res, next) => {
  const { id: userId } = req.user;
  const reservation = await getReservationByUser(userId);
  return res.status(200).json({
    message: "Reservation history retrieved successfully",
    data: reservation,
  });
});
