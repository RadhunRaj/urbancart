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
module.exports={
    loadHome,
    pageNotFound,
    loadSignup
}