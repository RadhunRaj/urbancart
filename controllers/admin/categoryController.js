const category = require("../../models/categorySchema");

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

module.exports = {
    categoryInfo,
    addCategory,
}