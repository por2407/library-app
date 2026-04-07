const prisma = require("../config/prisma");

exports.createBook = async (data) => {
  const { title, isbn, description, coverUrl, totalCopies, availableCopies } = data;
  return prisma.book.create({
    data: { title, isbn, description, coverUrl, totalCopies, availableCopies },
  });
};
