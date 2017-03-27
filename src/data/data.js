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

    /**
     * 获取作答数据（可传试题 ID 获取对应试题的作答数据）
     * @param  {[String]} id [试题 ID]
     * @return {[Array]}     [作答数据]
     */
    get(id) {
      const result = [];
      for (let key in this._cache) {
        const item = this._cache[key];
        if (id) {
          if (key === id) { // 直接命中
            result.push(item);
            break;
          } else if(item.rootId === id) {  // 获取 rootId 集合
            result.push(item);
          }
        } else {
          result.push(item);
        }
      }
      return result.length ? result : undefined;
    }

    remove(key) {
      delete this._cache[key];
    }
  }
  return new Data();
})()

export default talqsStorageData;
