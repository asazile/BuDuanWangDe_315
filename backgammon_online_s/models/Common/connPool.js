const mysql = require('mysql');

module.exports = (function () {
	const pool = mysql.createPool({
		host: 'localhost',
		user: 'root',
		password: '7135465',
		database: 'buduanwangde315',
		port: '3306'
	});
	 
	pool.on('connection', function (connection) {
		connection.query('SET SESSION auto_increment_increment=1');
	});
	
	return function () {
		return pool;
	};
})();
