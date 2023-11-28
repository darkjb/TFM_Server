const express = require("express");
const router = express.Router();
const db = require("./db");
const validateUser = require("./validate-user");
const jwt = require("jsonwebtoken");

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log("Users time: ", Date.now());
  next();
});
// define the home page route
router.get("/", async function (req, res) {
  const users = await db.query("select * from users");
  console.log(users);
  res.json(users);
});
// define the get name/:id page route
router.get("/name/:id", async function (req, res) {
  const id = req.params.id;
  try {
    const users = await db.query(`select userId, name, surname, ' ' as mail, ' ' as password from users where userId = ${id};`);
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(400).send(error.sqlMessage);
  }
});
// define de post route
router.post("/", async function (req, res) {
  const { body } = req;
  const error = validateUser(body);
  if (!error) {
    const { name, surname, mail, password } = body;
    try {
      const { insertId: newId } = await db.query(
        `insert into users (name, surname, mail, password) values ("${name}", "${surname}", "${mail}", "${password}");`
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
// define de post auth
router.post("/auth", async function (req, res) {
  const { body } = req;
  const { email, password } = body;
  console.log("hola");
  try {
    const respuesta = await db.query(
      `select userId from users where mail = "${email}" and password = "${password}";`
    );
    jwt.sign("" + respuesta[0].userId, "secret_key", (err, token) => {
      if (err) {
        res.status(400).send("Invalid credentials");
      } else {
        console.log(token);
        res
          .status(200)
          .send({ user_id: respuesta[0].userId, access_token: token });
      }
    });
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
