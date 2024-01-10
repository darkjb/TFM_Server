const tables = [
  {
    name: "tournaments",
    columns:
      "tournamentId INT AUTO_INCREMENT, title VARCHAR(80), ownerId INT, pairing SMALLINT, tiebreaker SMALLINT, started TINYINT(1), finished TINYINT(1)",
    pKey: ", PRIMARY KEY (tournamentId)",
  },
  {
    name: "comments",
    columns:
      "commentId INT AUTO_INCREMENT PRIMARY KEY, tournamentId INT, userId INT, text VARCHAR(250), likes INT, dislikes INT, publicationDate CHAR(10)",
    pKey: ", PRIMARY KEY (commentId, tournamentId)",
  },
  {
    name: "users",
    columns:
      "userId INT AUTO_INCREMENT, name VARCHAR(30), surname VARCHAR(60), mail VARCHAR(50) UNIQUE, password CHAR(60)",
    pKey: ", PRIMARY KEY (userId)",
  },
  {
    name: "participants",
    columns:
      "participantId INT AUTO_INCREMENT, tournamentId INT, name VARCHAR(30), surname VARCHAR(60), elo INT, wins SMALLINT, ties SMALLINT, loses SMALLINT",
    pKey: ", PRIMARY KEY (participantId, tournamentId)",
  },
  {
    name: "results",
    columns:
      "tournamentId INT, roundNumber INT, boardNumber INT, roundEnded TINYINT(1), player1 INT, player2 INT, result CHAR(1)",
    pKey: ", PRIMARY KEY (tournamentId, roundNumber, boardNumber)",
  },
];

const registerTables = async () => {
  for (const { name, columns, pKey } of tables) {
    try {
      console.log(`CREATE TABLE IF NOT EXISTS ${name} (${columns} ${pKey});`);
    } catch (error) {
      console.log("ajja");
    }
  }
};

module.exports = {
  registerTables,
};
