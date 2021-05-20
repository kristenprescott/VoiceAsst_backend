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
// const PORT = process.env.PORT || 8080;
const PORT = process.env.PORT;
if (PORT == null || PORT == "") {
  PORT = 8080;
}
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
  useFindAndModify: true,
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
  res.send(`<p>Hello, users <strong>B^)</strong> your todos are here.</p>`);
});
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
// *~*~*~ Prettier Error Handling For Server Crashes *~*~*~
////////////////////////////////////////////////////////////
// const server = app.listen(PORT, () => {
//   console.log("┌──────────────────────────────────┐");
//   console.log("│   Listening...                   │");
//   console.log(`│     ... on the port ${PORT}         │`);
//   console.log("│                             ʕ•ᴥ•ʔ│");
//   console.log("└──────────────────────────────────┘");
//   console.log("꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷");
// });

// process.on("unhandledRejection", (err, promise) => {
//   console.log(`Logged error: ${err}`);
//   server.close(() => {
//     process.exit(1);
//   });
// });
app.listen(PORT);
