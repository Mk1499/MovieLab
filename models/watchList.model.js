const sql = require("./db.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// constructor
const WList = function(WList) {
  this.userid = WList.userid;
  this.mediaid = WList.mediaid;
  this.type = WList.type;
  this.title = WList.title;
  this.poster_path = WList.poster_path;
  this.backdrop_path = WList.backdrop_path;
  this.popularity = WList.popularity;
  this.release_date = WList.release_date;
  this.vote_average = WList.vote_average;
  this.overview = WList.overviewzz
};

// add to watch list
WList.create = (list, result) => {
  console.log("List Data : ", list);

  let checkAddedQ = {
    name: "check Added ",
    text: "SELECT * FROM watchlist WHERE userid = $1 and mediaid= $2",
    values: [list.userid, list.mediaid]
  };

  sql
    .query(checkAddedQ)
    .then(res => {
      if (res.rowCount > 0) {
        result(
          {
            message: "Sorry But This Movie is already in your watch list"
          },
          null
        );
        throw "Sorry But This Movie is already in your watch list";
      }
    })
    .then(res => {
      let addQ = {
        name: "add to watch list",
        text:
          "Insert into watchlist (userid,mediaid,type,title,poster_path,backdrop_path,popularity,release_date,vote_average,overview) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)",
        values: [
          list.userid,
          list.mediaid,
          list.type,
          list.title,
          list.poster_path,
          list.backdrop_path,
          list.popularity,
          list.release_date,
          list.vote_average,
          list.overview
        ]
      };
      sql.query(addQ).then(res => {
        result(null, { id: res.insertId, ...list });
      });
    })
    .catch(err => {
      console.log("Error : ", err);
    });
};

// add to watch list
WList.getWList = (listData, result) => {
  console.log("List Data : ", listData);

  let getSeriesList = {
    name: "Get User Series List ",
    text: "SELECT * FROM watchlist WHERE userid = $1 and type= $2",
    values: [listData.userid, "series"]
  };

  let rslt = {
    series: [],
    movies: []
  };

  sql
    .query(getSeriesList)
    .then(res => {
      console.log("series : ",res);
      
      rslt.series = res.rows;
    })
    .then(res => {
      let getMoviesList = {
        name: "Get User Movies List",
        text: "SELECT * FROM watchlist WHERE userid = $1 and type= $2",
        values: [listData.userid, "movie"]
      };
      sql.query(getMoviesList).then(res => {
        rslt.movies = res.rows
        result(null, rslt);
      });
    })
    .catch(err => {
      console.log("Error : ", err);
    });
};

module.exports = WList;
