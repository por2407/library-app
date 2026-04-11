const prisma = require("../prismaClient");

exports.getAuthors = async () => {
  return prisma.author.findMany();
};

exports.addAuthors = async (name) => {
  return prisma.author.create({
    data: { name },
  });
};

exports.addAuthorsByBookId = async (bookId, authId) => {
  return prisma.bookauthors.create({
    data: {
      bookId,
      authId,
    },
  });
}