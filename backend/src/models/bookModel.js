const prisma = require("../config/prisma");

exports.createBook = async (data) => {
  const {
    title,
    isbn,
    description,
    coverUrl,
    totalCopies,
    availableCopies,
    authors,
    categories,
  } = data;

  const authorConnectors = [];
  if (authors && Array.isArray(authors)) {
    for (let authorName of authors) {
      let authorNameTrimmed = authorName.trim();
      if (!authorNameTrimmed) continue;
      let existingAuthor = await prisma.author.findFirst({
        where: { name: authorNameTrimmed },
      });
      if (!existingAuthor) {
        existingAuthor = await prisma.author.create({
          data: { name: authorNameTrimmed },
        });
      }
      authorConnectors.push({ author: { connect: { id: existingAuthor.id } } });
    }
  }

  const categoryConnectors = [];
  if (categories && Array.isArray(categories)) {
    for (let catName of categories) {
      let catNameTrimmed = catName.trim();
      if (!catNameTrimmed) continue;
      categoryConnectors.push({
        category: {
          connectOrCreate: {
            where: { name: catNameTrimmed },
            create: { name: catNameTrimmed },
          },
        },
      });
    }
  }

  return prisma.book.create({
    data: {
      title,
      isbn,
      description,
      coverUrl,
      totalCopies,
      availableCopies:
        availableCopies !== undefined ? availableCopies : totalCopies,
      authors: { create: authorConnectors },
      categories: { create: categoryConnectors },
    },
  });
};

exports.getBooks = async () => {
  return prisma.book.findMany({
    include: {
      authors: { include: { author: true } },
      categories: { include: { category: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

exports.getBooksById = async (id, tx = prisma) => {
  return tx.book.findUnique({
    where: { id },
    include: {
      authors: { include: { author: true } },
      categories: { include: { category: true } },
    },
  });
};

exports.editBook = async (id, data) => {
  const {
    title,
    isbn,
    description,
    coverUrl,
    totalCopies,
    availableCopies,
    authors,
    categories,
  } = data;

  return await prisma.$transaction(async (tx) => {
    // 1. Update basic fields
    const book = await tx.book.update({
      where: { id },
      data: {
        title,
        isbn,
        description,
        coverUrl,
        totalCopies,
        availableCopies:
          availableCopies !== undefined ? availableCopies : undefined,
      },
    });

    // 2. Update Authors if provided
    if (authors !== undefined) {
      await tx.bookAuthor.deleteMany({ where: { bookId: id } });
      const authorConnectors = [];
      for (let authorName of authors) {
        let existingAuthor = await tx.author.findFirst({
          where: { name: authorName.trim() },
        });
        if (!existingAuthor) {
          existingAuthor = await tx.author.create({
            data: { name: authorName.trim() },
          });
        }
        authorConnectors.push({ authorId: existingAuthor.id, bookId: id });
      }
      if (authorConnectors.length > 0) {
        await tx.bookAuthor.createMany({ data: authorConnectors });
      }
    }

    // 3. Update Categories if provided
    if (categories !== undefined) {
      await tx.bookCategory.deleteMany({ where: { bookId: id } });
      const categoryConnectors = [];
      for (let catName of categories) {
        let existingCat = await tx.category.findFirst({
          where: { name: catName.trim() },
        });
        if (!existingCat) {
          existingCat = await tx.category.create({
            data: { name: catName.trim() },
          });
        }
        categoryConnectors.push({ categoryId: existingCat.id, bookId: id });
      }
      if (categoryConnectors.length > 0) {
        await tx.bookCategory.createMany({ data: categoryConnectors });
      }
    }

    return book;
  });
};

exports.delBook = async (id) => {
  try {
    return await prisma.$transaction(async (tx) => {
      // 1. ลบความสัมพันธ์ของผู้แต่งและหมวดหมู่ก่อน
      await tx.bookAuthor.deleteMany({ where: { bookId: id } });
      await tx.bookCategory.deleteMany({ where: { bookId: id } });

      // 2. ลบประวัติการยืมและการจอง
      await tx.borrow.deleteMany({ where: { bookId: id } });
      await tx.reservation.deleteMany({ where: { bookId: id } });

      // 3. ลบตัวเล่มหนังสือ (ใช้ deleteMany เพื่อไม่ให้เกิด error กรณีไม่พบข้อมูล)
      return await tx.book.deleteMany({ where: { id } });
    });
  } catch (error) {
    console.error("Error in delBook model:", error);
    throw error;
  }
};

exports.checkAvailableCopies = async (id, tx = prisma) => {
  const book = await tx.book.findUnique({
    where: { id },
    select: { availableCopies: true },
  });
  return book?.availableCopies > 0;
};

exports.createBorrow = async (id, userId, dueDate, tx = prisma) => {
  return tx.borrow.create({
    data: { userId, bookId: id, dueDate },
  });
};

exports.decrementCopies = async (id, availableCopies, tx = prisma) => {
  return tx.book.update({
    where: { id },
    data: { availableCopies },
  });
};

exports.returnBook = async (bookId, userId, tx = prisma) => {
  return tx.borrow.updateMany({
    where: { bookId, userId, status: "BORROWED" },
    data: { returnDate: new Date(), status: "RETURNED" },
  });
};

exports.incrementCopies = async (bookId, availableCopies, tx = prisma) => {
  return tx.book.update({
    where: { id: bookId },
    data: { availableCopies },
  });
};

exports.checkReservation = async (bookId, tx = prisma) => {
  const reservation = await tx.reservation.findFirst({
    where: { bookId, status: "PENDING" },
    orderBy: { createdAt: "asc" },
  });

  if (reservation) {
    await tx.reservation.update({
      where: { id: reservation.id },
      data: { status: "CONFIRMED" },
    });

    return reservation;
  }

  return null;
};

exports.reserveBook = async (bookId, userId) => {
  return prisma.reservation.create({
    data: { bookId, userId },
  });
};

exports.cancelReservation = async (bookId, userId) => {
  return prisma.reservation.updateMany({
    where: { bookId, userId, status: "PENDING" },
    data: { status: "CANCELLED" },
  });
};

exports.hisBorrow = async (userId) => {
  return prisma.borrow.findMany({
    where: { userId },
    include: { book: true },
  });
};

exports.hisBorrowAll = async (skip = 0, take = 10) => {
  return prisma.borrow.findMany({
    include: { book: true, user: true },
    orderBy: { borrowDate: "desc" },
    skip: parseInt(skip),
    take: parseInt(take),
  });
};

exports.countHisBorrowAll = async () => {
  return prisma.borrow.count();
};

exports.findReservationByUser = async (userId) => {
  return prisma.reservation.findMany({
    where: { userId, status: "PENDING" },
    include: { book: true },
  });
};
