const { getPopular, getStatsModel } = require("../models/adminModel");

exports.getPopularBooksService = async () => {
    return getPopular();
};

exports.getStatsService = async () => {
    return getStatsModel();
};
