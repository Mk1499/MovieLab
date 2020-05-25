const users = require("../controllers/user.controller");
const UserRouter = require("express").Router();
const userAuth = require("../middlewares/userAuth");

UserRouter.post("/signup", users.signUp);

UserRouter.post("/login", users.login);

UserRouter.get("/:userId", userAuth, users.findOne);

module.exports = UserRouter;