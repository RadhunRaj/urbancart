
const multer = require("multer")
const path = require("path")



// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
       
//         cb(null, path.join(__dirname, "../public/uploads/product-images"));
//     },
//     filename: (req, file, cb) => {
        
//         cb(null, Date.now() + "-" + file.originalname); 
//     }
// });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        
        cb(null, path.join(__dirname, '..', 'public', 'storage', 'product-images'));
    },
    filename: function (req, file, cb) {
       
        cb(null, Date.now() + '-' + file.originalname);
    }
  });
  
  const upload = multer({ storage: storage });

module.exports = storage