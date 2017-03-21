/**
 * [下拉选择类型作答]
 * 适用题型
 * 1. 多选多
 * 2. 完形填空
 */
import talqsStorageData from '../data/data';
import { UPDATE_TALQS_CACHE_EVENT } from '../events/index';
import attr from '../template/attr';

const DropdownTypeQuestion = (($) => {
  const NAME = 'dropdown'
  const VERSION = '__VERSION__'
  const DATA_KEY = 'talqs.dropdown'
  const EVENT_KEY = `.${DATA_KEY}`
  const DATA_API_KEY = '.data-api'

  const Event = {
    CHANGE: `change${EVENT_KEY}${DATA_API_KEY}`,
    UPDATE_CACHE_DATA_API: UPDATE_TALQS_CACHE_EVENT
  }

  const Selector = {
    DROPDOWN_ITEM: `[${attr.inputid}]`,
    DROPDOWN_CONTAINER: `[${attr.type}="dropdown"]`
  }

  const ATTR = {
    QUE_ID: attr.queId,
    INPUTID: attr.inputid,
  }

  class DropdownType {
    /**
     * [constructor BlankType 构造器函数]
     * @param  {[String]}     queId     [试题ID]
     * @param  {[Node]}       element   [填空挂载容器元素]
     * @param  {[Array]}      data      [填空数据]
     * @return {[BlankType]}            [BlankType 实例]
     */
    constructor(queId, element, data) {
      this._queId = queId;
      this._element = element;
      this._selectData = data || [];
    }

    // getters
    static get VERSION() {
      return VERSION
    }


    // public

    /**
     * [updateBlankValueByIndex 更新某空的输入数据]
     * @param  {[Number]} index [填空的索引值]
     * @param  {[String]} value [输入的数据]
     */
    updateBlankValueByIndex(index, value) {
      index = parseInt(index, 10);
      if (!isNaN(index)) {
        // 更新对应空号的数据
        this._selectData[index] = value;
        // 更新缓存中的数据
        talqsStorageData.set(this._queId, this._selectData);
      }
    }

    /**
     * [fillDataIntoComponent 更新整个作答数据列表]
     * @param  {[type]} data [作答数据]
     */
    fillDataIntoComponent(data) {
      // 作答数据赋值
      this._selectData = data;
      // 遍历挂载容器元素下所有填空，并将对应的值写入输入框
      const selectArray = $(this._element).find(Selector.DROPDOWN_ITEM).toArray();
      if (selectArray) {
        selectArray.forEach((item, index) => {
          item.value = this._selectData[index];
        })
      }
    }


    // static

    /**
     * [_dataApiSelectHandler 填空输入事件处理]
     * @param  {[Event]} evt [输入事件对象]
     * TODO: 
     * 事件切换，onchange 或者 onblur
     * 输入框动态宽度
     */
    static _dataApiSelectHandler(evt) {
      // 获取挂载元素
      const containerElement = $(this).closest(Selector.DROPDOWN_CONTAINER)[0];
      // // 获取对应试题的 ID
      const queId = containerElement && containerElement.getAttribute(ATTR.QUE_ID);
      if (queId) {
        // 获取input输入值
        // 注意：输入的数据只处理首尾空格
        let value = evt.target.value;
        // 获取空号
        const index = this.getAttribute(ATTR.INPUTID);
        DropdownType._getInstance(queId, containerElement).updateBlankValueByIndex(index, value);
      }
    }

    /**
     * [_getInstance 获取一个组件实例，如果没有则初始化一个新的实例]
     * @param  {[type]}       queId   [试题ID]
     * @param  {[type]}       element [挂载元素]
     * @return {[BlankType]}          [组件实例]
     */
    static _getInstance(queId, element) {
      // 获取组件缓存
      let instance = $(element).data(DATA_KEY);
      if (!instance) {
        // 初始化组件并写入缓存
        instance = new DropdownType(queId, element, []);
        $(element).data(DATA_KEY, instance)
      }
      return instance;
    }

    /**
     * [_dataInitialHandler 从外部更新缓存数据监听处理]
     */
    static _dataInitialHandler() {
      // 获取所有带填空题组件标示的容器元素
      const dropdownTypeArray = $(Selector.DROPDOWN_CONTAINER).toArray();
      const len = dropdownTypeArray && dropdownTypeArray.length || 0;
      // 遍历容器元素，从缓存获取数据
      for (let i = 0; i < len; i++) {
        const item = dropdownTypeArray[i];
        const queId = item.getAttribute(ATTR.QUE_ID);
        // 缓存中对应该试题的作答数据
        const initialData = talqsStorageData.cache[queId];
        if (initialData) {
          DropdownType._getInstance(queId, item).fillDataIntoComponent(initialData);
        }
      }
    }
  }

  $(document).on(Event.CHANGE, Selector.DROPDOWN_ITEM, DropdownType._dataApiSelectHandler);
  $(document).on(Event.UPDATE_CACHE_DATA_API, DropdownType._dataInitialHandler);
})(jQuery)

export default DropdownTypeQuestion;
