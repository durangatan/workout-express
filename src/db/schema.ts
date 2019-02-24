import { DatabaseConnection, dbConfig } from './';
import { ConnectionConfig } from 'mysql';

const createTableStatements = {
  exercises: `CREATE TABLE IF NOT EXISTS exercises (
		id INT unsigned NOT NULL AUTO_INCREMENT,
		dateAdded BIGINT unsigned NOT NULL,
		dateUpdated BIGINT,
		machineId VARCHAR(255),
		name VARCHAR(255) UNIQUE,
		seatSetting VARCHAR(255),
		rangeSetting VARCHAR(255),
		notes VARCHAR(255),
		primary key (id)
	);`,
  routines: `CREATE TABLE IF NOT EXISTS routines (
		id INT unsigned NOT NULL AUTO_INCREMENT,
		dateAdded BIGINT unsigned NOT NULL,
		dateUpdated BIGINT,
		name VARCHAR(255) UNIQUE,
		primary key (id)
	);`,
  workouts: `CREATE TABLE IF NOT EXISTS workouts (
		id INT unsigned NOT NULL AUTO_INCREMENT,
		startTime BIGINT unsigned,
		endTime BIGINT unsigned,
		dateAdded BIGINT unsigned NOT NULL,
		dateUpdated BIGINT,
		primary key (id)
	);`,
  workoutRoutines: `CREATE TABLE IF NOT EXISTS workout_routines (
		id INT NOT NULL AUTO_INCREMENT,
		dateAdded BIGINT unsigned NOT NULL,
		dateUpdated BIGINT,
		workoutId INT unsigned NOT NULL,
		routineId INT unsigned NOT NULL,
		CONSTRAINT workout_routine_unique UNIQUE (workoutId, routineId),
		primary key (id)
	);`,
  exerciseSets: `CREATE TABLE IF NOT EXISTS exercise_sets (
		id INT unsigned NOT NULL AUTO_INCREMENT,
		dateAdded BIGINT unsigned NOT NULL,
		dateUpdated BIGINT,
		weight INT unsigned NOT NULL,
		repetitions INT unsigned NOT NULL,
		notes VARCHAR(255),
		type VARCHAR(255) NOT NULL DEFAULT "Default",
		exerciseId INT unsigned NOT NULL,
		primary key (id)
	);`,
  routineSets: `CREATE TABLE IF NOT EXISTS routine_sets (
		id INT unsigned NOT NULL AUTO_INCREMENT,
		dateAdded BIGINT unsigned NOT NULL,
		dateUpdated BIGINT,
		routineId INT unsigned NOT NULL,
		exerciseSetId INT unsigned NOT NULL,
		ordering INT unsigned NOT NULL,
		primary key (id)
	);`,
  completedSets: `CREATE TABLE IF NOT EXISTS completed_sets (
		id INT unsigned NOT NULL AUTO_INCREMENT,
		dateAdded BIGINT unsigned NOT NULL,
		dateUpdated BIGINT,
		workoutId INT unsigned NOT NULL,
		exerciseSetId INT unsigned NOT NULL,
		primary key (id)
	);`
};

const dbConfigWithoutDatabase: ConnectionConfig = { ...dbConfig, database: null };

const db = new DatabaseConnection(dbConfigWithoutDatabase);

db.query(`CREATE DATABASE IF NOT EXISTS WORKOUT;`)
  .then(() => db.query(`USE WORKOUT;`))
  .then(() =>
    Promise.all(Object.values(createTableStatements).map(createTableStatement => db.query(createTableStatement)))
  )
  .then(() => db.close())
  .then(() => process.exit());
