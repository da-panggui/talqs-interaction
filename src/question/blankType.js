/**
 * 填空型作答
 * 
 * 适用题型
 * 1. 填空题
 *
 * TODO: 
 * 1. 判断是否可以机器判卷
 */
import talqsStorageData from '../data/data'
import { TALQS_EVENT, dispatchUpdateEvent } from '../events/index';
import attr from '../template/attr';

const BlankTypeQuestion = (($) => {

  const NAME = 'blank';
  const VERSION = '__VERSION__';
  const DATA_KEY = 'talqs.blank'
  const EVENT_KEY = `.${DATA_KEY}`
  const DATA_API_KEY = '.data-api'

  const Event = {
    KEYUP_DATA_API: `keyup${EVENT_KEY}${DATA_API_KEY}`,
  }

  const ATTR = {
    QUE_ID: attr.queId,
    BLANK_ITEM: attr.blankItem,
    ROOT_ID: attr.rootId,
  }

  const Selector = {
    BLANK_ITEM: `[${attr.blankItem}]`,
    BLANK_CONTAINER: `[${attr.type}="blank"]`,
    ROOT_CONTAINER: `[${attr.rootId}]`,
  }

  class BlankType {
    /**
     * [constructor BlankType 构造器函数]
     * @param  {[String]}     queId     [试题ID]
     * @param  {[Node]}       element   [填空挂载容器元素]
     * @param  {[Array]}      data      [填空数据]
     * @return {[BlankType]}            [BlankType 实例]
     */
    constructor(queId, rootId, element, data) {
      this._queId = queId;
      this._rootId = rootId;
      this._element = element;
      this._blankData = data || [];
      this._num = 0;
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
        // 与当前值比对，看是否有更新
        const currentValue = this._blankData[index];
        if (currentValue !== value) {
          // 更新对应空号的数据
          this._blankData[index] = value;

          // 获取填空数量
          if (!this._num) {
            const blankArray = $(this._element).find(Selector.BLANK_ITEM).toArray();
            this._num = blankArray && blankArray.length;
          }
        
          // 检测是否有有效数据
          const validate = this._blankData.some((item) => item);

          // 用户输入数据封装
          const inputData = {
            queId: this._queId,
            rootId: this._rootId,
            data: validate ? this._blankData : null,
            type: NAME,
            blankNum: this._num
          }

          // 用户输入有效的数据，则更新缓存中的数据
          if (validate) {
            talqsStorageData.set(this._queId, inputData);
          } else { // 输入无效的数据，移除内存中的数据
            talqsStorageData.remove(this._queId);
          }

          // 派发事件
          dispatchUpdateEvent(inputData)
        }
      }
    }

    /**
     * [fillDataIntoComponent 更新整个作答数据列表]
     * @param  {[type]} data [作答数据]
     */
    fillDataIntoComponent(data) {
      // 作答数据赋值
      this._blankData = data;
      // 遍历挂载容器元素下所有填空，并将对应的值写入输入框
      const blankArray = $(this._element).find(Selector.BLANK_ITEM).toArray();
      if (blankArray) {
        blankArray.forEach((item, index) => {
          item.value = this._blankData[index];
        })
      }
    }


    // static

    /**
     * [_dataApiInputHandler 填空输入事件处理]
     * @param  {[Event]} evt [输入事件对象]
     * TODO: 
     * 事件切换，onchange 或者 onblur
     * 输入框动态宽度
     */
    static _dataApiInputHandler(evt) {
      // 获取挂载元素
      const containerElement = $(this).closest(Selector.BLANK_CONTAINER)[0];
      // 获取对应试题的 ID
      const queId = containerElement && containerElement.getAttribute(ATTR.QUE_ID);
      const rootId = BlankType._getRootId(this);
      if (queId && rootId) {
        // 获取input输入值
        // 注意：输入的数据只处理首尾空格
        const value = evt.target.value.trim();
        evt.target.value = value;
        // 获取空号
        const index = this.getAttribute(ATTR.BLANK_ITEM);
        BlankType._getInstance(queId, rootId, containerElement).updateBlankValueByIndex(index, value);
      }
    }

    /**
     * [_getInstance 获取一个组件实例，如果没有则初始化一个新的实例]
     * @param  {[type]}       queId   [试题ID]
     * @param  {[type]}       element [挂载元素]
     * @return {[BlankType]}          [组件实例]
     */
    static _getInstance(queId, rootId, element) {
      // 获取组件缓存
      let instance = $(element).data(DATA_KEY);
      if (!instance) {
        // 初始化组件并写入缓存
        instance = new BlankType(queId, rootId, element, []);
        $(element).data(DATA_KEY, instance)
      }
      return instance;
    }

    /**
     * [_getRootId description]
     * @param  {[type]} element [description]
     * @return {[type]}         [description]
     */
    static _getRootId(element) {
      // 获取最外层容器
      const rootContainer = $(element).closest(Selector.ROOT_CONTAINER)[0];
      // 获取最外层 ID
      const rootId =  rootContainer && rootContainer.getAttribute(ATTR.ROOT_ID);

      return rootId;
    }


    /**
     * [_dataInitialHandler 从外部更新缓存数据监听处理]
     */
    static _dataInitialHandler() {
      // 获取所有带填空题组件标示的容器元素
      const blankTypeArray = $(Selector.BLANK_CONTAINER).toArray();
      const len = blankTypeArray && blankTypeArray.length || 0;
      // 遍历容器元素，从缓存获取数据
      for (let i = 0; i < len; i++) {
        const item = blankTypeArray[i];
        const queId = item.getAttribute(ATTR.QUE_ID);
        const rootId = BlankType._getRootId(item);
        // 缓存中对应该试题的作答数据
        const initialData = queId && talqsStorageData.cache[queId];
        if (rootId && initialData && initialData.data) {
          BlankType._getInstance(queId, rootId, item).fillDataIntoComponent(initialData.data);
        }
      }
    }
  }

  $(document).on(Event.KEYUP_DATA_API, Selector.BLANK_ITEM, BlankType._dataApiInputHandler);
  $(document).on(TALQS_EVENT.CHANGE, BlankType._dataInitialHandler);
})(jQuery)

export default BlankTypeQuestion;
