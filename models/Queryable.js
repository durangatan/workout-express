export default class Queryable {
  constructor() {
    this.insertInto = this.insertInto.bind(this);
    this.upsertInto = this.upsertInto.bind(this);
  }

  get ownKeys() {
    return Reflect.ownKeys(this).filter(key => {
      const value = this[key];
      if (value === undefined || value === null) {
        return false;
      }
      if (typeof key === 'string' && key[0] === '_') {
        return false;
      }
      return typeof this[key] !== 'function';
    });
  }

  get upsertKeys() {
    return this.ownKeys.filter(key => key !== 'id');
  }

  get ownKeysQueryString() {
    return `(${this.ownKeys.join()})`;
  }

  get upsertQueryString() {
    return `${this.upsertKeys
      .map(
        key =>
          `${key} = ${typeof this[key] === 'number' ? '' : '"'}${this[key]}${typeof this[key] === 'number' ? '' : '"'}`
      )
      .join()}`;
  }

  get ownValuesQueryString() {
    return `(${this.ownKeys
      .map(key => `${typeof this[key] === 'number' ? '' : '"'}${this[key]}${typeof this[key] === 'number' ? '' : '"'}`)
      .join()})`;
  }

  insertInto(tableName) {
    const queryString = `INSERT INTO ${tableName} ${this.ownKeysQueryString} VALUES ${this.ownValuesQueryString};`;
    return queryString;
  }

  upsertInto(tableName) {
    const queryString = `INSERT INTO ${tableName} ${this.ownKeysQueryString} VALUES ${
      this.ownValuesQueryString
    } ON DUPLICATE KEY UPDATE ${this.upsertQueryString}`;
    return queryString;
  }
}
