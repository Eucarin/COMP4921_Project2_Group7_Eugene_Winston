const mysql = require('mysql2/promise');

const dbConfig = {
	host: process.env.HOST,
    port: process.env.DB_PORT,
	user: process.env.USER,
	password: process.env.PASSWORD,
	database: process.env.DB,
	multipleStatements: false,
	namedPlaceholders: true
};


var database = mysql.createPool(dbConfig);

module.exports = database;