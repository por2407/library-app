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

exports.deleteCategory = async (id) => {
  await prisma.bookCategory.deleteMany({ where: { categoryId: id } });
  return prisma.category.delete({ where: { id } });
};

