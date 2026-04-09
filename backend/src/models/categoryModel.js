const prisma = require("../config/prisma");

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
