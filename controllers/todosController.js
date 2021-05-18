// imports
const express = require("express");
const router = express.Router();
const Todo = require("../models/Todo");
/*
|----------------------------------------------------------
| Todos Route
|----------------------------------------------------------
| [Method]  [Route]
| GET       /todos          
| POST      /todos/new
| GET       /todos/:id
| POST      /todos:id   
| PATCH     /todos:id                           
| PUT       /todos:id          
| DELETE    /todos:id          
| 
*/

// METHOD  : GET
// ROUTE   : /todos
// FUNCTION: Get all todos
// INDEX
router.get("/", async (req, res) => {
  try {
    //Find and sort todos by creation date
    const todos = await Todo.find().sort([["createdAt", -1]]);

    res.send(todos);
  } catch (error) {
    res.status(400).json({
      msg: error.message,
    });
  }
});

// METHOD  : POST
// ROUTE   : /new
// FUNCTION: Add a new todo
// CREATE
router.post("/new", async (req, res) => {
  try {
    const todo = await Todo.create({
      task: req.body.task,
      createdAt: Date.now(),
    });

    await todo.save();
    res.send(todo);
  } catch (error) {
    res.status(400).json({
      msg: error.message,
    });
  }
});

// METHOD  : GET
// ROUTE   : /:id
// FUNCTION: Fetch a todo
// INDEX Specific todo
router.get("/:id", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    res.send(todo);
  } catch (error) {
    res.status(400).json({
      msg: error.message,
    });
  }
});

// METHOD  : POST
// ROUTE   : /todos:id
// FUNCTION: Toggle todo to be done or not
//
router.post("/:id", async (req, res) => {
  try {
    const todoRef = await Todo.findById(req.params.id);
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id },
      { done: !todoRef.done }
    );

    await todo.save();
    res.send(todo);
  } catch (error) {
    res.status(400).json({
      msg: error.message,
    });
  }
});

// METHOD  : PATCH
// ROUTE   : /todos:id
// FUNCTION: Modify the todo
router.patch("/:id", async (req, res) => {
  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id },
      { task: req.body.task }
    );
    await todo.save();

    res.send(todo);
  } catch (error) {
    res.status(400).json({
      msg: error.message,
    });
  }
});

// METHOD  : PUT
// ROUTE   : /todos:id
// FUNCTION: Update the todo
router.put("/:id", async (req, res) => {
  try {
    const todo = await Todo.findByIdAndUpdate(
      { _id: req.params.id },
      { task: req.body.task },
      { new: true }
    );
    await todo.save();

    res.send(todo);
  } catch (error) {
    res.status(400).json({
      msg: error.message,
    });
  }
});

// METHOD  : DELETE
// ROUTE   : /todos:id
// FUNCTION: Delete the todo
router.delete("/:id", async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);

    res.send(todo);
  } catch (error) {
    res.status(400).json({
      msg: error.message,
    });
  }
});

module.exports = router;
