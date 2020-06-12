const sql = require("./db.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// constructor
const User = function(user) {
  this.fullname = user.fullname;
  this.email = user.email;
  this.phone = user.phone;
  this.password = user.password;
  this.avatarurl = user.avatarurl 
};

// Create user
User.create = (userData, result) => {
  console.log("Create Q");

  //   let q = `SELECT id from Users WHERE email = '${userData.email}'`;
  let q = {
    name: "prev-email",
    text: "SELECT id from Users WHERE email = $1",
    values: [userData.email]
  };

  sql
    .query(q)
    .then(res => {
      if (res.rowCount > 0) {
        result(
          {
            message: "Sorry But This email is already signed up before"
          },
          null
        );
        throw "Sorry But This email is already signed up before";
      } else if (res.rowCount === 0) {
        return res;
      }
    }).then(res => {
        let query = {
            name:"Create User",
            text : "Insert into users (fullname,email,password,avatarurl) values ($1,$2,$3,$4)  RETURNING id",
            values:[userData.fullname,userData.email,userData.password,userData.avatarurl]
        }
        sql.query(query, (err, res) => {
          if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
          }
          console.log("CRes : ", res); 
  
          let fullUser = { id: res.rows[0].id, ...userData };
  
          console.log("created user: ", fullUser);
          let token = jwt.sign({ userData: fullUser }, process.env.tokenSecret);
  
          userData.token = token;
          result(null, { id: res.rows[0].id, ...userData });
        }); 
    })
    .catch(err => {
      console.log("error: ", err);
      result(err, null);
    });
};

// Login User
User.login = (user, result) => {
    console.log("User Data : ", user);
    
  
    let query = `SELECT * FROM Users WHERE email = '${user.email}'`;
  
    sql.query(query, (err, res) => {
        console.log("R :",res.rowCount);
        
      if (err) {
        console.log("error : ", err);
        result(err, null);
        throw err;
      }
      if (res.rowCount>0) {
        console.log("User : ", res.rows[0].password);
        let userData = res.rows[0];
        bcrypt.compare(user.password, userData.password, (err, match) => {
          if (err) {
            console.log("error : ", err);
            result(err, null);
            return;
          } else if (match) {
            console.log("found user : ", userData);
            let token = jwt.sign({ userData }, process.env.tokenSecret);
  
            userData.token = token;
            result(null, userData);
            return;
          } else {
            result({ kind: "not_found" }, null);
          }
        });
      } else {
        result({ kind: "not_found" }, null);
      }
    });
  };


  User.updateImg = (req,result) => {
   
   console.log("model :  ",req.body.userid, req.file.filename);
   let userID = req.body.userid; 
   let imgUrl = "images/"+req.file.filename;
   
    let q = {
      name: "update user avatar url",
      text: "UPDATE users SET avatarurl=$1 WHERE id = $2",
      values: [imgUrl,userID]
    };
    sql.query(q)
        .then(res=> {
          console.log("update user img res :",res);
          result(null,{id:userID,imgUrl})
        })
        .catch(err => {
          console.log("error: ", err);
          result(err, null);
        })
  }
module.exports = User;
