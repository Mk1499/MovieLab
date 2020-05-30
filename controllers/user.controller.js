const User = require("../models/user.model");
const bcrypt = require("bcrypt");

exports.signUp = (req, res) => {
  // Validate request
  if (Object.keys(req.body).length === 0) {
    res.status(400).send({
      error: "Content can not be empty!"
    });
  }

  if (!req.body.fullName) {
    res.status(400).send({
      error: "User name is required"
    });
  } else if (!req.body.email) {
    res.status(400).send({
      error: "email is required"
    });
  } else if (!req.body.password) {
    res.status(400).send({
      error: "Password is required"
    });
  } else if (!req.body.phone) {
    res.status(400).send({
      error: "Phone number is required"
    });
  } else {
    let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,8}\.[0-9]{1,8}\.[0-9]{1,8}\.[0-9]{1,8}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!emailRegex.test(req.body.email)) {
      res.status(400).send({
        error: "Please Enter a valid email"
      });
    } 
    
    else {
      // Create a User
      let enhancedEmail = req.body.email.trim().toLocaleLowerCase(); 
      const user = new User({
        fullName: req.body.fullName,
        type: "client",
        email: enhancedEmail,
        phone: req.body.phone,
        password: req.body.password,
        avatarURL:req.body.avatarURL || "https://provisionhealthcare.com/wp-content/uploads/2018/11/user-avatar.jpg"
      });

      bcrypt.hash(user.password, 10, (err, hashedPW) => {
        user.password = hashedPW;

        // Save User in the database

        User.create(user, (err, data) => {
          if (err)
            res.status(500).send({
              error:
                err.message || "Some error occurred while creating the User."
            });
          else res.send(data);
        });
      });
    }
  }
};

exports.findOne = (req, res) => {
  User.findById(req.params.userId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          error: `Not found Customer with id ${req.params.userId}.`
        });
      } else {
        res.status(500).send({
          error: "Error retrieving Customer with id " + req.params.userId
        });
      }
    } else res.send(data);
  });
};

// Find a single User with a userId
exports.login = (req, res) => {
  let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,8}\.[0-9]{1,8}\.[0-9]{1,8}\.[0-9]{1,8}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!emailRegex.test(req.body.email)) {
    res.status(400).send({
      error: "Please Enter a valid email"
    });
  } else {
    let enhancedEmail = req.body.email.trim().toLocaleLowerCase();
    let user = {
      email: enhancedEmail,
      password: req.body.password
    };
    User.login(user, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            error: `Not found User with this email and password `
          });
        } else {
          res.status(500).send({
            error: err.message || "Error retrieving Customer "
          });
        }
      } else res.send(data);
    });
  }
};
