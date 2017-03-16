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

    get(key) {
      let jsonStr;
      if (key) {
        jsonStr = this._cache[key];
      } else {
        jsonStr = this._cache;
      }
      return JSON.stringify(jsonStr);
    }

    remove(key) {
      delete this._cache[key];
    }
  }
  return new Data();
})()

export default talqsStorageData;
