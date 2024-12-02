const user = require("../../models/userSchema");

const customerInfo = async (req,res)=>{
    try {
        let search = "";
        if(req.query.search){
            search = req.query.search
        }
        let page = 1;
        if(req.query.page){
            page=req.query.page
        }
        const limit = 3;
        const userData = await user.find({
            isAdmin:false,
            $or:[
                {name:{$regex:".*"+search+".*"}},
                {email:{$regex:".*"+search+".*"}},
            ],
        })
        .limit(limit*1)
        .skip((page-1)*limit)
        .exec();

        const count = await user.find({
            isAdmin:false,
            $or:[
                {name:{$regex:".*"+search+".*"}},
                {email:{$regex:".*"+search+".*"}},
            ],
        }).countDocuments();
        res.render("customers")
    } catch (error) {
        
    }
}
const customerBlocked = async (req,res)=>{
    try {
        let id=req.query.id;
        await user.updateOne({_id:id},{$set:{isBlocked:true}});
        res.redirect("/admin/users");
    } catch (error) {
        res.direct("/pageerror")
    }
}
const customerunBlocked = async(req,res)=>{
    try {
        let id = req.query.id;
        await user.updateOne({_id:id},{$set:{isBlocked:false}})
        res.redirect("/admin/users");
    } catch (error) {
        res.redirect("/pageerror");
    }
}
module.exports = {
    customerInfo,
    customerBlocked,
    customerunBlocked,
}