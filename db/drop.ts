import mysql from 'mysql';
import { dbConfig, DatabaseConnector } from './';

var readline = require('readline');

var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	terminal: false
});

console.log('Are you sure you want to drop this schema? Y/N');
rl.on('line', function(line) {
	if (line.length && line[0].toUpperCase() === 'Y') {
		console.log('OK HERE GOES!!!!');
		const dbConfigWithoutDatabase = { ...dbConfig, database: null };
		const db = new DatabaseConnector(dbConfigWithoutDatabase);
		db.query('DROP SCHEMA IF EXISTS ebc_workout_dev').then(() => {
			console.log('~DROPPED~');
			process.exit();
		});
	} else {
		console.log('Database drop aborted. Whew...');
		process.exit();
	}
});
