const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

const tournaments = require('./tournaments');

app.use('/tournaments', tournaments);

const participants = require('./participants');

app.use('/participants', participants);

const users = require('./users');

app.use('/users', users);

const comments = require('./comments');

app.use('/comments', comments);

const reserved = require('./reserved');

app.use('/reserved', reserved);
