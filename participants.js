const express = require("express");
const router = express.Router();
const db = require("./db");

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log("Participants time: ", Date.now());
  next();
});
// define the home page route
router.get("/", async function (req, res) {
  console.log("/");
  const participants = await db.query("select * from participants");
  console.log(participants);
  res.json(participants);
});
// define the get/:id route
router.get("/byTournamentId/:id", async function (req, res) {
  const id = req.params.id;
  console.log("/byTournamentId/" + id);
  try {
    const participants = await db.query(
      `select * from participants where tournamentId = ("${id}");`
    );
    res.status(200).json(participants);
  } catch (error) {
    console.log(error);
    res.status(400).send(error.sqlMessage);
  }
});
// define the get/:id/:id route
router.get("/byId/:id1/:id2", async function (req, res) {
  const id1 = req.params.id1;
  const id2 = req.params.id2;
  console.log("/byId/" + id1 + "/" + id2);
  try {
    const participants = await db.query(
      `select * from participants where tournamentId = ("${id1}") and participantId = ("${id2}");`
    );
    res.status(200).json(participants);
  } catch (error) {
    console.log(error);
    res.status(400).send(error.sqlMessage);
  }
});
// define the get/numberOf/:id route
router.get("/numberOf/:id", async function (req, res) {
  const id = req.params.id;
  console.log("/numberOf/" + id);
  try {
    const consulta = await db.query(
      `select count(*) as consulta from participants where tournamentId = ("${id}");`
    );
    console.log(consulta[0]);
    res.status(200).json(consulta[0].consulta);
  } catch (error) {
    console.log(error);
    res.status(400).send(error.sqlMessage);
  }
});

module.exports = router;
