const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin/adminController");
const customerController = require("../controllers/admin/customerController");
const categoryController = require("../controllers/admin/categoryController");
const brandController = require("../controllers/admin/brandController");
const productController = require("../controllers/admin/productController");
const {userAuth,adminAuth} = require("../middlewares/auth");
const multer = require("multer");
const storage = require("../heplers/multer");
const uploads = multer({storage:storage});


router.get("/pageerror",adminController.pageerror)
// Login & Logout
router.get("/login",adminController.loadLogin);
router.post("/login",adminController.login);
router.get("/",adminAuth,adminController.loadDashboard);
router.get("/logout",adminController.logout);
router.get("/users",adminAuth,customerController.customerInfo);
router.get("/blockCustomer",adminAuth,customerController.customerBlocked);
router.get("/unblockCustomer",adminAuth,customerController.customerunBlocked);
// Category
router.get("/category",adminAuth,categoryController.categoryInfo);
router.post("/addCategory",adminAuth,categoryController.addCategory);
router.post("/addCategoryOffer",adminAuth,categoryController.addCategoryOffer);
router.post("/removeCatergoryOffer",adminAuth,categoryController.removeCategoryOffer);
router.get("/listCategory",adminAuth,categoryController.getListCategory);
router.get("/unListCategory",adminAuth,categoryController.getUnlistCategory);
router.get("/editCategory",adminAuth,categoryController.getEditCategory);
router.post("/editCategory/:id",adminAuth,categoryController.editCategory);
// Brand Manage
router.get("/brands",adminAuth,brandController.getBrandPage);
router.post("/addBrand",adminAuth,uploads.single("image"),brandController.addBrand);
router.get("/blockBrand",adminAuth,brandController.blockBrand);
router.get("/unBlockBrand",adminAuth,brandController.unBlockBrand);
router.get("/deleteBrand",adminAuth,brandController.deleteBrand);
// Product Manage
router.get("/addProducts",adminAuth,productController.getProductAddPage)
module.exports = router;