const user = require("../../models/userSchema");
const env = require("dotenv").config();
const nodemailer = require("nodemailer");
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
function generateOtp(){
    return Math.floor(100000 + Math.random()*900000).toString();
}
async function sendVerificationEmail(email,otp){
    try {
        const transporter = nodemailer.createTransport({
            service:'gmail',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:process.env.NODEMAILER_EMAIL,
                pass:process.env.NODEMAILER_PASSWORD
            }
        })

        const info = await transporter.sendMail({
            from:process.env.NODEMAILER_EMAIL,
            to:email,
            subject:"Verify your Account",
            text:`Your OTP is ${otp}`,
            html:`<b>Your OTP:${otp}</b>`,
        })
        return info.accepted.length>0
    } catch (error) {
        console.error("Error sending email",error);
        return false;
    }
}
const signup = async (req,res) => {
    try {
        const{name,phone,email,password,cPassword}=req.body;
        if(password!== cPassword){
            return res.render("signup",{message:"Password not matching"})
        }
        const findUser = await user.findOne({email});
        if(findUser){
            return res.render("signup",{message:"email already exists"});
        }
        const otp = generateOtp();
        const emailSent = await sendVerificationEmail(email,otp);
        if(!emailSent){
            return res.json("email-error")
        }
        req.session.userOtp=otp;
        req.session.userData={name,phone,email,password};

        res.render("verify-otp");
        console.log("OTP sent",otp);
        
    } catch (error) {
        console.error("signup error",error);
        res.redirect("/pageNotFound");  
    }
}
module.exports={
    loadHome,
    pageNotFound,
    loadSignup,
    signup,
}