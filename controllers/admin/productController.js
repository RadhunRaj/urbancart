const Product = require("../../models/productSchema");
const Category = require("../../models/categorySchema");
const Brand = require("../../models/brandSchema");
const User = require("../../models/userSchema");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const getProductAddPage = async(req,res)=>{
    try {
        const category = await Category.find({isListed:true});
        const brand = await Brand.find({isBlocked:false});
        res.render("product-add",{
            cat:category,
            brand:brand
        });
    } catch (error) {
        res.redirect("/admin/pageerror");
    }
}

const addProducts = async (req, res) => {
    try {
        const products = req.body;
        const productExists = await Product.findOne({ productName: products.productName });
        
        if (productExists) {
            return res.status(400).json("Product already exists, please try with another name");
        } else {
            let images = [];
            
            if (req.files) {
                for (let field of ['images1', 'images2', 'images3']) {
                    if (req.files[field] && req.files[field].length > 0) {
                        let originalImagePath = req.files[field][0].path;

                        const originalDir = path.dirname(originalImagePath);
                        if (!fs.existsSync(originalDir)) {
                            fs.mkdirSync(originalDir, { recursive: true });
                        }

                        let resizedImagePath = path.join('public', 'uploads', 'product-images', req.files[field][0].filename);
                        
                        const directory = path.dirname(resizedImagePath);
                        if (!fs.existsSync(directory)) {
                            fs.mkdirSync(directory, { recursive: true });
                        }
                        
                        await sharp(originalImagePath)
                            .resize({ width: 440, height: 440 })
                            .toFile(resizedImagePath);
                        
                        images.push(req.files[field][0].filename);
                        
                      
                        try {
                            fs.unlinkSync(originalImagePath);
                        } catch (unlinkError) {
                            console.error('Error deleting original file:', unlinkError);
                        }
                    }
                }
            }

            // const brandId = await Brand.findById(products.brand);
            // if (!brandId) {
            //     return res.status(400).json("Invalid brand ID");
            // }
            
            const categoryId = await Category.findOne({ name: products.category });
            
            if (!categoryId) {
                return res.status(400).json("Invalid category name");
            }
            
            let productStatus = products.quantity > 0 ? "Available" : "Out of stock";

        
            // const offer = await Offer.findOne({ product: categoryId._id });
            // let offerPrice = products.salePrice;
            
            // if (offer) {
            //     let offerValue;
                
            //     if (offer.discountType === 'percentage') {
            //         offerValue = products.salePrice * (offer.discountValue / 100);
            //     } else {
            //         offerValue = offer.discountValue;
            //     }
                
            //     offerPrice = products.salePrice - offerValue;
            //     offerPrice = Math.max(offerPrice, 0); 
            // }

          
            
            const newProduct = new Product({
                productName: products.productName,
                description: products.description,
                category: categoryId._id,
                regularPrice: products.regularPrice,
                salePrice: products.salePrice,
                createdOn: new Date(),
                quantity: products.quantity,
                size: products.size,
                color: products.color,
                productImage: images,
                status: productStatus,
            });
            
            await newProduct.save();

            

            return res.redirect("/admin/products");
        }
    } catch (error) {
        console.error("Error Saving product", error);
        return res.redirect("/admin/pageerror");
    }
};

const getAllProducts = async (req,res)=>{
    try {
        const search = req.query.search || "";
        const page = req.query.page || 1;
        const limit = 4;

        const productData = await Product.find({
            $or:[
                {productName:{$regex:new RegExp(".*"+search+".*","i")}},
                {brand:{$regex:new RegExp(".*"+search+".*","i")}},
            ],
        }).limit(limit*1).skip((page-1)*limit).populate('category').exec();

        const count = await Product.find({
            $or:[
                {productName:{$regex:new RegExp(".*"+search+".*","i")}},
                {brand:{$regex:new RegExp(".*"+search+".*","i")}},
            ],
        }).countDocuments();
        const category = await Category.find({isListed:true});
        const brand = await Brand.find({isBlocked:false});
        if(category && brand){
            res.render("products",{
                data:productData,
                currentPage:page,
                totalPages:Math.ceil(count/limit),
                cat:category,
                brand:brand,
            })
        }else{
            res.render("page-404");
        }
    } catch (error) {
        res.redirect("/admin/pageerror")
    }
}
const addProductOffer = async(req,res)=>{
    try {
        const {productId,percentage}=req.body;
        const findProduct = await Product.findOne({_id:productId});
        const findCategory = await Category.findOne({_id:findProduct.category})
        if(findCategory.categoryOffer>percentage){
            return res.json({status:false,message:"This products category already has a offer"})
        }
        findProduct.salePrice = findProduct.salePrice-Math.floor(findProduct.regularPrice*(percentage/100));
        findProduct.productOffer = parseInt(percenatage);
        await findProduct.save();
        findCategory.categoryOffer=0;
        await findCategory.save();
        res.json({status:true})

    } catch (error) {
        res.redirect("/admin/pageerror");
        res.status(500).json({status:false,message:"Internal server error"})
    }
}
const removeProductOffer = async(req,res)=>{
    try {
        const {productId} = req.body;
        const findProduct = await Product.findOne({_id:productId});
        const percentage = findProduct.productOffer;
        findProduct.salePrice = findProduct.salePrice+Math.floor(findProduct.regularPrice*(percenatge/100));
        findProduct.productOffer = 0;
        await findProduct.save();
        res.json({status:true})

    } catch (error) {
        res.redirect("/admin/pageerror");
    }
}
const blockProduct = async (req,res)=>{
    try {
        let id = req.query.id;
        await Product.updateOne({_id:id},{$set:{isBlocked:true}});
        res.redirect("/admin/products");
    } catch (error) {
        res.redirect("/admin/pageerror");
    }
}
const unblockProduct = async (req,res)=>{
    try {
        let id = req.query.id;
        await Product.updateOne({_id:id},{$set:{isBlocked:false}});
        res.redirect("/admin/products")
    } catch (error) {
        res.redirect("/admin/pageerror");
    }
}
const getEditProduct = async (req, res) => {
    try {
        const id = req.params.id;
        console.log(id);

        const product = await Product.findOne({ _id: id })
                                      
        console.log(product);

        const category = await Category.find({});

        res.render("edit-product", {
            product: product,
            cat: category
        });
    } catch (error) {
        console.error(error);
        res.redirect("/admin/pageerror");
    }
};

const editProduct = async (req,res)=>{
    try {
        const id = req.params.id;
        // const product = await Product.findOne({_id:id});
        const data = req.body;
        console.log(data);
        
        const existingProduct = await Product.findOne({
            productName:data.productName,
            _id:{$ne:id}
        })
        if(existingProduct){
            return res.status(400).json({error:"Product name exists,Try another name"})
        }
        const category = await Category.findOne({ name: data.category });
        if (!category) {
            return res.status(400).json({ error: "Invalid category name" });
        }
        const images = [];
        if (req.files && req.files.length>0){
            for(let i=0;i<req.files.length;i++){
                images.push(req.files[i].filename);
            }
        }
        const updateFields = {
            productName:data.productName,
            description:data.description,
            // brand:data.brand,
            category:category._id,
            regularPrice:data.regularPrice,
            salePrice:data.salePrice,
            quantity:data.quantity,
            size:data.size,
            color:data.color
        }
        if(req.files.length>0){
            updateFields.$push = {productImage:{$each:images}};
        }
        await Product.findByIdAndUpdate(id,updateFields,{new:true});
        res.redirect("/admin/products");
    } catch (error) {
        console.error(error);
        res.redirect("/admin/pageerror")
        
    }
}
const deleteSingleImage = async (req,res)=>{
    try {
        const {imageNameToServer,productIdToServer}= req.body;
        const product = await Product.findByIdAndUpdate(productIdToServer,{$pull:{productImage:imageNameToServer}});
        const imagePath = path.join("public","uploads","re-image",imageNameToServer);
        if(fs.existsSync(imagePath)){
            await fs.unlinkSync(imagePath);
            console.log(`Image ${imageNameToServer} deleted successfully`);
        }else{
            console.log(`image ${imageNameToServer} not found`);
        }
        res.send({status:true})
    } catch (error) {
        res.redirect("/admin/pageerror");
    }
}
module.exports = {
    getProductAddPage,
    addProducts,
    getAllProducts,
    addProductOffer,
    removeProductOffer,

    blockProduct,
    unblockProduct,
    
    getEditProduct,
    editProduct,
    deleteSingleImage,
}