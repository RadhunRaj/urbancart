const user = require("../../models/userSchema");
const env = require("dotenv").config();
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt")
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
const securePassword = async (password)=>{
    try {
        const passwordHash = await bcrypt.hash(password,10)
        return passwordHash;
    } catch (error) {
        
    }
}
const verifyOtp = async (req,res)=>{
    try {
        const {otp} = req.body;
        console.log(otp);
        if(otp===req.session.userOtp){
            const user = req.session.userData;
            const passwordHash = await securePassword(user.password);
            const saveUserData = new User({
                name : user.name,
                email: user.email,
                phone: user.phone,
                password:passwordHash,
            })
            await saveUserData.save();
            req.session.user = saveUserData._id;
            res.json({success:true, redirectUrl:"/"})
        }else{
            res.status(400).json({success:false,message:"invalid OTP, Try again"})
        }
        
    } catch (error) {
        console.error("error verfiying OTP",error);
        res.status(500).json({succes:false,message:"error occured"})
        
    }
}
const resendOtp = async (req,res)=>{
    try {
        const {email}=req.session.userData;
        if(!email){
            return res.status(400).json({success:false,message:"Email not found"})
        }
        const otp = generateOtp();
        req.session.userOtp = otp;
        const emailSent = await sendVerificationEmail(email,otp);
        if (emailSent){
            console.log("Resend OTP:",otp);
            res.status(200).json({succes:true,message:"OTP resend successfully"})
        }else{
            res.status(500).json({succes:false,message:"Failed to resend OTP, Try again"})
        }
    } catch (error) {
        console.error("error resending OTP",error);
        res.status(500).json({succes:false,message:"Internal server error"});
        
    }
}
module.exports={
    loadHome,
    pageNotFound,
    loadSignup,
    signup,
    verifyOtp,
    resendOtp,
}