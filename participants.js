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
  const participants = await db.query("select * from participants");
  console.log(participants);
  res.json(participants);
});
// define the get/:id route
router.get("/byTournamentId/:id", async function (req, res) {
  const id = req.params.id;
  console.log("tournamentId: " + id);
  try {
    const participants = await db.query(`select * from participants where tournamentId = "${id}";`)
    res.status(200).json(participants);
  } catch (error) {
    console.log(error);
    res.status(400).send(error.sqlMessage);
  }
});
// define the get/numberOf/:id route
router.get("/numberOf/:id", async function (req, res) {
  const id = req.params.id;
  console.log("tournamentId: " + id);
  try {
    const consulta = await db.query(
      `select count(*) as consulta from participants where tournamentId = "${id}";`
    );
    res.status(200).json(consulta[0].cont);
  } catch (error) {
    console.log(error);
    res.status(400).send(error.sqlMessage);
  }
});

module.exports = router;