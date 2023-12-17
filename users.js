const express = require("express");
const router = express.Router();
const db = require("./db");
const validateUser = require("./validate-user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log("Users time: ", Date.now());
  next();
});
// define the home page route
router.get("/", async function (req, res) {
  console.log("/");
  const users = await db.query("select * from users");
  console.log(users);
  res.json(users);
});
// define the get name/:id page route
router.get("/name/:id", async function (req, res) {
  const id = req.params.id;
  console.log("/name/" + id);
  try {
    const users = await db.query(
      `select userId, name, surname, ' ' as mail, ' ' as password from users where userId = ${id};`
    );
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(400).send(error.sqlMessage);
  }
});
// define de post route
router.post("/", async function (req, res) {
  console.log("post");
  const { body } = req;
  const error = validateUser(body);
  if (!error) {
    const { name, surname, mail, password } = body;
    const hash = await hashPassword(password);
    try {
      const { insertId: newId } = await db.query(
        `insert into users (name, surname, mail, password) values ("${name}", "${surname}", "${mail}", "${hash}");`
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
  console.log("auth");
  const { body } = req;
  const { email, password } = body;
  try {
    const respuesta = await db.query(
      `select userId, password from users where mail = "${email}";`
    );
    const ok = await comparePassword(password, respuesta[0].password);
    jwt.sign("" + respuesta[0].userId, "secret_key", (err, token) => {
      if (err || !ok) {
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

// Número de rondas de sal (mayor número = más seguro pero más lento)
const saltRounds = 10;

// Función para hashear la contraseña
const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    throw error;
  }
};

// Función para verificar la contraseña
const comparePassword = async (password, hashedPassword) => {
  try {
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
  } catch (error) {
    throw error;
  }
};

module.exports = router;
