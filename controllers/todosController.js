// imports
const express = require("express");
const router = express.Router();
const Todo = require("../models/Todo");

// INDEX
router.get("/", async (req, res) => {
  let filters;
  if (Object.keys(req.query).length > 0) {
    filters = { ...req.query };
  }
  try {
    if (!filters) {
      const foundTodos = await Todo.find({});
      res.status(200).json(foundTodo);
    } else {
      const foundTodos = await Todo.find({ ...filters });
      res.status(200).json(foundTodos);
    }
  } catch (error) {
    res.status(400).json({
      msg: error.message,
    });
  }
});

// CREATE
router.post("/new", async (req, res) => {
  try {
    const createdTodo = await Todo.create(req.body);
    res.status(200).json(createdTodo);
  } catch (error) {
    res.status(400).json({
      msg: error.message,
    });
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({ updatedTodo });
  } catch (error) {
    res.status(400).json({
      msg: error.message,
    });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const deletedTodo = await Todo.findByOneAndDelete(req.params.id);
    res.status(200).json(deletedTodo);
  } catch (error) {
    res.status(400).json({
      msg: error.message,
    });
  }
});

module.exports = router;
