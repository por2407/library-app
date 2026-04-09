const {asyncHandler} = require("../utils/asyncHandler");
const {getAuthorsService, addAuthorsService} = require("../services/authorsService");

exports.getAuthors = asyncHandler(async (req, res, next) => {
  const authors = await getAuthorsService();
  return res.status(200).json({
    message: "Authors retrieved successfully",
    data: authors,
  });
});

exports.addAuthors = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const author = await addAuthorsService(name);
  return res.status(200).json({
    message: "Author added successfully",
    data: author,
  });
});