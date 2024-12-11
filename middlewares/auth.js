const User = require("../models/userSchema");
const userAuth = (req,res,next)=>{
    const userId = req.session.user || req.user;   
    if(userId){
        User.findById(userId)
        .then(data=>{
            if(data && !data.isBlocked){
                next()
            }else{
                res.redirect("/login")
            }
        })
        .catch(error=>{
            console.log("Error in user auth middleware");
            res.status(500).send("internal server error");
        })
    }else{
        res.redirect("/login")
    }
}

const adminAuth = (req,res,next)=>{
    if(req.session.admin){
        User.findOne({isAdmin:true})
    .then(data=>{
        if(data){
            next()
        }else{
            res.redirect("/admin/login")
        }
    })
    .catch(error=>{
        console.log("Error in adminAuth Middleware",Error);
        res.status(500).send("internal server error")
    })
    }else{
        res.redirect("/admin/login")
    }
}

module.exports={
    userAuth,
    adminAuth,
}