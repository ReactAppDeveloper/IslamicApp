const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const RamadanCalender = require("../models/ramadancalender");

const getRamadanCalenders = asyncHandler(async (req, res) => {
    const ramadancalenders = await RamadanCalender.find()
       .sort({ _id: 1 });
    res.status(200).json(ramadancalenders);
});
module.exports = {
getRamadanCalenders,
};
