const express = require("express");
const router = express.Router();
const db = require("./db");

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log("Comments time: ", Date.now());
  next();
});
// define the home page route
router.get("/", async function (req, res) {
  const tournaments = await db.query("select * from tournaments");
  console.log(tournaments);
  res.json(tournaments);
});
// define the about route
router.get("/about", function (req, res) {
  res.json({ user: "tj" });
});

module.exports = router;