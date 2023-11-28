const mysql = require('mysql2/promise')

let connection = null;
async function query(sql){
    if(!connection) {
        connection = await mysql.createConnection({
           host: "localhost",
           user: "root",
           password: "p4S5w0R#",
           database: "Chessdb",
         });
    }
    const [results,] = await connection.execute(sql);
    return results;
}

module.exports = {
    query
}