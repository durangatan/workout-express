import mysql from 'mysql';
import { DatabaseConnector, dbConfig } from './';

const createTableStatements = {
  exercises: `CREATE TABLE IF NOT EXISTS exercises (
		id INT unsigned NOT NULL AUTO_INCREMENT,
		machineId VARCHAR(255),
		name VARCHAR(255) UNIQUE,
		seatSetting VARCHAR(255),
		rangeSetting VARCHAR(255),
		notes VARCHAR(255),
		primary key (id)
	);`,
  routines: `CREATE TABLE IF NOT EXISTS routines (
		id INT unsigned NOT NULL AUTO_INCREMENT,
		name VARCHAR(255) UNIQUE,
		primary key (id)
	);`,
  workouts: `CREATE TABLE IF NOT EXISTS workouts (
		id INT unsigned NOT NULL AUTO_INCREMENT,
		primary key (id)
	);`,
  workoutRoutines: `CREATE TABLE IF NOT EXISTS workout_routines (
		id INT NOT NULL AUTO_INCREMENT,
		workoutId INT unsigned NOT NULL,
		routineId INT unsigned NOT NULL,
		CONSTRAINT workout_routine_unique UNIQUE (workoutId, routineId),
		primary key (id),
	);`,
  workoutMeta: `CREATE TABLE IF NOT EXISTS workout_meta (
		id INT unsigned NOT NULL AUTO_INCREMENT,
		durationMillis INT unsigned NOT NULL,
		primary key (id)
	);`,
  workoutSets: `CREATE TABLE IF NOT EXISTS workout_sets (
		id INT unsigned NOT NULL AUTO_INCREMENT,
		weight INT unsigned NOT NULL,
		repetitions INT unsigned NOT NULL,
		notes VARCHAR(255),
		type VARCHAR(255) NOT NULL DEFAULT "Default",
		exerciseId INT unsigned NOT NULL,
		primary key (id)
	);`,
  routineSets: `CREATE TABLE IF NOT EXISTS routine_sets (
		id INT unsigned NOT NULL AUTO_INCREMENT,
		routineId INT unsigned NOT NULL,
		setId INT unsigned NOT NULL,
		ordering INT unsigned NOT NULL,
		primary key (id)
	);`
};

const db = new DatabaseConnector(dbConfig);

db.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME};`)
  .then(db.query(`USE ${DB_NAME}`))
  .then(() =>
    Promise.all(Object.values(createTableStatements).map(createTableStatement => db.query(createTableStatement)))
  )
  .then(() => db.close())
  .then(() => process.exit());
