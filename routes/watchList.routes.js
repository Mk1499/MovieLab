const lists = require("../controllers/watchList.controller");
const ListRouter = require("express").Router();
const userAuth = require("../middlewares/userAuth");

ListRouter.post("/add", lists.addToWatchList);


module.exports = ListRouter;