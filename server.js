////////////////////////////////////////////////////////////
// *~* -------------------- Imports -------------------- *~*
////////////////////////////////////////////////////////////
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { hash, jsonAuth, auth } = require("./controllers/authController");
const User = require("./models/User");
// const dbConfig = require("./config/db.config");
////////////////////////////////////////////////////////////
// *~* ------------------- Variables ------------------- *~*
////////////////////////////////////////////////////////////
const app = express();
const PORT = process.env.PORT || 8080;
const SECRET = process.env.SECRET_KEY;
////////////////////////////////////////////////////////////
// *~* ------------------- Middleware ------------------ *~*
////////////////////////////////////////////////////////////
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.body);
  next();
});
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
mongoose.connection.once("connected", () =>
  console.log("Connected to Mongo - life is good B^)")
);

app.use("/users", require("./controllers/usersController"));
app.use("/todos", require("./controllers/todosController"));
// app.use("/roles", require("./controllers/rolesController"));
////////////////////////////////////////////////////////////
// *~* --------------------- Routes -------------------- *~*
////////////////////////////////////////////////////////////
app.get("/", (req, res) => {
  // res.send(`<p>Hello, users <strong>B^)</strong> your todos are here.</p>`);
  res.send(`
  <center>
    <div>╭──────────────────────────────────╮</div>
    <div>│꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦│</div>
    <div>│꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦ PORT ꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦ │</div>
    <div>│ ꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷${PORT}꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦│</div>
    <div>│꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦ʕ•ᴥ•ʔ꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦│</div>
    <div>│꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦│</div>
    <div>╰──────────────────────────────────╯</div>
  </center>
  `);
});
// app.get("/*", (req, res) => {
//   let url = path.join(__dirname, "../client/build", "index.html");
//   if (!url.startsWith("/app/"))
//     // we're on local windows
//     url = url.substring(1);
//   res.sendFile(url);
// });
///////////////////////// Register //////////////////////////
app.post("/register", (req, res) => {
  const passwordHash = hash(req.body.password);
  req.body.password = bcrypt.hashSync(passwordHash, bcrypt.genSaltSync(10));
  // console.log(req.body);

  User.create(req.body, (err, createdUser) => {
    if (err) {
      console.log(err);
      res.status(400).json({
        msg: err.message,
      });
    } else {
      const token = jwt.sign(
        {
          id: createdUser._id,
          username: createdUser.username,
        },
        SECRET
      );
      res.status(200).json({
        token,
      });
    }
  });
});
////////////////////////// Login ///////////////////////////
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = hash(password);

  User.findOne({ username: username }, (err, foundUser) => {
    if (err) {
      res.status(400).json({
        msg: err.message,
      });
    } else {
      if (foundUser && bcrypt.compareSync(hashedPassword, foundUser.password)) {
        const token = jwt.sign(
          {
            id: foundUser._id,
            username: foundUser.username,
          },
          SECRET
        );
        res.status(200).json({ token, username: foundUser.username });
      } else {
        res.send(500).json({
          problem:
            "The comparison did not work, did you change your hash algo?",
        });
      }
    }
  });
});
////////////////////////////////////////////////////////////
// SPOTIFY
/**
 * This is an example of a basic node.js script that performs
 * the Client Credentials oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#client_credentials_flow
 */
/*
var request = require("request"); // "Request" library

var client_id = "CLIENT_ID"; // Your client id
var client_secret = "CLIENT_SECRET"; // Your secret

// your application requests authorization
var authOptions = {
  url: "https://accounts.spotify.com/api/token",
  headers: {
    Authorization:
      "Basic " + new Buffer(client_id + ":" + client_secret).toString("base64"),
  },
  form: {
    grant_type: "client_credentials",
  },
  json: true,
};

request.post(authOptions, function (error, response, body) {
  if (!error && response.statusCode === 200) {
    // use the access token to access the Spotify Web API
    var token = body.access_token;
    var options = {
      url: "https://api.spotify.com/v1/users/jmperezperez",
      headers: {
        Authorization: "Bearer " + token,
      },
      json: true,
    };
    request.get(options, function (error, response, body) {
      console.log(body);
    });
  }
});
app.get("/login", function (req, res) {
  var scopes = "user-read-private user-read-email";
  res.redirect(
    "https://accounts.spotify.com/authorize" +
      "?response_type=code" +
      "&client_id=" +
      my_client_id +
      (scopes ? "&scope=" + encodeURIComponent(scopes) : "") +
      "&redirect_uri=" +
      encodeURIComponent(redirect_uri)
  );
});
*/
////////////////////////////////////////////////////////////
// *~*~*~ Prettier Error Handling For Server Crashes *~*~*~
////////////////////////////////////////////////////////////
const server = app.listen(PORT, () => {
  console.log("╭────────────────────────────────────╮");
  console.log("│               *ʕ•ᴥ•ʔ*              │");
  console.log("│------------------------------------│");
  console.log("│           ╭------------╮           │");
  console.log("│           |    PORT    |           │");
  console.log("│           |------------|           │");
  console.log(`│           |    ${PORT}    |           │`);
  console.log("│           ╰------------╯           │");
  console.log("╰────────────────────────────────────╯");
});

// process.on("unhandledRejection", (err, promise) => {
//   console.log(`Logged error: ${err}`);
//   server.close(() => {
//     process.exit(1);
//   });
// });
// app.listen(PORT, () => {
//   console.warn(`App listening on http://localhost:${PORT}`);
// });
