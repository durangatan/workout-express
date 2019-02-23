export default class Sequelizer {
  tableName: string;
  constructor(tableName: string) {
    this.tableName = tableName;
  }

  where(a: string, comparator: string) {
    return `WHERE ${a} ${comparator}`;
  }

  orderBy(orderBy: string, limit: string, direction: string = 'DESC') {
    return `ORDER BY ${orderBy} ${direction} LIMIT ${limit}`;
  }

  select(subQueries?: Array<string>) {
    return `SELECT * FROM ${this.tableName} ${subQueries ? subQueries.join(' ') : ''}`;
  }

  get selectById() {
    const subQueries = [this.where('id', '=')];
    return this.select(subQueries);
  }

  get selectMultiById() {
    const subQueries = [this.where('id', 'in')];
    return this.select(subQueries);
  }

  get deleteById() {
    return `DELETE FROM ${this.tableName} WHERE id = `;
  }

  get deleteMultiById() {
    return `DELETE FROM ${this.tableName} WHERE id IN `;
  }

  insert(recordKeys: Array<string>) {
    return `INSERT INTO ${this.tableName} (${recordKeys.join()}) VALUES `;
  }

  insertMulti(recordKeys: Array<string>) {
    return `INSERT INTO ${this.tableName} (${recordKeys.join()}) VALUES `;
  }
}
