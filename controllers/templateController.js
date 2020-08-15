const router = require("express").Router();
let validateSessionUser = require("../middleware/validate-sessionUser");
const Temp = require("../db").import("../models/template");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const sequelize = require("../db");

/*
                TEMPLATE MAKER SECTION BELOW
*/
/*Template Makers can create & POST a new template with 
subject line, message body, keyword tags.*/
router.post("/temp/create", validateSessionUser, (req, res) => {
  console.log(req.user);
  if (req.user.accounttype != "maker") {
    res.json({
      message: "account type is not maker",
    });
  }

  const tempEntry = {
    subjLine: req.body.temp.subjLine,
    msgBody: req.body.temp.msgBody,
    keys: req.body.temp.keys,
    owner: req.user.id,
  };
  Temp.create(tempEntry)
    .then((temp) => res.status(200).json(temp))
    .catch((err) => res.status(500).json({ error: err }));
});

/*Template makers can retrieve & GET their templates by maker id.*/
router.get("/temp/:id", validateSessionUser, (req, res) => {
  if (req.user.accounttype != "maker") {
    res.json({
      message: "account type is not maker",
    });
  }
  let makerid = req.params.id;
  console.log(makerid);
  Temp.findAll({
    where: {
      id: makerid,
    },
  })
    .then((logs) => res.status(200).json(logs))
    .catch((err) => res.status(500).json({ error: err }));
});

//Template Makers can PUT updated info in template.
router.put("/temp/:id", validateSessionUser, function (req, res) {
  if (req.user.accounttype != "maker") {
    res.json({
      message: "account type is not maker",
    });
  }
  const tempEntry = {
    subjLine: req.body.temp.subjLine,
    msgBody: req.body.temp.msgBody,
    keys: req.body.temp.keys
  };
  const query = { where: { id: req.params.id, owner: req.user.id } };

  Temp.update(tempEntry, query).then((temp) =>
    res.status(200).json({ temp: temp })
  );
  //.catch((err) => res.status(500).json({ error: err }));
});

//Template Makers can DELETE their templates
router.delete("/temp/:id", validateSessionUser, function (req, res) {
  if (req.user.accounttype != "maker") {
    res.json({
      message: "account type is not maker",
    });
  }
  const query = { where: { id: req.params.id, owner: req.user.id } };

  Temp.destroy(query)
    .then(() =>
      res.status(200).json({ message: "The template has been removed" })
    )
    .catch((err) => res.status(500).json({ error: err }));
});

//                 TEMPLATE USER SECTION BELOW
//Template Users can access templates by KEYWORD
router.get("/temps/:keyword", validateSessionUser, (req, res) => {
  let keyword = req.params.keyword;
  sequelize
    .query(`SELECT * from temps WHERE keys LIKE '%${keyword}%'`)

    .then((temp) => res.status(200).json(temp));
  //.catch((err) => res.status(500).json({ error: err }));
});

//Template Users can save favorite templates. **TBD**
//code is yet to be written for this part! **wishlist stretch goal**

module.exports = router;
