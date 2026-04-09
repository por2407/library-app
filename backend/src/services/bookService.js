const {
  createBook,
  getBooks,
  getBooksById,
  editBook,
  delBook,
} = require("../models/bookModel");

exports.createBookService = async (data) => {
  return createBook(data);
};

exports.getBooksService = async () => {
  return getBooks();
};

exports.getBooksByIdService = async (id) => {
  return getBooksById(id);
};

exports.editBookService = async (id, data) => {
  return editBook(id, data);
};

exports.delBookService = async (id) => {
  return delBook(id);
};
