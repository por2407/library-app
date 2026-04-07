const {createBook} = require('../models/bookModel');

exports.createBookService = async (data) => {
    return createBook(data);
};