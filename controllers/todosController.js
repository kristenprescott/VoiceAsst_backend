// imports
const express = require("express");
const router = express.Router();
const Todo = require("../models/Todo");
/*
|----------------------------------------------------------
| Todos Routes
|----------------------------------------------------------
| [Method] | [Route]      | [Function]
| GET      | /todos       | Get all todos
| POST     | /todos/new   | Add new todo
| GET      | /todos/:id   | Fetch a specific todo
| POST     | /todos/:id   | Toggle a todo done
| PATCH    | /todos/:id   | Modify a todo      
| PUT      | /todos/:id   | Update a todo
| DELETE   | /todos/:id   | Delete a todo      
| 
*/

// METHOD  : GET
// ROUTE   : /todos
// FUNCTION: Get all todos
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
// FUNCTION: Fetch a specific todo
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
// ROUTE   : /:id
// FUNCTION: Toggle todo to be done or not
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
// ROUTE   : /:id
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
// ROUTE   : /:id
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
// ROUTE   : /:id
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

// METHOD   : GET
// ROUTE    : /
// FUNCTION : get by created at index
router.get("/", async (req, res) => {
  try {
    //Find and sort todos by creation date
    const todos = await Todo.find().sort([["createdAt", -1]]);
    const lastTodo = todos[0];

    res.send(lastTodo);
  } catch (error) {
    res.status(400).json({
      msg: error.message,
    });
  }
});

module.exports = router;
/*////////////////////////////////////////////////////////////////////////////////////*/
// NOTE: POST/PUT/PATCH:                                                              //
// ---------------------------------------------------------------------------------- //
//  * POST : always for creating a resource (does not matter if it was duplicated)    //
//      - If the client sends data without any identifier, then we will store the     //
//      data and assign/generate a new identifier.                                    //
//      - If the client again sends the same data without any identifier, then we     //
//      will store the data and assign/generate a new identifier.                     //
//      - *NOTE* Duplication is allowed here.                                         //
//  * PUT : for checking if a resource exsists, then updating; else, create a new     //
//      resource (Update & overwrite)                                                 //
//      - If the client sends data with an identifier, then we will check whether     //
//      that identifier exists. If the identifier exists, we will update the          //
//      resource with the data, else we will create a resource with the data          //
//      and assign/generate a new identifier.                                         //
//   * PATCH : always for updating a resource                                         //
//     - If the client sends data with an identifier, then we will check whether      //
//     that identifier exists. If the identifier exists, we will update the resource  //
//     with the data, else we will throw an exception.                                //
/*////////////////////////////////////////////////////////////////////////////////////*/
