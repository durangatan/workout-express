export default class Queryable {
  constructor() {
    this.insertInto = this.insertInto.bind(this);
  }
  insertInto(tableName) {
    const ownKeys = Reflect.ownKeys(this).filter(key => {
      const value = this[key];
      if (!value) {
        return false;
      }
      if (typeof key === 'string' && key[0] === '_') {
        return false;
      }
      return typeof this[key] !== 'function';
    });
    const queryString = `INSERT INTO ${tableName} (${ownKeys.join()})VALUES (${ownKeys
      .map(key => `${typeof this[key] === 'number' ? '' : '"'}${this[key]}${typeof this[key] === 'number' ? '' : '"'}`)
      .join()});`;
    return queryString;
  }
}
