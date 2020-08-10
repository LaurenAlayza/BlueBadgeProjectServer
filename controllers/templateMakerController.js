const router = require("express").Router();
const Maker = require("../db").import("../models/templateMaker");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//New Template Maker is created/POSTs username & password.
router.post("/maker", function (req, res) {
  Maker.create({
    username: req.body.maker.username,
    passwordhash: bcrypt.hashSync(req.body.maker.passwordhash, 13),
  })
    .then(function createSuccess(maker) {
      let token = jwt.sign({ id: maker.id }, process.env.JWT_SECRET, {
        expiresIn: 60 * 60 * 24,
      });
      res.json({
        maker: maker,
        message: "Template Maker successfuly created!",
        sessionToken: token,
      });
    })
    .catch((err) => res.status(500).json({ error: err }));
});

//POST an existing Template Maker Login **RE-WORK THIS CODE**
router.post("/maker/login", function (req, res) {
  Maker.findOne({
    where: {
      username: req.body.maker.username,
    },
  })
    .then(function loginSuccess(maker) {
      if (user) {
        bcrypt.compare(
          req.body.maker.passwordhash,
          maker.passwordhash,
          function (err, matches) {
            if (matches) {
              let token = jwt.sign({ id: maker.id }, process.env.JWT_SECRET, {
                expiresIn: 60 * 60 * 24,
              });

              res.status(200).json({
                user: user,
                message: "User successfully logged in!",
                sessionToken: token,
              });
            } else {
              res.status(502).send({ error: "Login failed" });
            }
          }
        );
      } else {
        res.status(500).json({ error: "User does not exist. " });
      }
    })
    .catch((err) => res.status(500).json({ error: err }));
});

module.exports = router;
