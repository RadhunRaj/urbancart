const mongoose = require('mongoose');

const {Schema} = mongoose;

const productSchema = new Schema({
    productName:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    brand:{
        type:String,
        required:false
    },
    category:{
        type:Schema.Types.ObjectId,
        ref:'category',
        required:true
    },
    regularPrice:{
        type:Number,
        required:true
    },
    salePrice:{
        type:Number,
        required:true
    },
    productOffer:{
        type:Number,
        default:0
    },
    quantity:{
        type:Number,
        default:true
    },
    size:{
        type:String,
        required:false
    },
    color:{
        type:String,
        required:true
    },
    productImage:{
        type:[String],
        required:true
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    status:{
        type:String,
        enum:['Available','out of stock','Discontinued'],
        required:true,
        default:"Available"
    },
},{timestamps:true});

const products = mongoose.model("products",productSchema)

module.exports = products;