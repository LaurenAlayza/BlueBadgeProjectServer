const router = require("express").Router();
const User = require("../db").import("../models/templateUser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//New Template User is created/POSTs username & password.
router.post("/user", function (req, res) {
  User.create({
    username: req.body.user.username,
    passwordhash: bcrypt.hashSync(req.body.user.passwordhash, 13),
    accounttype: req.body.user.accounttype,
  })
    .then(function createSuccess(user) {
      console.log(user.accounttype);
      let token = jwt.sign(
        { id: user.id, accounttype: user.accounttype },
        process.env.JWT_SECRET,
        {
          expiresIn: 60 * 60 * 24,
        }
      );

      res.json({
        user: user,
        message: "User successfully created!",
        sessionToken: token,
      });
    })
    .catch((err) => res.status(500).json({ error: err }));
});

//POST an existing Template User Login
router.post("/user/login", function (req, res) {
  User.findOne({
    where: {
      username: req.body.user.username,
    },
  })
    .then(function loginSuccess(user) {
      if (user) {
        bcrypt.compare(req.body.user.passwordhash, user.passwordhash, function (
          err,
          matches
        ) {
          if (matches) {
            let token = jwt.sign(
              { id: user.id, accounttype: user.accounttype },
              process.env.JWT_SECRET,
              {
                expiresIn: 60 * 60 * 24,
              }
            );

            res.status(200).json({
              user: user,
              message: "User successfully logged in!",
              sessionToken: token,
            });
          } else {
            res.status(502).send({ error: "Login failed" });
          }
        });
      } else {
        res.status(500).json({ error: "User does not exist. " });
      }
    })
    .catch((err) => res.status(500).json({ error: err }));
});

module.exports = router;
