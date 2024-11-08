const user = require("../../models/userSchema");

const pageNotFound = async (req,res) => {
    try {
        res.render("pageNotFound")
    } catch (error) {
        res.redirect("/pageNotFound");
    }
}
const loadHome = async (req,res) => {
    try {
        return res.render('home')
    } catch (error) {
        console.log('Home page not found');
        res.status(500).send('server error')
        
    }
}
const loadSignup = async (req,res) => {
    try {
        return res.render('signup')
    } catch (error) {
        console.log("page not found",error);
        res.status(500).send("server error");
    }
}
const signup = async (req,res) => {
    const{name,email,phone,password}=req.body;
    try {
       const newUser = new user({name,email,phone,password});
       console.log(newUser);
       
       await newUser.save();
       return res.redirect('/signup')
    } catch (error) {
        console.error("Error for save user");
        res.status(500).send("Internal server error");
        
    }
}
// const signupToHome = async (req,res) => {
//     try {
//         return res.render('home')
//     } catch (error) {
//         console.log('Home page not found');
//         res.status(500).send('server error')
        
//     }
// }
module.exports={
    loadHome,
    pageNotFound,
    loadSignup,
    signup,
    // signupToHome
}