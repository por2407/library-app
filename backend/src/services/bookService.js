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
  countHisBorrowAll,
  findReservationByUser,
} = require("../models/bookModel");
const redisClient = require("../config/redis");

const clearBooksCache = async () => {
  try {
    const cacheKey = "books:all";
    await redisClient.del(cacheKey);
  } catch (err) {
    console.error("Redis clear error:", err);
  }
};

const clearBookByIdCache = async (id) => {
  try {
    const cacheKey = `books:id:${id}`;
    await redisClient.del(cacheKey);
  } catch (err) {
    console.error("Redis clear error:", err);
  }
};

// เพิ่มหนังสือ (admin)
exports.createBookService = async (data) => {
  const result = await createBook(data);
  await clearBooksCache();
  return result;
};

// หาหนังสือทั้งหมด
exports.getBooksService = async () => {
  const cacheKey = "books:all";

  try {
    if (redisClient.isReady) {
      const cachedBooks = await redisClient.get(cacheKey);
      if (cachedBooks) {
        return JSON.parse(cachedBooks);
      }
    }
  } catch (err) {
    console.error("Redis get error:", err);
  }

  const books = await getBooks();

  try {
    if (redisClient.isReady) {
      await redisClient.set(cacheKey, JSON.stringify(books), {
        EX: 300, // Cache for 300 seconds (5 minutes)
      });
    }
  } catch (err) {
    console.error("Redis set error:", err);
  }

  return books;
};

// หาหนังสือด้วย ID
exports.getBooksByIdService = async (id) => {
  const cacheKey = `books:id:${id}`;
  try {
    if (redisClient.isReady) {
      const cachedBooks = await redisClient.get(cacheKey);
      if (cachedBooks) {
        return JSON.parse(cachedBooks);
      }
    }
  } catch (err) {
    console.error("Redis get error:", err);
  }
  const book = await getBooksById(id);
  try {
    if (redisClient.isReady) {
      await redisClient.set(cacheKey, JSON.stringify(book), {
        EX: 300,
      });
    }
  } catch (err) {
    console.error("Redis set error:", err);
  }
  return book;
};

// แก้ไขหนังสือ (admin)
exports.editBookService = async (id, data) => {
  const result = await editBook(id, data);
  await clearBooksCache();
  return result;
};

// ลบหนังสือ (admin)
exports.delBookService = async (id) => {
  const result = await delBook(id);
  await clearBooksCache();
  return result;
};

// ยืมหนังสือ
exports.borrowsBookService = async (id, userId) => {
  clearBookByIdCache(id);
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
  await clearBooksCache();
};

// คืนหนังสือ
exports.returnBookService = async (bookId, userId) => {
  clearBookByIdCache(bookId);
  const result = await prisma.$transaction(async (tx) => {
    await returnBook(bookId, userId, tx);
    const book = await getBooksById(bookId, tx);
    const availableCopies = book.availableCopies + 1;
    await incrementCopies(bookId, availableCopies, tx);
    const reservation = await checkReservation(bookId, tx);
    if (reservation) {
      const dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
      await createBorrow(bookId, reservation.userId, dueDate, tx);
      await decrementCopies(bookId, availableCopies - 1, tx);
    }
    return { bookId };
  });
  await clearBooksCache();
  return result;
};

// จองหนังสือ
exports.reserveBookService = async (bookId, userId) => {
  await clearBookByIdCache(bookId);
  return reserveBook(bookId, userId);
};

// ยกเลิกการจองหนังสือ
exports.cancelReservationService = async (bookId, userId) => {
  await clearBookByIdCache(bookId);
  return cancelReservation(bookId, userId);
};

// หาประวัติการยืมของฉัน
exports.historyBorrowService = async (userId) => {
  return hisBorrow(userId);
};

// หาประวัติการยืมทั้งหมด (pagination)
exports.historyBorrowAllService = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const cacheKey = `history:all:p${page}:l${limit}`;

  try {
    if (redisClient.isReady) {
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData);
      }
    }
  } catch (err) {
    console.error("Redis get error:", err);
  }

  const [history, total] = await Promise.all([
    hisBorrowAll(skip, limit),
    countHisBorrowAll(),
  ]);

  const result = {
    history,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
    },
  };

  try {
    if (redisClient.isReady) {
      await redisClient.set(cacheKey, JSON.stringify(result), {
        EX: 300,
      });
    }
  } catch (err) {
    console.error("Redis set error:", err);
  }

  return result;
};

// หาการจองของฉัน
exports.getReservationByUser = async (userId) => {
  return findReservationByUser(userId);
};
