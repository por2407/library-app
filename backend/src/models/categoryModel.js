const prisma = require("../config/prisma");

exports.getCategories = async () => {
  return prisma.category.findMany();
};

exports.getCategoryByName = async (name) => {
  return prisma.category.findUnique({
    where: { name },
  });
};

exports.createCategory = async (name) => {
  return prisma.category.create({
    data: { name },
  });
};

exports.addCategoriesByBookId = async (bookId, categoryId) => {
  return prisma.bookCategory.create({
    data: { bookId, categoryId },
  });
};

