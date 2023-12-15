const mongoose = require("mongoose")

const reviews = new mongoose.Schema({
    reviewerId:String,//User That has given review
    reviewerName:String,
    Comment:String,
    Rating:Number,
});
const userSchema = mongoose.Schema({
    sellerId:String,
    sellerName:String,
    Title: String,
    ImageUrl:[String],
    ImagePaths:[String],
    Description:String,
    Technologies:[String],
    TotalRating:Number,
    TotalNumberofFeddbacks:Number,
    Sales:Number,
    Price:Number,
    Revenue:Number,
    Feedbacks:[reviews],
},{timestamps:true})
const model = mongoose.model("SellerProjects" , userSchema);
module.exports = model;