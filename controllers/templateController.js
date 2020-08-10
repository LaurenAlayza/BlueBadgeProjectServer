let express = require("express");
let router = express.Router();
let validateSession = require("../middleware/validate-session");
const Temp = require("../db").import("../models/template");

/*Template Makers can create & POST a new message template with 
subject line, message body, and up to 3 tags.*/
router.post("/temp/create", validateSession, (req, res) => {
  const tempEntry = {
    subjLine: req.body.temp.subjLine,
    msgBody: req.body.temp.msgBody,
    tag1: req.body.temp.tag1,
    tag2: req.body.temp.tag2,
    tag3: req.body.temp.tag3,
    owner: req.user.id,
  };
  Temp.create(tempEntry)
    .then((temp) => res.status(200).json(temp))
    .catch((err) => res.status(500).json({ error: err }));
});

/*Template makers can retrieve & GET their own templates by user id.*/
router.get("/temp/:id", validateSession, (req, res) => {
  let userid = req.user.id;
  Log.findAll({
    where: {
      owner: userid,
    },
  })
    .then((logs) => res.status(200).json(logs))
    .catch((err) => res.status(500).json({ error: err }));
});

//Template Makers can PUT new or updated information into a previously created template.
router.put("/temp/:id", validateSession, function (req, res) {
  const logEntry = {
    subjLine: req.body.temp.subjLine,
    msgBody: req.body.temp.msgBody,
    tag1: req.body.temp.tag1,
    tag2: req.body.temp.tag2,
    tag3: req.body.temp.tag3,
    owner: req.user.id,
  };
  const query = { where: { id: req.params.id, owner: req.user.id } };

  Temp.update(tempEntry, query)
    .then((logs) => res.status(200).json({ temps: temps }))
    .catch((err) => res.status(500).json({ error: err }));
});

//Template Makers can DELETE their templates
router.delete("/temp/:id", validateSession, function (req, res) {
  const query = { where: { id: req.params.id, owner: req.user.id } };

  Temp.destroy(query)
    .then(() =>
      res.status(200).json({ message: "The template has been removed" })
    )
    .catch((err) => res.status(500).json({ error: err }));
});

//(Template Users can access templates made by Template Makers.)

//Template Users can access templates by tag name.
/*
router.get("/temp/tag", validateSession, (req, res) => {
  let tags = req.;
  Log.findAll({
    where: {
      tag1: tag1,
      tag2: tag2,
      tag2: tag3,
    },
  })
    .then((logs) => res.status(200).json(logs))
    .catch((err) => res.status(500).json({ error: err }));
});
*/

module.exports = router;
