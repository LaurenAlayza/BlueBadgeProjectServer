const router = require("express").Router();
let validateSessionMaker = require("../middleware/validate-sessionMaker");
const Temp = require("../db").import("../models/template");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const sequelize = require("../db");

/*
                TEMPLATE MAKER SECTION BELOW
*/
/*Template Makers can create & POST a new template with 
subject line, message body, and up to 3 tags.*/
router.post("/temp/create", validateSessionMaker, (req, res) => {
  const tempEntry = {
    subjLine: req.body.temp.subjLine,
    msgBody: req.body.temp.msgBody,
    keys: req.body.temp.keys,
    owner: req.maker.id,
  };
  Temp.create(tempEntry)
    .then((temp) => res.status(200).json(temp))
    .catch((err) => res.status(500).json({ error: err }));
});

/*Template makers can retrieve & GET their templates by maker id.*/
router.get("/temp/:id", validateSessionMaker, (req, res) => {
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
router.put("/temp/:id", validateSessionMaker, function (req, res) {
  const tempEntry = {
    subjLine: req.body.temp.subjLine,
    msgBody: req.body.temp.msgBody,
    keys: req.body.temp.keys,
    owner: req.maker.id,
  };
  const query = { where: { id: req.params.id, owner: req.maker.id } };

  Temp.update(tempEntry, query).then((temp) =>
    res.status(200).json({ temp: temp })
  );
  //.catch((err) => res.status(500).json({ error: err }));
});

//Template Makers can DELETE their templates
router.delete("/temp/:id", validateSessionMaker, function (req, res) {
  const query = { where: { id: req.params.id, owner: req.maker.id } };

  Temp.destroy(query)
    .then(() =>
      res.status(200).json({ message: "The template has been removed" })
    )
    .catch((err) => res.status(500).json({ error: err }));
});

//                 TEMPLATE USER SECTION BELOW
//Template Users can access templates by KEYWORD
router.get("/temps/:keyword", validateSessionMaker, (req, res) => {
  let keyword = req.params.keyword;
  sequelize
    .query(`SELECT * from temps WHERE keys LIKE '%${keyword}%'`)

    .then((temp) => res.status(200).json(temp));
  //.catch((err) => res.status(500).json({ error: err }));
});

//Template Users can save favorite templates. **TBD**
//code is yet to be written for this part :) **wishlist stretch goal**

module.exports = router;
