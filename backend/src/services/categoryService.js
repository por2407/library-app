const {getCategoryByName, createCategory} = require("../models/categoryModel");

exports.getCategoryService = async (name) => {
  return getCategoryByName(name);
};

exports.createCategoryService = async (name) => {
  return createCategory(name);
};