const {
  getAuthors,
  addAuthors,
  addAuthorsByBookId,
} = require("../models/authorsModel");

exports.getAuthorsService = async () => {
  return getAuthors();
};

exports.addAuthorsService = async (name) => {
  return addAuthors(name);
};

exports.addAuthorsByBookIdService = async (bookId, authorId) => {
  return addAuthorsByBookId(bookId, authorId);
};
