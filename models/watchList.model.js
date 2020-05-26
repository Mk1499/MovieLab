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
          return;
      }
    }).then(res => {
        let addQ = {
            name:"add to watch list",
            text : "Insert into watchlist (userid,mediaid,type,title,poster_path,backdrop_path,popularity,release_date,vote_average) values ($1,$2,$3,$4,$5,$6,$7,$8,$9)",
            values:[list.userid,list.mediaid,list.type,list.title,list.poster_path,list.backdrop_path,list.popularity,list.release_date,list.vote_average]
        }
        sql.query(addQ)
        .then(res => {
            result(null, { id: res.insertId, ...list });
        })
    })
    .catch(err => {
        console.log("Error : ",err);
        
    });

  //  query = `SELECT * FROM Users WHERE email = '${user.email}' and password = '${user.password}'`;
  //   console.log("Q : ", query);

  //   sql.query(query, (err, res) => {
  //     if (err) {
  //       console.log("error : ", err);
  //       result(err, null);
  //       return;
  //     }

  //   if (res.length) {

  //   }

  //   // not found User with given email and password
  //   result({ kind: "not_found" }, null);
  // });
};

module.exports = WList;
