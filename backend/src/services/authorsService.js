const {
  getAuthors,
  addAuthors,
  addAuthorsByBookId,
  deleteAuthor,
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

exports.deleteAuthorService = async (id) => {
  return deleteAuthor(id);
};
