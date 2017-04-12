/**
 * talqsInteraction v1.0.0
 * (c) 2017 JinJun He
 * @license MIT
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.TalqsInteraction = factory());
}(this, (function () { 'use strict';

/**
 * 数据存储中心
 */
var talqsStorageData = (function () {
  var Data = function Data() {
    this._cache = {};
  };

  var prototypeAccessors = { cache: {} };

  prototypeAccessors.cache.get = function () {
    return this._cache
  };

  Data.prototype.set = function set (key, data) {
    this._cache[key] = data;
  };

  /**
   * 获取作答数据（可传试题 ID 获取对应试题的作答数据）
   * @param{[String]} id [试题 ID]
   * @return {[Array]}   [作答数据]
   */
  Data.prototype.get = function get (id) {
      var this$1 = this;

    var result = [];
    for (var key in this$1._cache) {
      var item = this$1._cache[key];
      if (id) {
        if (key === id) { // 直接命中
          result.push(item);
          break;
        } else if(item.rootId === id) {// 获取 rootId 集合
          result.push(item);
        }
      } else {
        result.push(item);
      }
    }
    return result.length ? result : undefined;
  };

  Data.prototype.remove = function remove (key) {
    delete this._cache[key];
  };

  Object.defineProperties( Data.prototype, prototypeAccessors );
  return new Data();
})();

var EVENT_NAME_SAPCE = "TALQS_INTERACTION";

var TALQS_EVENT = {
  INPUT: (EVENT_NAME_SAPCE + "_INPUT"), // 用户输入数据
  CHANGE: (EVENT_NAME_SAPCE + "_CHANGE"), // 用户初始化数据
};

// 用户作答数据更新
var dispatchUpdateEvent = function (data) {
  var evt = new Event(TALQS_EVENT.INPUT);
  evt.data = data;
  document.dispatchEvent(evt);
};

/**
 * 交互属性集合
 */
var attr = {
  type: 'data-talqs-type',
  queId: 'data-que-id',
  logicType: 'data-logic-type',
  autoLayout: 'data-auto-layout',
  optionGroup: 'data-option-group',
  optionItem: 'data-option-item',
  blankItem: 'data-blank-item',
  inputid: 'data-inputid',
  rootId: 'data-talqs-root'
};

/**
 * 选择型作答交互
 * 适用的题型有
 * 1. 单选      data-type: '1'
 * 2. 多选      data-type: '2'
 */
var ChoiceTypeQuestion = (function ($) {

  var NAME = 'choice';
  var VERSION = '1.0.0';
  var DATA_KEY = 'talqs.choice';
  var EVENT_KEY = "." + DATA_KEY;
  var DATA_API_KEY = '.data-api';

  var Events = {
    CLICK_DATA_API: ("click" + EVENT_KEY + DATA_API_KEY),
  };

  var Selector = {
    CHOICE_ITEM: ("[" + (attr.optionItem) + "]"),
    CHOICE_GROUP: ("[" + (attr.optionGroup) + "]"),
    CHOICE_CONTAINER: ("[" + (attr.type) + "=\"choice\"]"),
    ROOT_CONTAINER: ("[" + (attr.rootId) + "]"),
    CHILD_ITEM: ("[" + (attr.type) + "]"),
  };

  var ATTR = {
    QUE_ID: attr.queId,
    LOGIC_TYPE: attr.logicType,
    CHOICE_ITEM: attr.optionItem,
    CHOICE_GROUP: attr.optionGroup,
    ROOT_ID: attr.rootId,
  };

  var ClassName = {
    ACTIVE: 'active',
  };

  var ChoiceType = function ChoiceType(queId, rootId, element, data, config) {
    this._element = element;
    this._selected = data || [];
    this._config = config;
    this._queId = queId;
    this._rootId = rootId;
  };

  var staticAccessors = { VERSION: {} };

  // getters
  staticAccessors.VERSION.get = function () {
    return VERSION
  };

  // private
  ChoiceType.prototype._updateClassState = function _updateClassState (element, currentOption) {
    var childList = $(element).children().toArray();
    childList && childList.forEach(function (subItem) {
      var option = subItem.getAttribute(ATTR.CHOICE_ITEM);
      var contain = option === currentOption;
      if (Array.isArray(currentOption)) { // 如果传递的是数组，则判断是否包含
        contain = !(currentOption.indexOf(option) < 0);
      }
      $(subItem).toggleClass(ClassName.ACTIVE, contain);
    });
  };

  /**
   * [_updateStyleState 更新选中状态样式]
   * @return {[type]} [description]
   */
  ChoiceType.prototype._updateStyleState = function _updateStyleState (index) {
      var this$1 = this;

    var list = $(this._element).find(Selector.CHOICE_GROUP).toArray();
    if (this._config.clozeChoice && index !== undefined) { // 更新某行样式
      this._updateClassState($(list[index]), this._selected[index]);
    } else { // 更新整个列表样式
      list.forEach(function (item, index) {
        var data = this$1._config.clozeChoice ? this$1._selected[index] : this$1._selected;
        this$1._updateClassState($(item), data);
      });
    }
  };


  // public
  ChoiceType.prototype.updateSelectedState = function updateSelectedState (option, index) {
    index = parseInt(index, 10);
    // 完型填空类型
    if (this._config.clozeChoice) {
      this._selected[index] = this._selected[index] === option ? '' : option;
    } else { // 非完型填空类型
      var cindex = this._selected.indexOf(option);
      if (this._config.multipleChoice) { // 多选题
        if (cindex < 0) { // 添加一个选项
          this._selected.push(option);
        } else { // 移除一个选项
          this._selected.splice(cindex, 1);
        }
      } else { // 单选题(多次点选同个选项)
        if (cindex !== -1) {
          return;
        }
        this._selected = [option];
      }

      // 按字母顺序排序
      this._selected.sort();
    }
    // 更新选中样式
    this._updateStyleState(index);

    // 作答数据
    var inputData = {
      rootId: this._rootId,
      queId: this._queId,
      data: this._selected.length ? this._selected : null,
      multiple: this._config.multipleChoice,
      type: NAME
    };
    if (inputData.data) {
      talqsStorageData.set(this._queId, inputData);
    } else {
      talqsStorageData.remove(this._queId);
    }
      
    // 派发数据改变事件
    dispatchUpdateEvent(inputData);
  };


  // static

  /**
   * [fillDataIntoComponent 更新整个作答数据列表]
   * @param{[type]} data [作答数据]
   */
  ChoiceType.prototype.fillDataIntoComponent = function fillDataIntoComponent (data) {
    // 作答数据赋值
    this._selected = data || [];
    this._updateStyleState();
  };

  /**
   * [getConfig description]
   * @param{[type]} type [description]
   * @return {[type]}    [description]
   */
  ChoiceType.getConfig = function getConfig (type) {
    type = parseInt(type, 10);
    var config = {
      multipleChoice: type === 2,
      clozeChoice: type === 10,
    };
    return config;
  };

  // 点击选项事件监听
  ChoiceType._dataApiClickHandler = function _dataApiClickHandler () {
    // 获取选项列表容器
    var containerElement = $(this).closest(Selector.CHOICE_CONTAINER)[0];
    // 获取此选项对应试题的 ID
    var queId = containerElement && containerElement.getAttribute(ATTR.QUE_ID);
    // 获取最外层 ID
    var rootId = ChoiceType._getRootId(this);
    if (queId && rootId) {
      // 获取点选选项的数据
      var option = this.getAttribute(ATTR.CHOICE_ITEM);
      // 获取索引值
      var parent = this.parentElement;
      var index = parent && parent.getAttribute(ATTR.CHOICE_GROUP);
      // 更新选项数据
      ChoiceType._getInstance(queId, rootId, containerElement).updateSelectedState(option, index);
    }
  };

  /**
   * [_getInstance 获取一个组件实例，如果没有则初始化一个新的实例]
   * @param{[type]}     queId  [试题ID]
   * @param{[type]}     element[挂载元素]
   * @return {[ChoiceType]}        [组件实例]
   */
  ChoiceType._getInstance = function _getInstance (queId, rootId, element) {
    // 获取组件缓存
    var instance = $(element).data(DATA_KEY);
    if (!instance) {
      var type = element.getAttribute(ATTR.LOGIC_TYPE);
      var config = ChoiceType.getConfig(type);
      // 初始化组件并写入缓存
      instance = new ChoiceType(queId, rootId, element, [], config);
      $(element).data(DATA_KEY, instance);
    }
    return instance;
  };

  /**
   * [_getRootId description]
   * @param{[type]} element [description]
   * @return {[type]}       [description]
   */
  ChoiceType._getRootId = function _getRootId (element) {
    // 获取最外层容器
    var rootContainer = $(element).closest(Selector.ROOT_CONTAINER)[0];
    // 获取最外层 ID
    var rootId =rootContainer && rootContainer.getAttribute(ATTR.ROOT_ID);

    // const childLen = rootContainer && $(rootContainer).find(Selector.CHILD_ITEM).toArray().length;

    return rootId;
  };

  // 带初始化数据的初始化组件
  ChoiceType._dataInitialHandler = function _dataInitialHandler () {
    // 获取所有选择题
    var choiceTypeArray = $(Selector.CHOICE_CONTAINER).toArray();
    var len = choiceTypeArray && choiceTypeArray.length || 0;
    for (var i = 0; i < len; i++) {
      var item = choiceTypeArray[i];
      var queId = item.getAttribute(ATTR.QUE_ID);
      // 缓存中对应该试题的数据
      var initialData = queId && talqsStorageData.cache[queId];
      var rootId = ChoiceType._getRootId(item);
      if (rootId && initialData && initialData.data) { 
        // 查看是否有初始化标记
        ChoiceType._getInstance(queId, rootId, item).fillDataIntoComponent(initialData.data);
      }
    }
  };

  Object.defineProperties( ChoiceType, staticAccessors );

  $(document).on(Events.CLICK_DATA_API, Selector.CHOICE_ITEM, ChoiceType._dataApiClickHandler);
  $(document).on(TALQS_EVENT.CHANGE, ChoiceType._dataInitialHandler);
})(jQuery);

/**
 * 填空型作答
 * 
 * 适用题型
 * 1. 填空题
 *
 * TODO: 
 * 1. 判断是否可以机器判卷
 */
var BlankTypeQuestion = (function ($) {

  var NAME = 'blank';
  var VERSION = '1.0.0';
  var DATA_KEY = 'talqs.blank';
  var EVENT_KEY = "." + DATA_KEY;
  var DATA_API_KEY = '.data-api';

  var Event = {
    KEYUP_DATA_API: ("blur" + EVENT_KEY + DATA_API_KEY),
  };

  var ATTR = {
    QUE_ID: attr.queId,
    BLANK_ITEM: attr.blankItem,
    ROOT_ID: attr.rootId,
  };

  var Selector = {
    BLANK_ITEM: ("[" + (attr.blankItem) + "]"),
    BLANK_CONTAINER: ("[" + (attr.type) + "=\"blank\"]"),
    ROOT_CONTAINER: ("[" + (attr.rootId) + "]"),
  };

  var BlankType = function BlankType(queId, rootId, element, data) {
    this._queId = queId;
    this._rootId = rootId;
    this._element = element;
    this._blankData = data || [];
    this._num = 0;
  };

  var staticAccessors = { VERSION: {} };

  // getters
  staticAccessors.VERSION.get = function () {
    return VERSION
  };


  // public

  /**
   * [updateBlankValueByIndex 更新某空的输入数据]
   * @param{[Number]} index [填空的索引值]
   * @param{[String]} value [输入的数据]
   */
  BlankType.prototype.updateBlankValueByIndex = function updateBlankValueByIndex (index, value) {
    index = parseInt(index, 10);
    if (!isNaN(index)) {
      // 与当前值比对，看是否有更新
      var currentValue = this._blankData[index];
      if (currentValue !== value) {
        // 更新对应空号的数据
        this._blankData[index] = value;

        // 获取填空数量
        if (!this._num) {
          var blankArray = $(this._element).find(Selector.BLANK_ITEM).toArray();
          this._num = blankArray && blankArray.length;
        }
        
        // 检测是否有有效数据
        var validate = this._blankData.some(function (item) { return item; });

        // 用户输入数据封装
        var inputData = {
          queId: this._queId,
          rootId: this._rootId,
          data: validate ? this._blankData : null,
          type: NAME,
          blankNum: this._num
        };

        // 用户输入有效的数据，则更新缓存中的数据
        if (validate) {
          talqsStorageData.set(this._queId, inputData);
        } else { // 输入无效的数据，移除内存中的数据
          talqsStorageData.remove(this._queId);
        }

        // 派发事件
        dispatchUpdateEvent(inputData);
      }
    }
  };

  /**
   * [fillDataIntoComponent 更新整个作答数据列表]
   * @param{[type]} data [作答数据]
   */
  BlankType.prototype.fillDataIntoComponent = function fillDataIntoComponent (data) {
      var this$1 = this;

    // 作答数据赋值
    this._blankData = data;
    // 遍历挂载容器元素下所有填空，并将对应的值写入输入框
    var blankArray = $(this._element).find(Selector.BLANK_ITEM).toArray();
    if (blankArray) {
      blankArray.forEach(function (item, index) {
        item.value = this$1._blankData[index];
      });
    }
  };


  // static

  /**
   * [_dataApiInputHandler 填空输入事件处理]
   * @param{[Event]} evt [输入事件对象]
   * TODO: 
   * 事件切换，onchange 或者 onblur
   * 输入框动态宽度
   */
  BlankType._dataApiInputHandler = function _dataApiInputHandler (evt) {
    // 获取挂载元素
    var containerElement = $(this).closest(Selector.BLANK_CONTAINER)[0];
    // 获取对应试题的 ID
    var queId = containerElement && containerElement.getAttribute(ATTR.QUE_ID);
    var rootId = BlankType._getRootId(this);
    if (queId && rootId) {
      // 获取input输入值
      // 注意：输入的数据只处理首尾空格
      var value = evt.target.value.trim();
      evt.target.value = value;
      // 获取空号
      var index = this.getAttribute(ATTR.BLANK_ITEM);
      BlankType._getInstance(queId, rootId, containerElement).updateBlankValueByIndex(index, value);
    }
  };

  /**
   * [_getInstance 获取一个组件实例，如果没有则初始化一个新的实例]
   * @param{[type]}     queId [试题ID]
   * @param{[type]}     element [挂载元素]
   * @return {[BlankType]}        [组件实例]
   */
  BlankType._getInstance = function _getInstance (queId, rootId, element) {
    // 获取组件缓存
    var instance = $(element).data(DATA_KEY);
    if (!instance) {
      // 初始化组件并写入缓存
      instance = new BlankType(queId, rootId, element, []);
      $(element).data(DATA_KEY, instance);
    }
    return instance;
  };

  /**
   * [_getRootId description]
   * @param{[type]} element [description]
   * @return {[type]}       [description]
   */
  BlankType._getRootId = function _getRootId (element) {
    // 获取最外层容器
    var rootContainer = $(element).closest(Selector.ROOT_CONTAINER)[0];
    // 获取最外层 ID
    var rootId =rootContainer && rootContainer.getAttribute(ATTR.ROOT_ID);

    return rootId;
  };


  /**
   * [_dataInitialHandler 从外部更新缓存数据监听处理]
   */
  BlankType._dataInitialHandler = function _dataInitialHandler () {
    // 获取所有带填空题组件标示的容器元素
    var blankTypeArray = $(Selector.BLANK_CONTAINER).toArray();
    var len = blankTypeArray && blankTypeArray.length || 0;
    // 遍历容器元素，从缓存获取数据
    for (var i = 0; i < len; i++) {
      var item = blankTypeArray[i];
      var queId = item.getAttribute(ATTR.QUE_ID);
      var rootId = BlankType._getRootId(item);
      // 缓存中对应该试题的作答数据
      var initialData = queId && talqsStorageData.cache[queId];
      if (rootId && initialData && initialData.data) {
        BlankType._getInstance(queId, rootId, item).fillDataIntoComponent(initialData.data);
      }
    }
  };

  Object.defineProperties( BlankType, staticAccessors );

  $(document).on(Event.KEYUP_DATA_API, Selector.BLANK_ITEM, BlankType._dataApiInputHandler);
  $(document).on(TALQS_EVENT.CHANGE, BlankType._dataInitialHandler);
})(jQuery);

/**
 * [下拉选择类型作答]
 * 适用题型
 * 1. 多选多
 * 2. 完形填空
 */
var DropdownTypeQuestion = (function ($) {
  var NAME = 'dropdown';
  var VERSION = '1.0.0';
  var DATA_KEY = 'talqs.dropdown';
  var EVENT_KEY = "." + DATA_KEY;
  var DATA_API_KEY = '.data-api';

  var Event = {
    CHANGE: ("change" + EVENT_KEY + DATA_API_KEY),
  };

  var Selector = {
    DROPDOWN_ITEM: ("[" + (attr.inputid) + "]"),
    DROPDOWN_CONTAINER: ("[" + (attr.type) + "=\"dropdown\"]"),
    ROOT_CONTAINER: ("[" + (attr.rootId) + "]"),
  };

  var ATTR = {
    QUE_ID: attr.queId,
    INPUTID: attr.inputid,
    ROOT_ID: attr.rootId,
  };

  var DropdownType = function DropdownType(queId,rootId, element, data) {
    this._queId = queId;
    this._element = element;
    this._selectData = data || [];
    this._rootId = rootId;
    this._blankNum = 0;
  };

  var staticAccessors = { VERSION: {} };

  // getters
  staticAccessors.VERSION.get = function () {
    return VERSION
  };


  // public

  /**
   * [updateBlankValueByIndex 更新某空的输入数据]
   * @param{[Number]} index [填空的索引值]
   * @param{[String]} value [输入的数据]
   */
  DropdownType.prototype.updateBlankValueByIndex = function updateBlankValueByIndex (index, value) {
      var this$1 = this;

    index = parseInt(index, 10);
    if (!isNaN(index)) {
      // 更新对应空号的数据
      this._selectData[index] = value;
      // 获取填空数量
      if (!this._blankNum) {
        var selectArray = $(this._element).find(Selector.DROPDOWN_ITEM).toArray();
        this._blankNum = selectArray && selectArray.length;
      }
        
      // 检测是否有有效数据
      var validate = this._selectData.some(function (item) { return item; });

      var tempList = [];
      for (var i = 0; i < this._selectData.length; i++) {
        tempList.push(this$1._selectData[i] || '');
      }

      // 用户输入数据封装
      var inputData = {
        rootId: this._rootId,
        queId: this._queId,
        data: validate ? tempList : null,
        type: NAME,
        blankNum: this._blankNum
      };

      // 用户输入有效的数据，则更新缓存中的数据
      if (validate) {
        talqsStorageData.set(this._queId, inputData);
      } else { // 输入无效的数据，移除内存中的数据
        talqsStorageData.remove(this._queId);
      }
      // 派发事件
      dispatchUpdateEvent(inputData);
    }
  };

  /**
   * [fillDataIntoComponent 更新整个作答数据列表]
   * @param{[type]} data [作答数据]
   */
  DropdownType.prototype.fillDataIntoComponent = function fillDataIntoComponent (data) {
      var this$1 = this;

    // 作答数据赋值
    this._selectData = data;
    // 遍历挂载容器元素下所有填空，并将对应的值写入输入框
    var selectArray = $(this._element).find(Selector.DROPDOWN_ITEM).toArray();
    if (selectArray) {
      selectArray.forEach(function (item, index) {
        item.value = this$1._selectData[index];
      });
    }
  };


  // static

  /**
   * [_dataApiSelectHandler 填空输入事件处理]
   * @param{[Event]} evt [输入事件对象]
   * TODO: 
   * 事件切换，onchange 或者 onblur
   * 输入框动态宽度
   */
  DropdownType._dataApiSelectHandler = function _dataApiSelectHandler (evt) {
    // 获取挂载元素
    var containerElement = $(this).closest(Selector.DROPDOWN_CONTAINER)[0];
    // 获取对应试题的 ID
    var queId = containerElement && containerElement.getAttribute(ATTR.QUE_ID);
    // 获取最外层 ID
    var rootId = DropdownType._getRootId(this);
    if (queId && rootId) {
      // 获取 select 输入值
      var value = evt.target.value;
      // 获取空号
      var index = this.getAttribute(ATTR.INPUTID);
      DropdownType._getInstance(queId, rootId, containerElement).updateBlankValueByIndex(index, value);
    }
  };

  /**
   * [_getInstance 获取一个组件实例，如果没有则初始化一个新的实例]
   * @param{[type]}     queId [试题ID]
   * @param{[type]}     element [挂载元素]
   * @return {[BlankType]}        [组件实例]
   */
  DropdownType._getInstance = function _getInstance (queId, rootId, element) {
    // 获取组件缓存
    var instance = $(element).data(DATA_KEY);
    if (!instance) {
      // 初始化组件并写入缓存
      instance = new DropdownType(queId, rootId, element, []);
      $(element).data(DATA_KEY, instance);
    }
    return instance;
  };

  /**
   * [_getRootId description]
   * @param{[type]} element [description]
   * @return {[type]}       [description]
   */
  DropdownType._getRootId = function _getRootId (element) {
    // 获取最外层容器
    var rootContainer = $(element).closest(Selector.ROOT_CONTAINER)[0];
    // 获取最外层 ID
    var rootId =rootContainer && rootContainer.getAttribute(ATTR.ROOT_ID);

    return rootId;
  };


  /**
   * [_dataInitialHandler 从外部更新缓存数据监听处理]
   */
  DropdownType._dataInitialHandler = function _dataInitialHandler () {
    // 获取所有带填空题组件标示的容器元素
    var dropdownTypeArray = $(Selector.DROPDOWN_CONTAINER).toArray();
    var len = dropdownTypeArray && dropdownTypeArray.length || 0;
    // 遍历容器元素，从缓存获取数据
    for (var i = 0; i < len; i++) {
      var item = dropdownTypeArray[i];
      var queId = item.getAttribute(ATTR.QUE_ID);
      var rootId = DropdownType._getRootId(item);
      // 缓存中对应该试题的作答数据
      var initialData = queId && talqsStorageData.cache[queId];
      if (rootId && initialData && initialData.data) {
        DropdownType._getInstance(queId, rootId, item).fillDataIntoComponent(initialData.data);
      }
    }
  };

  Object.defineProperties( DropdownType, staticAccessors );

  $(document).on(Event.CHANGE, Selector.DROPDOWN_ITEM, DropdownType._dataApiSelectHandler);
  $(document).on(TALQS_EVENT.CHANGE, DropdownType._dataInitialHandler);
})(jQuery);

/**
 * 样式类名集合
 */

var main = 'talqs';
var options = main + "_options";
var style = {
  content: (main + "_content"),

  main: main,
  options: options,
  optionsList: (options + "_list"),
  optionsRows: (options + "_rows"),
  optionsColumns: (options + "_columns"),
  optionsItem: (options + "_columns_item"),
  optionsIndex: (options + "_index"),
  optionsLabel: (options + "_label"),
  optionsContent: (options + "_content"),
  clear: 'clearfix',

  input: (main + "_blank_input"),
  
  label: (main + "_label"),
  panel: (main + "_panel"),
};

// 判断逻辑类型的相关逻辑
var logicType = 'data.logicQuesTypeId';

var isBlank = logicType + " == 4";

var isDropdown = logicType + " == 10 || " + logicType + " == 3";

var isChoice = logicType + " == 1 || " + logicType + " == 2";

/**
 * 交互版试题题干组件
 * 根据逻辑类型区分不同的交互方式
 * logicQuesTypeId:  3    多选多     下拉选择(dropdown)
 * logicQuesTypeId:  4    填空题     输入框(blank)
 * logicQuesTypeId: 10    完型填空   下拉选择(dropdown)
 */

var questionContent = ("\n  {{if data.content && !data.hideContent}}\n    <div class=\"" + (style.content) + " " + (style.clear) + "\" " + (attr.queId) + "=\"{{data.queId}}\"\n      {{if " + isBlank + " }}\n        " + (attr.type) + "=\"blank\"\n      {{ else if " + isDropdown + " }}\n        " + (attr.type) + "=\"dropdown\"\n      {{/if}}\n    >\n        {{#data.content | transfromBlankContent:data}}\n      </div>\n  {{/if}}\n");

/**
 * 交互版试题选项组件
 * logicQuesTypeId: 1  单选   data-talqs-type="choice"
 * logicQuesTypeId: 2  多选   data-talqs-type="choice"
 *
 * 需要的属性
 * data-talqs-type="choice"
 * data-que-id="{{data.queId}}"
 * data-logic-type="{{data.logicQuesTypeId}}"  
 * data-option-group="{{$index}}"
 * data-option-item="{{$value.aoVal}}"
 */

var questionOptions = ("\n{{ if data.answerOptionList && !data.isCloze && " + isChoice + " }}\n    <div class=\"" + (style.options) + "\" " + (attr.type) + "=\"choice\" " + (attr.queId) + "=\"{{data.queId}}\" " + (attr.logicType) + "=\"{{" + logicType + "}}\">\n        <ul class=\"" + (style.optionsList) + "\" " + (attr.autoLayout) + "=\"{{data.answerOptionList[0].length}}\">\n          {{each data.answerOptionList}}\n            <li class=\"" + (style.optionsRows) + "\">\n              <ul class=\"" + (style.optionsColumns) + "_{{$value.length}} " + (style.clear) + "\" " + (attr.optionGroup) + "=\"{{$index}}\">\n                {{each $value}}\n                  <li class=\"" + (style.optionsItem) + " " + (style.clear) + "\" " + (attr.optionItem) + "=\"{{$value.aoVal}}\">\n                    <span class=\"" + (style.optionsLabel) + "\">{{$value.aoVal}}. </span>\n                    <div class=\"" + (style.optionsContent) + "\">{{#$value.content}}</div>\n                  </li>\n                {{/each}}\n              </ul>\n            </li>\n          {{/each}}\n        </ul>\n    </div>\n{{/if}}");

/**
 * 交互版 我的答案组件
 */

var questionMyAnswer = ("\n  <label class=\"" + (style.label) + "\">\n    {{config.labels.myanswer}}\n  </label>\n  <div class=\"" + (style.panel) + "\">\n     {{#(data.myanswer)}}\n  </div>\n");

/**
 * 交互版模板定义
 * questionContent  试题题干
 * questionOptions  试题选项
 * questionMyAnswer 我的答案
 */
var templates = {
  questionContent: questionContent,
  questionOptions: questionOptions,
  questionMyAnswer: questionMyAnswer,
};

/**
 * [BLANK_REGEX 空格正则匹配]
 * @type {RegExp}
 */
var BLANK_REGEX = /(?:&nbsp;)*<(?:u|span\s[^>]+)>(?:&nbsp;|\s){3,}(\d*)(?:&nbsp;|\s){3,}<\/(?:u|span)>(?:&nbsp;)*/g;

/**
 * [transfromBlankContent description]
 * @return {[type]} [description]
 */
var blankType = [3, 4, 10];

var helper = {};

helper.transfromBlankContent = function(content, data) {
  var type = parseInt(data.logicQuesTypeId, 10);
  if (blankType.indexOf(type) !== -1) {
    // 空索引值
    var index = -1;
    var list;
    var output;
    // 多选多，先合并下选项的数据到一个数组
    if (type === 3) {
      list = data.answerOptionList.map(function (item) { return item[0]; });
    }
    // 内容替换
    content = content.replace(BLANK_REGEX, function(match) {
        index++;
        if (type === 4) { // 填空题
         output = "<input type=\"text\" " + (attr.blankItem) + "=\"" + index + "\" class=\"" + (style.input) + "\">";
        } else {
          list = type === 3 ? list : data.answerOptionList[index];
          var options = list.map(function (item) { return ("<option value=\"" + (item.aoVal) + "\">" + (item.content) + "</option>"); });
          output =  "\n              <span>\n                <select " + (attr.inputid) + "=\"" + index + "\">\n                  <option value></option>\n                  " + (options.join('')) + "\n                </select>\n              </span>\n          ";
        }
        return output;
    });
  }
  return content;
};

// 存储实例
// 选择型
// 填空型
// 下拉选择型
// 交互模板
// 模板辅助函数
// 注册交互版本的组件和辅助函数
var registerInteractiveTemplate = function(TalqsTemplate) {
  // 注册交互版组件
  var components = TalqsTemplate.components;
  TalqsTemplate.updateTemplateList(( obj = {}, obj[components.StemsWrapper] = {
      components: [
        {
          name: components.Content,
          template: templates.questionContent
        },
        {
          name: components.Options,
          template: templates.questionOptions
        }
      ]
    }, obj[components.AnalyzeWrapper] = {
      components: [
        {
          name: 'questionMyAnswer',
          template: templates.questionMyAnswer,
          index: 1,
        } ]
    }, obj ));
  var obj;
  // 注册 helper
  for (var key in helper) {
    TalqsTemplate.registerHelper(key, helper[key]);
  }
};

var switchInteractive = function(interactive) {
  if (interactive) {
    registerInteractiveTemplate(TalqsTemplate);
  } else {
    TalqsTemplate.resetComponent();
  }
};

var TalqsInteraction = {
  /**
   * @param {[Array/Object]} data [内置数据列表]
   * 给插件设置内置填充数据
   * data: [
   *   {
   *     queId: 'xxx',  // 试题 ID
   *     data: ["A", "B"] // 默认试题作答数据
   *   }
   * ]
   * data: {
   *   试题ID: {
   *     data: ['A']
   *   }
   * }
   */
  setData: function setData(data) {
    if (Array.isArray(data)) {
      data.forEach(function (item) {
        talqsStorageData.set(item.queId, item);
      });
    } else {
      for (var key in data) {
        talqsStorageData.set(key, data[key]);
      }
    }
    document.dispatchEvent(new Event(TALQS_EVENT.CHANGE));
  },
  /**
   * 获取作答数据，可以指定 ID 获取对应的作答数据
   * @param  {[String]} id [试题ID]
   */
  getData: function getData(id) {
    return talqsStorageData.get(id);
  },

  isInteractive: true,

  toggleInteraction: function toggleInteraction(value) {
    this.isInteractive = value !== undefined ? value : !this.isInteractive;
    switchInteractive(this.isInteractive);
  },

  init: function init() {
    this.toggleInteraction(this.isInteractive);
  },

  /**
   * 插件交互数据变更通知回调
   */
  onChange: null,

  /**
   * 默认接口配置
   */
  defaultConfig: {
    url: 'http://paperrestfz.aibeike.com/paperrest/rest/question/verifyAnswer.json',
    dataType: "jsonp",
  },

  VALIDATE_ERR: 1000,

  /**
   * 验证试题答案
   * @param  {[Object]} config [提交配置]
   * @return {[type]}        [description]
   */
  submit: function submit(data){
    var configData = data || {};
    if (configData.answer) {
      var success = configData.success;
      var error = configData.error;
      var isFn = function (fn) { return typeof fn === 'function'; };
      // 回调对象封装
      var callBack = {
        success: function success$1(result) {
          if (result.success) {
            isFn(success) && success(result.data);
          } else { // 后台报错则返回此对象，暂时定义 status 为 1000
            isFn(error) && error({message: result.message, status: this.VALIDATE_ERR });
          }
        },
        error: function error$1(err) {
          isFn(error) && error(err);
        }
      };
      // ajax 对象封装，数据，回调
      var wrapper = Object.assign(this.defaultConfig, data, callBack);
      if (wrapper.data) { 
        // 作答数据添加
        wrapper.data.content = JSON.stringify(configData.answer);
        $.ajax(wrapper);
      }
    }
  },
};

TalqsInteraction.init();

// 监听输入事件
document.addEventListener(TALQS_EVENT.INPUT, function(evt){
  var listener = TalqsInteraction.onChange;
  listener && listener.call(this, evt);
});

return TalqsInteraction;

})));
