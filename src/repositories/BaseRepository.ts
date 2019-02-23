import { DatabaseConnection, dbConfig } from '../db';
import { Sequelizer, Queryable, WithId } from '../../../workout-utils';
import { QueryableId } from '../../../workout-utils/Queryable';
import { EmptyQueryError } from '../errors';

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
    console.log(id, typeof id);
    const rows = await this.db.query(this.sequelizer.selectById, id);
    return rows.map(this.modelConstructor);
  }
  async byIdMulti(ids: Array<QueryableId>) {
    const rows = await this.db.query(this.sequelizer.selectMultiById, [ids]);
    return rows.map(this.modelConstructor);
  }
  async all() {
    const rows = await this.db.query(this.sequelizer.select());
    return rows.map(this.modelConstructor);
  }

  async insert(record: Queryable) {
    const [okPacket] = await this.db.query(this.sequelizer.insert(record.columns), record.columnValues);
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

  upsert(record: Queryable & WithId<Queryable>) {
    return this.db.performTransactionally([this.deleteById(record.id), this.insert(record)]);
  }

  upsertMulti(records: Array<Queryable & WithId<Queryable>>) {
    return this.db.performTransactionally([
      this.deleteMultiById(records.map(record => record.id)),
      this.insertMultiple(records)
    ]);
  }
}
