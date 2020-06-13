const WList = require("../models/watchList.model");
const bcrypt = require("bcrypt");

exports.addToWatchList = (req, res) => {
  // Validate request
  if (Object.keys(req.body).length === 0) {
    res.status(400).send({
      error: "Content can not be empty!"
    });
  }

  if (!req.body.userid) {
    res.status(400).send({
      error: "User id is required"
    });
  } else if (!req.body.mediaid) {
    res.status(400).send({
      error: "Media Id is required"
    });
  } else {
    console.log("REQ : " , req.body.overview); 
    // Create a User
    const list = new WList({
      userid: req.body.userid,
      mediaid:req.body.mediaid,
      type:req.body.type,
      title:req.body.title,
      poster_path:req.body.poster_path,
      backdrop_path:req.body.backdrop_path,
      popularity:req.body.popularity,
      release_date:req.body.release_date,
      vote_average: req.body.vote_average,
      overview: req.body.overview
    });

    WList.create(list, (err, data) => {
        if (err)
          res.status(500).send({
            error: err.message || "Some error occurred while creating the User."
          });
        else res.send(data);
      });
  }
};


exports.getWList = (req, res) => {
  // Validate request
  if (Object.keys(req.body).length === 0) {
    res.status(400).send({
      error: "Content can not be empty!"
    });
  }
console.log("REQ Body : ", req.body);

  if (!req.body.userid) {
    res.status(400).send({
      error: "User id is Invalid"
    });
  } else {
    const listData= {
      userid : req.body.userid, 
    }

    WList.getWList(listData, (err, data) => {
        if (err)
          res.status(500).send({
            error: err.message || "Some error occurred while creating the User."
          });
        else res.send(data);
      });
  }
};
