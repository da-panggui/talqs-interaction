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

    get(id) {
      let result;
      if (id) { // 遍历查找
        for (let key in this._cache) {
          const item = this._cache[key];
          if (key === id) { // 直接命中
            result = item;
            break;
          } else if(item.rootId === id) { // 获取 rootId 集合
            if (!result) {
              result = {};
            }
            result[key] = item;
          }
        }
      } else {
        result = this._cache;
      }
      return JSON.stringify(result);
    }

    remove(key) {
      delete this._cache[key];
    }
  }
  return new Data();
})()

export default talqsStorageData;
