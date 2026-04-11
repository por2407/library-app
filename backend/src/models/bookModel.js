const prisma = require("../config/prisma");

exports.createBook = async (data) => {
  const { title, isbn, description, coverUrl, totalCopies, availableCopies } =
    data;
  return prisma.book.create({
    data: { title, isbn, description, coverUrl, totalCopies, availableCopies },
  });
};

exports.getBooks = async () => {
  return prisma.book.findMany();
};

exports.getBooksById = async (id) => {
  return prisma.book.findUnique({
    where: { id },
  });
};

exports.editBook = async (id, data) => {
  const { title, isbn, description, coverUrl, totalCopies, availableCopies } =
    data;
  return prisma.book.update({
    where: { id },
    data: { title, isbn, description, coverUrl, totalCopies, availableCopies },
  });
};

exports.delBook = async (id) => {
  return prisma.book.delete({
    where: { id },
  });
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

exports.returnBook = async (id, tx = prisma) => {
  return tx.borrow.update({
    where: { id },
    data: { returnDate: new Date(), status: "RETURNED" },
    select: { bookId: true },
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

exports.reserveBook = async (bookId, userId, dueDate) => {
  return prisma.reservation.create({
    data: { bookId, userId, dueDate },
  });
};

exports.cancelReservation = async (bookId, userId) => {
  return prisma.reservation.update({
    where: { bookId, userId, status: "PENDING" },
    data: { status: "CANCELLED" },
  });
};

