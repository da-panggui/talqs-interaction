const talqsStorageData = (() => {
  class Data {
    constructor() {
      this._cache = {};
    }

    set cache(data) {
      for (var key in data) {
        this.set(key, data[key])
      }
    }

    get cache() {
      return this._cache
    }

    set(key, data) {
      this._cache[key] = data;
      console.log(JSON.stringify(this._cache));
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
