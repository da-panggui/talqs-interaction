/**
 * 数据存储中心
 */
const talqsStorageData = (() => {
  class Data {
    constructor() {
      this._cache = {};
    }

    get cache() {
      return this._cache
    }

    set(key, data) {
      this._cache[key] = data;
    }

    replacer(key, value) {
      if (typeof value === 'undefined' || value === null) {
        return "";
      }
      return value;
    }

    get(key) {
      let item;
      if (key) {
        item = this._cache[key];
      } else {
        item = this._cache;
      }
      if (item) {
        return JSON.stringify(item, this.replacer);
      }
      return item;
    }

    remove(key) {
      delete this._cache[key];
    }
  }
  return new Data();
})()

export default talqsStorageData;
