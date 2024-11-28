const category = require("../../models/categorySchema");
const category = require("../../models/categorySchema");
const product = require("../../models/productSchema");

const categoryInfo = async (req,res)=>{
    try {
        const page = parseInt(req.query.page)||1;
        const limit = 4;
        const skip = (page-1)*limit;
        const categoryData = await category.find({})
        .sort({createAt:-1})
        .skip(skip)
        .limit(limit)

        const totalCategories = await category.countDocuments();
        const totalPages = Math.ceil(totalCategories / limit);
        res.render("category",{
            cat:categoryData,
            currentPage:page,
            totalPages : totalPages,
            totalCategories : totalCategories
        });
    } catch (error) {
        console.error(error);
        res.redirect("/pageerror");
    }
}

const addCategory = async(req,res)=>{
    const {name,description}=req.body;
    try {
        const existingCategory = await category.findOne({name});
        if(existingCategory){
            return res.status(500).send({error:"Category already exists"})
        }
        const newCategory = new category({
            name,
            description,
        })
        await newCategory.save();
        return res.json({message:"Category added"})
    } catch (error) {
        return res.status(500).json({error:"internal server error"})
    }
}
const addCategoryOffer = async (req,res)=>{
try {
    const percentage = parseInt(req.body.percentage);
    const categoryId = req.body.categoryId;
    const category = await category.findById(categoryId);
    if(!category){
        return res.status(404).json({status:false,message:"category not found"});
    }
    const products = await product.find({category:category._id});
    const hasProductOffer = products.some((product)=>product.productOffer>percentage);
    if(hasProductOffer){
        return res.json({status:false,message:"products within this category already have product offers"})
    }
    await category.updateOne({_id:categoryId},{$set:{categoryOffer:percentage}});
    for(const product of products){
        product.productOffer=0;
        product.salePrice=product.regularPrice;
        await product.save();
    }
    res.json({status:true});
} catch (error) {
    res.status(500).json({status:false,message:"Internal server error"});
}
};
const removeCategoryOffer = async(req,res)=>{
    try {
        const categoryId = req.body.categoryId;
        const category = await category.findById(categoryId);
        if(!category){
            return res.status(404).json({status:false , message:"Category not found"})
        }
        const percentage = category.categoryOffer;
        const products = await product.find({category:category._id});
        if(products.length>0){
            for(const product of products){
                product.salePrice += Math.floor(product.regularPrice * (percentage/100));
                product.productOffer = 0;
                await product.save();
            }
        }
        category.categoryOffer = 0;
        await category.save();
        res.json({status:true});
    } catch (error) {
        res.status(500).json({status:false, message:"Internal server error"});
    }
}
module.exports = {
    categoryInfo,
    addCategory,
    addCategoryOffer,
    removeCategoryOffer,
}