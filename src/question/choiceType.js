/**
 * 选择型作答交互
 * 适用的题型有
 * 1. 单选      data-type: '1'
 * 2. 多选      data-type: '2'
 */
import talqsStorageData from '../data/data';
import { TALQS_EVENT, dispatchUpdateEvent } from '../events/index';
import attr from '../template/attr';

const ChoiceTypeQuestion = (($) => {

  const NAME = 'choice'
  const VERSION = '__VERSION__'
  const DATA_KEY = 'talqs.choice'
  const EVENT_KEY = `.${DATA_KEY}`
  const DATA_API_KEY = '.data-api'

  const Events = {
    CLICK_DATA_API: `click${EVENT_KEY}${DATA_API_KEY}`,
  }

  const Selector = {
    CHOICE_ITEM: `[${attr.optionItem}]`,
    CHOICE_GROUP: `[${attr.optionGroup}]`,
    CHOICE_CONTAINER: `[${attr.type}="choice"]`,
    ROOT_CONTAINER: `[${attr.rootId}]`,
    CHILD_ITEM: `[${attr.type}]`,
  }

  const ATTR = {
    QUE_ID: attr.queId,
    LOGIC_TYPE: attr.logicType,
    CHOICE_ITEM: attr.optionItem,
    CHOICE_GROUP: attr.optionGroup,
    ROOT_ID: attr.rootId,
  }

  const ClassName = {
    ACTIVE: 'active',
  }

  class ChoiceType {

    constructor(queId, rootId, element, data, config) {
      this._element = element;
      this._selected = data || [];
      this._config = config;
      this._queId = queId;
      this._rootId = rootId;
    }

    // getters
    static get VERSION() {
      return VERSION
    }

    // private
    _updateClassState(element, currentOption) {
      const childList = $(element).children().toArray();
      childList && childList.forEach((subItem) => {
        const option = subItem.getAttribute(ATTR.CHOICE_ITEM);
        let contain = option === currentOption;
        if (Array.isArray(currentOption)) { // 如果传递的是数组，则判断是否包含
          contain = !(currentOption.indexOf(option) < 0)
        }
        $(subItem).toggleClass(ClassName.ACTIVE, contain);
      })
    }

    /**
     * [_updateStyleState 更新选中状态样式]
     * @return {[type]} [description]
     */
    _updateStyleState(index) {
      const list = $(this._element).find(Selector.CHOICE_GROUP).toArray();
      if (this._config.clozeChoice && index !== undefined) { // 更新某行样式
        this._updateClassState($(list[index]), this._selected[index]);
      } else { // 更新整个列表样式
        list.forEach((item, index) => {
          const data = this._config.clozeChoice ? this._selected[index] : this._selected;
          this._updateClassState($(item), data);
        })
      }
    }


    // public
    updateSelectedState(option, index) {
      index = parseInt(index, 10);
      // 完型填空类型
      if (this._config.clozeChoice) {
        this._selected[index] = this._selected[index] === option ? '' : option;
      } else { // 非完型填空类型
        const cindex = this._selected.indexOf(option);
        if (cindex < 0) {
          if(this._config.multipleChoice) { // 多选题
            this._selected.push(option);
          } else {
            this._selected = [option];
          }
        } else { // 移除一个选项
          this._selected.splice(cindex, 1);
        }
        // 按字母顺序排序
        this._selected.sort();
      }
      // 更新选中样式
      this._updateStyleState(index);

      // 作答数据
      const inputData = {
        rootId: this._rootId,
        queId: this._queId,
        data: this._selected.length ? this._selected : null,
        multiple: this._config.multipleChoice,
        type: NAME
      }
      if (inputData.data) {
        talqsStorageData.set(this._queId, inputData);
      } else {
        talqsStorageData.remove(this._queId)
      }
      
      // 派发数据改变事件
      dispatchUpdateEvent(inputData)
    }


    // static

    /**
     * [fillDataIntoComponent 更新整个作答数据列表]
     * @param  {[type]} data [作答数据]
     */
    fillDataIntoComponent(data) {
      // 作答数据赋值
      this._selected = data || [];
      this._updateStyleState();
    }

    /**
     * [getConfig description]
     * @param  {[type]} type [description]
     * @return {[type]}      [description]
     */
    static getConfig(type) {
      type = parseInt(type, 10);
      const config = {
        multipleChoice: type === 2,
        clozeChoice: type === 10,
      }
      return config;
    }

    // 点击选项事件监听
    static _dataApiClickHandler() {
      // 获取选项列表容器
      const containerElement = $(this).closest(Selector.CHOICE_CONTAINER)[0];
      // 获取此选项对应试题的 ID
      const queId = containerElement && containerElement.getAttribute(ATTR.QUE_ID);
      // 获取最外层 ID
      const rootId = ChoiceType._getRootId(this);
      if (queId && rootId) {
        // 获取点选选项的数据
        const option = this.getAttribute(ATTR.CHOICE_ITEM);
        // 获取索引值
        const parent = this.parentElement;
        const index = parent && parent.getAttribute(ATTR.CHOICE_GROUP);
        // 更新选项数据
        ChoiceType._getInstance(queId, rootId, containerElement).updateSelectedState(option, index);
      }
    }

    /**
     * [_getInstance 获取一个组件实例，如果没有则初始化一个新的实例]
     * @param  {[type]}       queId    [试题ID]
     * @param  {[type]}       element  [挂载元素]
     * @return {[ChoiceType]}          [组件实例]
     */
    static _getInstance(queId, rootId, element) {
      // 获取组件缓存
      let instance = $(element).data(DATA_KEY);
      if (!instance) {
        const type = element.getAttribute(ATTR.LOGIC_TYPE);
        const config = ChoiceType.getConfig(type);
        // 初始化组件并写入缓存
        instance = new ChoiceType(queId, rootId, element, [], config);
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

      // const childLen = rootContainer && $(rootContainer).find(Selector.CHILD_ITEM).toArray().length;

      return rootId;
    }

    // 带初始化数据的初始化组件
    static _dataInitialHandler() {
      // 获取所有选择题
      const choiceTypeArray = $(Selector.CHOICE_CONTAINER).toArray();
      const len = choiceTypeArray && choiceTypeArray.length || 0;
      for (let i = 0; i < len; i++) {
        const item = choiceTypeArray[i];
        const queId = item.getAttribute(ATTR.QUE_ID);
        // 缓存中对应该试题的数据
        const initialData = queId && talqsStorageData.cache[queId];
        const rootId = ChoiceType._getRootId(item) ;
        if (rootId && initialData && initialData.data) { 
          // 查看是否有初始化标记
          ChoiceType._getInstance(queId, rootId, item).fillDataIntoComponent(initialData.data);
        }
      }
    }
  }

  $(document).on(Events.CLICK_DATA_API, Selector.CHOICE_ITEM, ChoiceType._dataApiClickHandler);
  $(document).on(TALQS_EVENT.CHANGE, ChoiceType._dataInitialHandler);
})(jQuery)

export default ChoiceTypeQuestion
