const lists = require("../controllers/watchList.controller");
const ListRouter = require("express").Router();
const userAuth = require("../middlewares/userAuth");

ListRouter.post("/add",userAuth, lists.addToWatchList);
ListRouter.get("/",userAuth, lists.getWList);



module.exports = ListRouter;