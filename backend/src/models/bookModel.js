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
