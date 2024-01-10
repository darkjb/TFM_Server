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
  console.log("/");
  const comments = await db.query("select * from comments");
  console.log(comments);
  res.json(comments);
});
//define the get/byTournamentId/:id route
router.get("/byTournamentId/:id", async function (req, res) {
  const id = req.params.id;
  console.log("/byTournamentId/" + id);
  try {
    const comments = await db.query(
      `select * from comments where tournamentId = ("${id}");`
    );
    res.status(200).json(comments);
  } catch (error) {
    console.log(error);
    res.status(400).send(error.sqlMessage);
  }
});
//define the get/byCommentId/:id route
router.get("/byCommentId/:id", async function (req, res) {
  const id = req.params.id;
  console.log("/byCommentId/" + id);
  try {
    const comments = await db.query(
      `select * from comments where commentId = ("${id}");`
    );
    res.status(200).json(comments);
  } catch (error) {
    console.log(error);
    res.status(400).send(error.sqlMessage);
  }
});
// define the about route
router.get("/about", function (req, res) {
  res.json({ user: "tj" });
});

module.exports = router;
