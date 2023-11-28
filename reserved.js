const express = require("express");
const router = express.Router();
const db = require("./db");
const jwt = require("jsonwebtoken");
const validateTournament = require("./validate-tournament");
const validateTournamentUpdate = require("./validate-tournament-update");
const validateParticipant = require("./validate-participant");
const validateResult = require("./validate-result");

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log("Tournaments time: ", Date.now());
  next();
});
router.use(function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(403);
  jwt.verify(token, "secret_key", (err, user) => {
    if (err) return res.sendStatus(404);
    req.user = user;
    next();
  });
});
// define the post tournament
router.post("/tournament", async function (req, res) {
  const { body } = req;
  const error = validateTournament(body);
  if (!error) {
    const { title, ownerId, pairing, tiebreaker } = body;
    try {
      const { insertId: newId } = await db.query(
        `insert into tournaments (title, ownerId, arbiterId, moderatorId, pairing, tiebreaker, started, finished) values ("${title}", ${ownerId}, 0, 0, ${pairing}, ${tiebreaker}, false, false);`
      );
      res.status(200).json({ newId });
    } catch (error) {
      console.log(error);
      res.status(400).send(error.sqlMessage);
    }
  } else {
    res.status(400).send(error);
  }
});
// define the post participant
router.post("/participant", async function (req, res) {
  const { body } = req;
  const error = validateParticipant(body);
  if (!error) {
    const { tournamentId, name, surname, elo } = body;
    try {
      const consulta = await db.query(
        `select count(*) as cont from participants where tournamentId = ${tournamentId};`
      );
      const newId = consulta[0].cont + 1;
      await db.query(
        `insert into participants (tournamentId, participantId, name, surname, elo, wins, ties, loses) values (${tournamentId}, ${newId}, "${name}", "${surname}", ${elo}, 0, 0, 0);`
      );
      res.status(200).json({ newId });
    } catch (error) {
      console.log(error);
      res.status(400).send(error.sqlMessage);
    }
  } else {
    res.status(400).send(error);
  }
});
// define the post result
router.post("/result", async function (req, res) {
  const { body } = req;
  const error = validateResult(body);
  if (!error) {
    const { tournamentId, roundNumber, boardNumber, roundEnded, player1, player2, result } = body;
    try {
      const insert = await db.query(
        `insert into results (tournamentId, roundNumber, boardNumber, roundEnded, player1, player2, result) values (${tournamentId}, ${roundNumber}, ${boardNumber}, ${roundEnded}, ${player1}, ${player2}, "${result}");`
      );
      res.status(200).json({ insert });
    } catch (error) {
      console.log(error);
      res.status(400).send(error.sqlMessage);
    }
  } else {
    res.status(400).send(error);
  }
});
// define the put result
router.put("/result", async function (req, res) {
  const { body } = req;
  const error = validateResult(body);
  if (!error) {
    const { tournamentId, roundNumber, roundEnd, result } = body;
    try {
      const update = await db.query(
        `update results set result = "${result}" where tournamentId = ${tournamentId} and roundNumber = ${roundNumber} and roundEnd = ${roundEnd};`
      );
      res.status(200).json({ update });
    } catch (error) {
      console.log(error);
      res.status(400).send(error.sqlMessage);
    }
  } else {
    res.status(400).send(error);
  }
});
// define the put tournament
router.put("/tournament", async function (req, res) {
  console.log("Update tournament");
  const { body } = req;
  const error = validateTournamentUpdate(body);
  if (!error) {
    console.log(body);
    const { tournamentId, title, ownerId, arbiterId, moderatorId, pairing, tiebreaker, started, finished } = body;
    try {
      const update = await db.query(
        `update tournaments set title = "${title}", ownerId = ${ownerId}, arbiterId = ${arbiterId}, moderatorId = ${moderatorId}, pairing = ${pairing}, tiebreaker = ${tiebreaker}, started = ${started}, finished = ${finished} where tournamentId = ${tournamentId};`
      );
      res.status(200).json({ update });
    } catch (error) {
      console.log(error);
      res.status(400).send(error.sqlMessage);
    }
  } else {
    res.status(400).send(error);
  }

})

module.exports = router;
