const {asyncHandler} = require("../utils/asyncHandler");
const { getPopularBooksService, getStatsService } = require("../services/adminService");

exports.getPopularBooks = asyncHandler(async (req, res, next) => {
    const popularBooks = await getPopularBooksService();
    return res.status(200).json({
        message: "Popular books retrieved successfully",
        data: popularBooks,
    });
});

exports.getStats = asyncHandler(async (req, res, next) => {
    const stats = await getStatsService();
    return res.status(200).json({
        message: "Stats retrieved successfully",
        data: stats,
    });
});
