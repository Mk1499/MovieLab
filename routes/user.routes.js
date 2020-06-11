const users = require("../controllers/user.controller");
const UserRouter = require("express").Router();
const userAuth = require("../middlewares/userAuth");
const multer = require('multer');
// const upload = multer({ dest: 'public/profileimgs/' })


const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, 'public/')
    } , 
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now()+'.jpg')
      }
})

const upload = multer({ storage: storage })




UserRouter.post("/signup", users.signUp);

UserRouter.post("/login", users.login);

UserRouter.get("/:userId", userAuth, users.findOne);

UserRouter.post("/updateimg", upload.single("new-image"),userAuth , users.updateImg);

module.exports = UserRouter;