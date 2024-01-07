var mysql = require('mysql2');

let databaseName = "Chessdb";
let tables = ["tournaments","comments","users"];
let columns = [
  "tournamentId INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(80), ownerId INT, arbiterId INT, moderatorId INT, pairing TINYINT, tiebreaker TINYINT, started BOOLEAN, finished BOOLEAN",
  "commentId INT AUTO_INCREMENT PRIMARY KEY, tournamentId INT, userId INT, text VARCHAR(250), likes INT, dislikes INT, publicationDate CHAR(10)",
  "userId INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(30), surname VARCHAR(60), mail VARCHAR(50) UNIQUE, password CHAR(40)"
];

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "p4S5w0R#",
  database: databaseName
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");

  //con.query(`CREATE DATABASE ${databaseName}`, function (err, result) {
  /*for(i=0; i<3; i++) {
    con.query(`CREATE TABLE ${tables[i]} (${columns[i]})`, function (err, result) {
      if (err) throw err;
      console.log(`Database ${tables[i]} created!`);
    });
  }*/

  
});