const prisma = require("../config/prisma");
const {
  createBook,
  getBooks,
  getBooksById,
  editBook,
  delBook,
  checkAvailableCopies,
  createBorrow,
  decrementCopies,

  returnBook,
  incrementCopies,
  checkReservation,
  reserveBook,
  cancelReservation,
} = require("../models/bookModel");

exports.createBookService = async (data) => {
  return createBook(data);
};

exports.getBooksService = async () => {
  return getBooks();
};

exports.getBooksByIdService = async (id) => {
  return getBooksById(id);
};

exports.editBookService = async (id, data) => {
  return editBook(id, data);
};

exports.delBookService = async (id) => {
  return delBook(id);
};

exports.borrowsBookService = async (id, userId, dueDate) => {
  await prisma.$transaction(async (tx) => {
    const isAvailable = await checkAvailableCopies(id, tx);
    if (!isAvailable) {
      throw new Error("No available copies for this book");
    }
    await createBorrow(id, userId, dueDate, tx);
    const book = await getBooksById(id);
    const availableCopies = book.availableCopies - 1;
    await decrementCopies(id, availableCopies, tx);
  });
};

exports.returnBookService = async (id) => {
  return prisma.$transaction(async (tx) => {
    const borrow = await returnBook(id, tx);
    const bookId = borrow.bookId;
    const book = await getBooksById(bookId);
    const availableCopies = book.availableCopies + 1;
    await incrementCopies(bookId, availableCopies, tx);
    const reservation = await checkReservation(bookId, tx);
    if (reservation) {
      await createBorrow(bookId, reservation.userId, reservation.dueDate, tx);
      await decrementCopies(bookId, availableCopies - 1, tx);
    }
  });
};

exports.reserveBookService = async (bookId, userId, dueDate) => {
  return reserveBook(bookId, userId, dueDate);
};

exports.cancelReservationService = async (bookId, userId) => {
  return cancelReservation(bookId, userId);
};