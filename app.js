const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const tournaments = require("./tournaments");

app.use("/api/tournaments", tournaments);

const participants = require("./participants");

app.use("/api/participants", participants);

const users = require("./users");

app.use("/api/users", users);

const comments = require("./comments");

app.use("/api/comments", comments);

const reserved = require("./reserved");

app.use("/api/reserved", reserved);
