const prisma = require("../config/prisma");

exports.getAuthors = async () => {
  return prisma.author.findMany();
};

exports.addAuthors = async (name) => {
  return prisma.author.create({
    data: { name },
  });
};

exports.addAuthorsByBookId = async (bookId, authorId) => {
  return prisma.bookAuthor.create({
    data: { bookId, authorId },
  });
};

exports.deleteAuthor = async (id) => {
  await prisma.bookAuthor.deleteMany({ where: { authorId: id } });
  return prisma.author.delete({ where: { id } });
};
