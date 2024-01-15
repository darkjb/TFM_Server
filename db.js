const mysql = require("mysql2/promise");

let connection = null;
async function query(sql) {
  try {
    if (!connection) {
      connection = await mysql.createConnection({
        host: "mysql",
        user: "root",
        password: "p4S5w0R#",
        database: "Chessdb",
      });
    }
    const [results] = await connection.execute(sql);
    return results;
  } catch (error) {
    console.log('error en db.query');
    console.log(error);
  }
}

module.exports = {
  query,
};
