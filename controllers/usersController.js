// imports:
const express = require("express");
const router = express.Router();
const User = require("../models/User");
// const Fruit = require("../models/Fruit");
// const Veggie = require("../models/Veggie");
const { jsonAuth, auth } = require("./authController");

// routes:
router.get("/", auth, (req, res) => {
  console.log(res.locals);
  const userQuery = User.find({}).select("-password");
  // .populate("fruits veggies");

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

// // add existing f/v to user:
// // EDITING FOR AUTH:
// router.post("/addFruitToUser", jsonAuth, (req, res) => {
//   console.log(res.locals);
//   const fruit = req.body;
//   const addFruitQuery = User.findOneAndUpdate(
//     { username: res.locals.user },
//     { $addToSet: { fruits: fruit._id } },
//     { new: true }
//   );
//   addFruitQuery.exec((err, updatedUser) => {
//     if (err) {
//       res.status(400).json({
//         msg: err.message,
//       });
//     } else {
//       res.status(200).json({
//         msg: `Updated ${res.locals.user} with ${fruit.name}`,
//       });
//     }
//   });
// });

// router.post("/addVeggieToUser/:username", (req, res) => {
//   const veggie = req.body;
//   const addVeggieQuery = User.findOneAndUpdate(
//     { username: req.params.username },
//     { $addToSet: { veggies: veggie._id } },
//     { new: true }
//   );
//   addVeggieQuery.exec((err, updatedUser) => {
//     if (err) {
//       res.status(400).json({
//         msg: err.message,
//       });
//     } else {
//       res.status(200).json({
//         msg: "Update User with " + veggie.name,
//       });
//     }
//   });
// });

// //
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

// //
// router.post("/addVeggie/:fruit/:username", (req, res) => {
//   const veggieQuery = Veggie.findOne({ name: req.params.veggie });
//   veggieQuery.exec((err, veggie) => {
//     if (err) {
//       res.status(400).json({
//         msg: err.message,
//       });
//     } else {
//       const addVeggieQuery = User.findOneAndUpdate(
//         { username: req.params.username },
//         { $addToSet: { veggies: veggie._id } },
//         { new: true }
//       );
//       addVeggieQuery.exec((err, updatedUser) => {
//         if (err) {
//           res.status(400).json({
//             msg: err.message,
//           });
//         } else {
//           console.log(updatedUser);
//           res.status(200).json({
//             msg: `Updated ${updatedUser.username} with the veggie ${veggie.name} `,
//           });
//         }
//       });
//     }
//   });
// });

// // shows all f/v for a specific user
// router.get("/:username", auth, (req, res) => {
//   const userQuery = User.findOne({
//     username: req.params.username.toLowerCase(),
//   })
//     .select("-password")
//     .populate("fruits veggies");

//   userQuery.exec((err, foundUser) => {
//     if (err) {
//       res.status(400).json({ msg: err.messge });
//     } else {
//       res.status(200).json(foundUser);
//     }
//   });
// });

module.exports = router;
