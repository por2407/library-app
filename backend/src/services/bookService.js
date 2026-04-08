const {createBook, getBooks, editBook} = require('../models/bookModel');

exports.createBookService = async (data) => {
    return createBook(data);
};

exports.getBooksService = async () => {
    return getBooks();
};

exports.editBookService = async (id, data) => {
    return editBook(id, data);
};