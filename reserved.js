const express = require("express");
const router = express.Router();
const db = require("./db");
const jwt = require("jsonwebtoken");
const validateTournament = require("./validate-tournament");
const validateTournamentUpdate = require("./validate-tournament-update");
const validateParticipant = require("./validate-participant");
const validateResult = require("./validate-result");
const validateComment = require("./validate-comment");

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log("Reserved time: ", Date.now());
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
  console.log("post tournament");
  const { body } = req;
  const valError = validateTournament(body);
  if (!valError) {
    const { title, ownerId, pairing, tiebreaker } = body;
    try {
      const { insertId: newId } = await db.query(
        `insert into tournaments (title, ownerId, pairing, tiebreaker, started, finished) values ("${title}", ${ownerId}, ${pairing}, ${tiebreaker}, false, false);`
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
  console.log("post participant");
  const { body } = req;
  const valError = validateParticipant(body);
  if (!valError) {
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
// define the put participant
router.put("/participant", async function (req, res) {
  console.log("put participant");
  const { body } = req;
  const { tournamentId, participantId, wins, ties, loses, white, black } = body;
  try {
    const update = await db.query(
      `update participants set wins = (${wins}), ties = (${ties}), loses = (${loses}) where tournamentId = (${tournamentId}) and participantId = (${participantId});`
    );
    res.status(200).json({ update });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.sqlMessage);
  }
});
// define the post result
router.post("/result", async function (req, res) {
  console.log("post result");
  const { body } = req;
  const valError = validateResult(body);
  if (!valError) {
    const {
      tournamentId,
      roundNumber,
      boardNumber,
      roundEnded,
      player1,
      player2,
      result,
    } = body;
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
// define the post comment
router.post("/comment", async function (req, res) {
  console.log("post comment");
  const { body } = req;
  const valError = validateComment(body);
  if (!valError) {
    const { tournamentId, userId, text, likes, dislikes } = body;
    try {
      const insert = await db.query(
        `insert into comments (tournamentId, userId, text, likes, dislikes, publicationDate) values (${tournamentId}, ${userId}, "${text}", ${likes}, ${dislikes}, DATE_FORMAT(NOW(), '%d/%m/%Y'));`
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
// define the put comment
router.put("/comment", async function (req, res) {
  console.log("put comment");
  const { body } = req;
  const { commentId, likes, dislikes } = body;
  try {
    const update = await db.query(
      `update comments set likes = (${likes}), dislikes = (${dislikes}) where commentId = (${commentId});`
    );
    res.status(200).json({ update });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.sqlMessage);
  }
});
// define the delete comment
router.delete("/comment/:id", async function (req, res) {
  const id = req.params.id;
  console.log("delete comment " + id);
  try {
    const deleted = await db.query(
      `delete from comments where commentId = (${id});`
    );
    const affected = deleted.affectedRows;
    res.status(200).json({ affected });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.sqlMessage);
  }
});
// define the put result
router.put("/result", async function (req, res) {
  console.log("put result");
  const { body } = req;
  const valError = validateResult(body);
  if (!valError) {
    const { tournamentId, roundNumber, boardNumber, result } = body;
    try {
      const update = await db.query(
        `update results set result = ("${result}") where tournamentId = (${tournamentId}) and roundNumber = (${roundNumber}) and boardNumber = (${boardNumber});`
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
// define the patch setRoundEnded
router.patch("/setRoundEnded", async function (req, res) {
  console.log("patch setRoundEnded");
  const { body } = req;
  const { tournamentId, roundNumber } = body;
  try {
    const patch = await db.query(
      `update results set roundEnded = 1 where tournamentId = (${tournamentId}) and roundNumber = (${roundNumber});`
    );
    res.status(200).json({ patch });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.sqlMessage);
  }
});
// define the patch setTournamentFinished
router.patch("/setTournamentFinished", async function (req, res) {
  console.log("patch setTournamentFinished");
  const { body } = req;
  const { tournamentId } = body;
  try {
    const patch = await db.query(
      `update tournaments set finished = 1 where tournamentId = (${tournamentId});`
    );
    res.status(200).json({ patch });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.sqlMessage);
  }
});

// define the put tournament
router.put("/tournament", async function (req, res) {
  console.log("put tournament");
  const { body } = req;
  const valError = validateTournamentUpdate(body);
  if (!valError) {
    console.log(body);
    const {
      tournamentId,
      title,
      ownerId,
      pairing,
      tiebreaker,
      started,
      finished,
    } = body;
    try {
      const update = await db.query(
        `update tournaments set title = "${title}", ownerId = ${ownerId}, pairing = ${pairing}, tiebreaker = ${tiebreaker}, started = ${started}, finished = ${finished} where tournamentId = (${tournamentId});`
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

module.exports = router;
