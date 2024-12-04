const user = require("../models/userSchema");
const userAuth = (req,res,next)=>{
    const userId = req.session.user || req.user;
    console.log("userId",userId);
    
    if(userId){
        user.findById(userId)
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
    user.findOne({isAdmin:true})
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
}

module.exports={
    userAuth,
    adminAuth,
}