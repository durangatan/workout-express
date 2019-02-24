import { DatabaseConnection, dbConfig, Sequelizer } from '../db';
import { Queryable, WithId, QueryableId } from 'workout-models';
import { EmptyQueryError, NoIdError } from '../errors';
import { promises } from 'fs';

export default class BaseRepository<T, A> {
  tableName: string;
  modelConstructor: (constructorArgs: A) => T;
  db: DatabaseConnection;
  sequelizer: Sequelizer;
  constructor(
    tableName: string,
    modelConstructor: (args: A) => T,
    databaseConnection: DatabaseConnection = new DatabaseConnection(dbConfig),
    sequelizer: Sequelizer = new Sequelizer(tableName)
  ) {
    this.tableName = tableName;
    this.modelConstructor = modelConstructor;
    this.db = databaseConnection;
    this.sequelizer = sequelizer;
  }

  async byId(id: QueryableId) {
    const rows = await this.db.query(this.sequelizer.selectById, id);
    return rows.map(this.modelConstructor);
  }
  async byIdMulti(ids: Array<QueryableId>): Promise<Array<T>> {
    if (!ids.length || ids.length < 1) {
      return Promise.reject(new EmptyQueryError('no ids'));
    }
    const rows = await this.db.query(this.sequelizer.selectMultiById, [ids]);
    return rows.map(this.modelConstructor);
  }
  async all() {
    const rows = await this.db.query(this.sequelizer.select());
    return rows.map(this.modelConstructor);
  }

  async insert(record: Queryable) {
    const [okPacket] = await this.db.query(this.sequelizer.insert(record.columns), [record.columnValues]);
    return await this.byId(okPacket.insertId);
  }

  async insertMultiple(records: Array<Queryable>) {
    if (!records.length) {
      return Promise.reject(new EmptyQueryError());
    }
    await this.db.query(this.sequelizer.insertMulti(records[0].columns), records.map(record => record.columnValues));
    return this.db.query(this.sequelizer.select([this.sequelizer.orderBy('dateAdded', String(records.length))]));
  }

  deleteById(recordId: QueryableId) {
    return this.db.query(this.sequelizer.deleteById, recordId);
  }

  deleteMultiById(ids: Array<QueryableId>) {
    return this.db.query(this.sequelizer.deleteMultiById, ids);
  }

  upsert(record: Queryable) {
    if (!record.id) {
      return Promise.reject(new NoIdError('no id for this record'));
    }
    return this.db.performTransactionally([this.deleteById(record.id), this.insert(record)]);
  }

  upsertMulti(records: Array<Queryable>) {
    return this.db.performTransactionally([
      this.deleteMultiById(records.map(record => record.id)),
      this.insertMultiple(records)
    ]);
  }
}
