const jwt = require("jsonwebtoken");
const User = require("../db").import("../models/templateUser");
//const Maker = require("../db").import("../models/templateMaker");

const validateSession = (req, res, next) => {
  const token = req.headers.authorization;
  console.log('token -->', token);
  if (!token) {
      return res.status(403).send ({
           auth: false, message: 'No token provided' });
      } else {
          jwt.verify(token, process.env.JWT_SECRET,(err, decodeToken) => {
              console.log('decodeToken -->', decodeToken);
              if (!err && decodeToken) {
                  User.findOne({
                      where: {
                          id: decodeToken.id,
                      },
                  })
                  .then((user)=> {
                      console.log('user -->', user);
                      if (!user) throw err;
                      console.log('req -->', req);
                      req.user = user;
                      return next ();
                  });
                  
              } else {
                jwt.verify(token, process.env.JWT_SECRET,(err, decodeToken) => {
                    console.log('decodeToken -->', decodeToken);
                    if (!err && decodeToken) {
                        Maker.findOne({
                            where: {
                                id: decodeToken.id,
                            },
                        })
              .then((maker)=> {
                console.log('maker -->', maker);
                if (!maker) throw err;
                console.log('req -->', req);
                req.maker = maker;
                return next ();
            });
            
        } else {
                  req.errors = err;
                  return res.status(500).send('Not Authorized');
              }
          });
          //.catch((err)=> next(err));
      }}}}

module.exports = validateSession;
