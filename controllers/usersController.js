// imports:
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Todo = require("../models/Todo");
const { jsonAuth, auth } = require("./authController");
/*
|-------------------------------------------------------------------------------------
| Users Routes
|-------------------------------------------------------------------------------------
| [Method] | [Route]                  | [Function]
| GET      | /users                   | Fetch all users (and their todos)
| POST     | /users/addTodoToUser     | Add new todo & assign to user if logged in
| POST     | /users/addTodo/:username | Add new todo & addign to a user by username
| GET      | /users/:username         | Fetch a user and their todos
| DELETE   | /users/:id               | Delete a user
*/

// METHOD  : GET
// ROUTE   : /
// FUNCTION: Get all users & their todos
router.get("/", auth, (req, res) => {
  console.log(res.locals);
  const userQuery = User.find({}).select("-password").populate("todos");

  userQuery.exec((err, foundUsers) => {
    if (err) {
      console.log(err);
      res.status(401).json({
        msg: err.message,
      });
    } else {
      res.status(200).json(foundUsers);
    }
  });
});

// METHOD  : POST
// ROUTE   : /addTodoToUser
// FUNCTION: add new todo & assign to a user (if logged in)
router.post("/addTodo", jsonAuth, (req, res) => {
  console.log(res.locals);

  const todo = req.body;

  const addTodoQuery = User.findOneAndUpdate(
    { username: res.locals.user },
    { $addToSet: { todos: todo._id } },
    { new: true }
  );
  addTodoQuery.exec((err, updatedUser) => {
    if (err) {
      res.status(400).json({
        msg: `Updated ${res.locals.user} with ${todo.task}`,
      });
    }
  });
});

// METHOD  : POST
// ROUTE   : /addTodo/:username
// FUNCTION: add new todo & assign to a user
// <<<---- w/out jsonAuth ---->>>
router.post("/addTodo/:username", (req, res) => {
  const todo = req.body;
  const addTodoQuery = User.findOneAndUpdate(
    { username: req.params.username },
    { $addToSet: { todos: todo._id } },
    { new: true }
  );
  addTodoQuery.exec((err, updatedUser) => {
    if (err) {
      res.status(400).json({
        msg: err.message,
      });
    } else {
      res.status(200).json({
        msg: "Update User with " + todo.task,
      });
    }
  });
});

// METHOD  : GET
// ROUTE   : /:username
// FUNCTION: fetch all todos for a specific user
router.get("/:username", auth, (req, res) => {
  const userQuery = User.findOne({
    username: req.params.username.toLowerCase(),
  })
    .select("-password")
    .populate("todos");

  userQuery.exec((err, foundUser) => {
    if (err) {
      res.status(400).json({ msg: err.messge });
    } else {
      res.status(200).json(foundUser);
    }
  });
});

// METHOD  : DELETE
// ROUTE   : /:id
// FUNCTION: delete a user
router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    res.status(200).json(deletedUser);
  } catch (error) {
    res.status(400).json({
      msg: error.message,
    });
  }
});

module.exports = router;

/////////////////////////////////////////////////////////////////////
// // METHOD  : POST
// // ROUTE   : /addTodo/:todoId/:username
// // FUNCTION: assign a todo to a user

// router.post("/addFruit/:fruit/:username", (req, res) => {
//   const fruitQuery = Fruit.findOne({ name: req.params.fruit });
//   fruitQuery.exec((err, fruit) => {
//     if (err) {
//       res.status(400).json({
//         msg: err.message,
//       });
//     } else {
//       const addFruitQuery = User.findOneAndUpdate(
//         { username: req.params.username },
//         { $addToSet: { fruits: fruit._id } },
//         { new: true }
//       );
//       addFruitQuery.exec((err, updatedUser) => {
//         if (err) {
//           res.status(400).json({
//             msg: err.message,
//           });
//         } else {
//           console.log(updatedUser);
//           res.status(200).json({
//             msg: `Updated ${updatedUser.username} with the fruit ${fruit.name} `,
//           });
//         }
//       });
//     }
//   });
// });
