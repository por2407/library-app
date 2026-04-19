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
  hisBorrow,
  hisBorrowAll,
} = require("../models/bookModel");
const redisClient = require("../config/redis");

exports.createBookService = async (data) => {
  return createBook(data);
};

exports.getBooksService = async () => {
  const cacheKey = "books:all";
  
  try {
    if (redisClient.isReady) {
      const cachedBooks = await redisClient.get(cacheKey);
      if (cachedBooks) {
        console.log("Cache hit");
        return JSON.parse(cachedBooks);
      }
    }
  } catch (err) {
    console.error("Redis get error:", err);
  }

  const books = await getBooks();

  try {
    if (redisClient.isReady) {
      console.log("Cache miss");
      await redisClient.set(cacheKey, JSON.stringify(books), {
        EX: 600, // Cache for 600 seconds (10 minutes)
      });
    }
  } catch (err) {
    console.error("Redis set error:", err);
  }

  return books;
};

exports.getBooksByIdService = async (id) => {
  return getBooksById(id);
};

exports.editBookService = async (id, data) => {
  const result = await editBook(id, data);
  await clearBooksCache();
  return result;
};

exports.delBookService = async (id) => {
  const result = await delBook(id);
  await clearBooksCache();
  return result;
};

exports.borrowsBookService = async (id, userId) => {
  await prisma.$transaction(async (tx) => {
    const isAvailable = await checkAvailableCopies(id, tx);
    if (!isAvailable) {
      throw new Error("No available copies for this book");
    }
    const dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    await createBorrow(id, userId, dueDate, tx);
    const book = await getBooksById(id, tx);
    const availableCopies = book.availableCopies - 1;
    await decrementCopies(id, availableCopies, tx);
  });
};

exports.returnBookService = async (id) => {
  return prisma.$transaction(async (tx) => {
    const borrow = await returnBook(id, tx);
    const bookId = borrow.bookId;
    const book = await getBooksById(bookId, tx);
    const availableCopies = book.availableCopies + 1;
    await incrementCopies(bookId, availableCopies, tx);
    const reservation = await checkReservation(bookId, tx);
    if (reservation) {
      const dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
      await createBorrow(bookId, reservation.userId, dueDate, tx);
      await decrementCopies(bookId, availableCopies - 1, tx);
    }
  });
};

exports.reserveBookService = async (bookId, userId) => {
  return reserveBook(bookId, userId);
};

exports.cancelReservationService = async (bookId, userId) => {
  return cancelReservation(bookId, userId);
};

exports.historyBorrowService = async (userId) => {
  return hisBorrow(userId);
};

exports.historyBorrowAllService = async () => {
  return hisBorrowAll();
};