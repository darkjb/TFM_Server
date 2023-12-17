const express = require("express");
const router = express.Router();
const db = require("./db");

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log("Tournaments time: ", Date.now());
  next();
});
// define the home page route
router.get("/", async function (req, res) {
  console.log("/");
  const tournaments = await db.query("select * from tournaments");
  console.log(tournaments);
  res.status(200).json(tournaments);
});
//define the get/byTournamentId/:id route
router.get("/byTournamentId/:id", async function (req, res) {
  const id = req.params.id;
  console.log("/byTournamentId/" + id);
  try {
    const tournament = await db.query(
      `select * from tournaments where tournamentId = "${id}";`
    );
    res.status(200).json(tournament);
  } catch (error) {
    console.log(error);
    res.status(400).send(error.sqlMessage);
  }
});
//define the get/results/:id route
router.get("/results/:id", async function (req, res) {
  const id = req.params.id;
  console.log("/results/" + id);
  try {
    const results = await db.query(
      `select tournamentId, roundNumber, 0 as boardNumber, roundEnded, '' as player1, '' as player2, '0' as result from results where tournamentId = "${id}" group by tournamentId, roundNumber, roundEnded order by roundNumber;`
    );
    res.status(200).json(results);
  } catch (error) {
    console.log(error);
    res.status(400).send(error.sqlMessage);
  }
});
//define the get/result/:id1/:id2/:id3 route
router.get("/result/:id1/:id2/:id3", async function (req, res) {
  const id1 = req.params.id1;
  const id2 = req.params.id2;
  const id3 = req.params.id3;
  console.log("/result/" + id1 + "/" + id2 + "/" + id3);
  try {
    const results = await db.query(
      `select * from results where tournamentId = ${id1} and roundNumber = ${id2} and boardNumber = ${id3};`
    );
    res.status(200).json(results);
  } catch (error) {
    console.log(error);
    res.status(400).send(error.sqlMessage);
  }
});
//define the get/lastResults/:id route
router.get("/lastResults/:id", async function (req, res) {
  const id = req.params.id;
  console.log("/lastResults/" + id);
  try {
    const results = await db.query(
      `select * from chessdb.results where roundNumber = (select max(roundNumber) from chessdb.results where tournamentId = "${id}") and tournamentId = "${id}" order by boardNumber;`
    );
    res.status(200).json(results);
  } catch (error) {
    console.log(error);
    res.status(400).send(error.sqlMessage);
  }
});
//definde the get/checkRoundEnd/:id1/:id2 route
router.get("/checkRoundEnd/:id1/:id2", async function (req, res) {
  const id1 = req.params.id1;
  const id2 = req.params.id2;
  console.log("/checkRoundEnd/" + id1 + "/" + id2);
  try {
    const num = await db.query(
      `select count(*) as num from chessdb.results where tournamentId = "${id1}" and roundNumber = "${id2}" and result = '';`
    );
    console.log('num: ' + num[0].num);
    res.status(200).json(num[0].num);
  } catch (error) {
    console.log(error);
    res.status(400).send(error.sqlMessage);
  }
});
//define the get/games/:id1/:id2 route
router.get("/games/:id1/:id2", async function (req, res) {
  const id1 = req.params.id1;
  const id2 = req.params.id2;
  console.log("/games/" + id1 + "/" + id2);
  try {
    const games = await db.query(
      `
      select res.boardNumber, concat(par1.name, ' ' , par1.surname) as player1, 1 as result1, concat(par2.name, ' ' , par2.surname) as player2, 0 as result2
        from chessdb.results res left join chessdb.participants par1 on res.player1 = par1.participantId and res.tournamentId = par1.tournamentId
                                 left join chessdb.participants par2 on res.player2 = par2.participantId and res.tournamentId = par2.tournamentId
       where res.tournamentId = "${id1}" and res.roundNumber = "${id2}" and res.result = 'W'
       union
      select res.boardNumber, concat(par1.name, ' ' , par1.surname) as player1, 0 as result1, concat(par2.name, ' ' , par2.surname) as player2, 1 as result2
        from chessdb.results res left join chessdb.participants par1 on res.player1 = par1.participantId and res.tournamentId = par1.tournamentId
                                 left join chessdb.participants par2 on res.player2 = par2.participantId and res.tournamentId = par2.tournamentId
       where res.tournamentId = "${id1}" and res.roundNumber = "${id2}" and res.result = 'B'
       union
      select res.boardNumber, concat(par1.name, ' ' , par1.surname) as player1, 0.5 as result1, concat(par2.name, ' ' , par2.surname) as player2, 0.5 as result2
        from chessdb.results res left join chessdb.participants par1 on res.player1 = par1.participantId and res.tournamentId = par1.tournamentId
                                 left join chessdb.participants par2 on res.player2 = par2.participantId and res.tournamentId = par2.tournamentId
       where res.tournamentId = "${id1}" and res.roundNumber = "${id2}" and res.result = 'X'
       union
      select res.boardNumber, concat(par1.name, ' ', par1.surname) as player1, 0 as result1, concat(par2.name, ' ' , par2.surname) as player2, 0 as result2
        from chessdb.results res left join chessdb.participants par1 on res.player1 = par1.participantId and res.tournamentId = par1.tournamentId
                                 left join chessdb.participants par2 on res.player2 = par2.participantId and res.tournamentId = par2.tournamentId
       where res.tournamentId = "${id1}" and res.roundNumber = "${id2}" and res.result = '';
      `
    );
    console.log(games);
    res.status(200).json(games);
  } catch (error) {
    console.log(error);
    res.status(400).send(error.sqlMessage);
  }
});
//define the get/pairing/next/:id route
router.get("/pairing/next/:id", async function (req, res) {
  const id = req.params.id;
  console.log("/pairing/next/" + id);
  try {
    const pairing = await db.query(
      `select * from chessdb.results where tournamentId = "${id}" and roundNumber in (select max(roundNumber) from chessdb.results where tournamentId = "${id}") order by boardNumber;`
    );
    res.status(200).json(pairing);
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
