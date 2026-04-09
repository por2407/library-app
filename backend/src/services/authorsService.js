const {getAuthors, createAuthor} = require("../models/authorModel");

exports.getAuthorsService = async () => {
  return getAuthors();
};

exports.addAuthorsService = async (name) => {
  return createAuthor(name);
};