const User = require("../../models/userSchema");
const Product = require("../../models/productSchema");
const Category = require("../../models/categorySchema");

const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const env = require("dotenv").config();


const loadSingleProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId).populate("category");

        if (!product) {
            return res.status(404).render("404", { message: "Product not found" });
        }
        const user = req.session.user || req.user;
        const userData = await User.findOne({_id:user});
        console.log(userData);
        
       
        res.render("singleView", { product,user:userData});
    } catch (error) {
        console.error('Error loading product:', error);
        res.render("/user/page-404")
    }
};


module.exports = {
    loadSingleProduct,
}