require("dotenv").config();
const SECRET = process.env.SECRET_KEY;
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

module.exports.hash = (password) => {
  return crypto
    .createHmac("sha256", SECRET)
    .update(password)
    .digest("hex")
    .split("")
    .reverse()
    .join("");
};

module.exports.jsonAuth = (req, res, next) => {
  const token = req.body.token;

  jwt.verify(token, SECRET, (err, user) => {
    if (err) {
      res.sendStatus(403);
    } else {
      if (user.username === req.body.username) {
        res.locals.user = user.username;
        next();
      } else {
        res.sendStatus(401);
      }
    }
  });
};

// now we're going to check in the header itself:
module.exports.auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, SECRET, (err, user) => {
      if (err) {
        res.sendStatus(403);
      } else {
        if (user.username === req.body.username) {
          next();
        } else if (req.method === "GET" || req.method === "DELETE") {
          res.locals.user = user.username;
          next();
        } else {
          res.sendStatus(401);
        }
      }
    });
  } else {
    res.sendStatus(401);
  }
};
