export default class Queryable {
  constructor() {
    this.insertInto = this.insertInto.bind(this);
  }

  get ownKeys() {
    return Reflect.ownKeys(this).filter(key => {
      const value = this[key];
      if (!value) {
        return false;
      }
      if (typeof key === 'string' && key[0] === '_') {
        return false;
      }
      return typeof this[key] !== 'function';
    });
  }

  get ownKeysQueryString() {
    return `(${this.ownKeys.join()})`;
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
}
