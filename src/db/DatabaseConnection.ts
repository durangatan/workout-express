import mysql, { Connection, ConnectionConfig, MysqlError } from 'mysql';
import { DatabaseTransactionError } from '../errors';
export default class DatabaseConnection {
	connection: Connection;
	constructor(config: ConnectionConfig) {
		this.connection = mysql.createConnection(
			`mysql://bdf956db576360:3e4d08c8@us-cdbr-iron-east-03.cleardb.net/heroku_5bed8e4a188f0c8?reconnect=true`
		);
	}
	query(sql: string, args?: any): Promise<Array<any>> {
		return new Promise((resolve, reject) => {
			const query = this.connection.query(
				`${sql}${args ? this.connection.escape(args) : ''}`,
				(err, rows) => {
					if (err) return reject(err);
					console.log(
						`DatabaseConnection: executed query: ${sql}${String(
							args
						)}`
					);
					const ensureArray = rows instanceof Array ? rows : [rows];
					resolve(ensureArray);
				}
			);
			console.log(
				`DatabaseConnection: attempted query: ${query.sql}${
					query.values
				}`
			);
		});
	}
	close() {
		return new Promise((resolve, reject) => {
			this.connection.end(err => {
				if (err) return reject(err);
				resolve();
			});
		});
	}

	performTransactionally(queries: Array<Promise<any>>): Promise<Array<any>> {
		return new Promise((resolve, reject) => {
			this.connection.beginTransaction(async (error: MysqlError) => {
				if (error) {
					return reject(
						new DatabaseTransactionError(error.sqlMessage)
					);
				}
				const resolvedQueries = await queries.map(async thisQuery => {
					return await thisQuery.catch((error: MysqlError) =>
						reject(new DatabaseTransactionError(error.sqlMessage))
					);
				});
				resolve(resolvedQueries);
			});
		});
	}
}
