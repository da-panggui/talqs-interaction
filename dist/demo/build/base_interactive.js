webpackJsonp([0,1],[
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * talqsInteraction v1.0.0
 * (c) 2017 JinJun He
 * @license MIT
 */
(function (global, factory) {
  ( false ? 'undefined' : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : global.TalqsInteraction = factory();
})(undefined, function () {
  'use strict';

  var talqsStorageData = function () {
    var Data = function Data() {
      this._cache = {};
    };

    var prototypeAccessors = { cache: {} };

    prototypeAccessors.cache.set = function (data) {
      var this$1 = this;

      for (var key in data) {
        this$1.set(key, data[key]);
      }
    };

    prototypeAccessors.cache.get = function () {
      return this._cache;
    };

    Data.prototype.set = function set(key, data) {
      this._cache[key] = data;
      console.log(JSON.stringify(this._cache));
    };

    Data.prototype.get = function get(key) {
      var jsonStr;
      if (key) {
        jsonStr = this._cache[key];
      } else {
        jsonStr = this._cache;
      }
      return JSON.stringify(jsonStr);
    };

    Data.prototype.remove = function remove(key) {
      delete this._cache[key];
    };

    Object.defineProperties(Data.prototype, prototypeAccessors);
    return new Data();
  }();

  // 更新缓存数据
  var UPDATE_TALQS_CACHE_EVENT = 'update_talqs_cache_event';

  /**
   * 选择型作答交互
   * 适用的题型有
   * 1. 单选      data-type: '1'
   * 2. 多选      data-type: '2'
   */
  var ChoiceTypeQuestion = function ($) {

    var NAME = 'choice';
    var VERSION = '1.0.0';
    var DATA_KEY = 'talqs.choice';
    var EVENT_KEY = "." + DATA_KEY;
    var DATA_API_KEY = '.data-api';

    var Event = {
      CLICK_DATA_API: "click" + EVENT_KEY + DATA_API_KEY,
      UPDATE_CACHE_DATA_API: UPDATE_TALQS_CACHE_EVENT
    };

    var Selector = {
      CHOICE_ITEM: '[data-option-item]',
      CHOICE_GROUP: '[data-option-group]',
      CHOICE_CONTAINER: '[data-talqs-type="choice"]'
    };

    var ATTR = {
      QUE_ID: 'data-que-id',
      LOGIC_TYPE: 'data-logic-type',
      CHOICE_ITEM: 'data-option-item',
      CHOICE_GROUP: 'data-option-group'
    };

    var ClassName = {
      ACTIVE: 'active'
    };

    var ChoiceType = function ChoiceType(queId, element, data, config) {
      this._element = element;
      this._selected = data || [];
      this._config = config;
      this._queId = queId;
    };

    var staticAccessors = { VERSION: {} };

    // getters
    staticAccessors.VERSION.get = function () {
      return VERSION;
    };

    // private
    ChoiceType.prototype._updateClassState = function _updateClassState(element, currentOption) {
      var childList = $(element).children().toArray();
      childList && childList.forEach(function (subItem) {
        var option = subItem.getAttribute(ATTR.CHOICE_ITEM);
        var contain = option === currentOption;
        if (Array.isArray(currentOption)) {
          // 如果传递的是数组，则判断是否包含
          contain = !(currentOption.indexOf(option) < 0);
        }
        $(subItem).toggleClass(ClassName.ACTIVE, contain);
      });
    };

    /**
     * [_updateStyleState 更新选中状态样式]
     * @return {[type]} [description]
     */
    ChoiceType.prototype._updateStyleState = function _updateStyleState(index) {
      var this$1 = this;

      var list = $(this._element).find(Selector.CHOICE_GROUP).toArray();
      if (this._config.clozeChoice && index !== undefined) {
        // 更新某行样式
        this._updateClassState($(list[index]), this._selected[index]);
      } else {
        // 更新整个列表样式
        list.forEach(function (item, index) {
          var data = this$1._config.clozeChoice ? this$1._selected[index] : this$1._selected;
          this$1._updateClassState($(item), data);
        });
      }
    };

    // public
    ChoiceType.prototype.updateSelectedState = function updateSelectedState(option, index) {
      index = parseInt(index, 10);
      // 完型填空类型
      if (this._config.clozeChoice) {
        this._selected[index] = this._selected[index] === option ? '' : option;
      } else {
        // 非完型填空类型
        var cindex = this._selected.indexOf(option);
        if (cindex < 0) {
          if (this._config.multipleChoice) {
            // 多选题
            this._selected.push(option);
          } else {
            this._selected = [option];
          }
        } else {
          // 移除一个选项
          this._selected.splice(cindex, 1);
        }
        // 按字母顺序排序
        this._selected.sort();
      }
      // 更新选中样式
      this._updateStyleState(index);
      // 更新缓存数据
      talqsStorageData.set(this._queId, this._selected);
    };

    // static

    /**
     * [fillDataIntoComponent 更新整个作答数据列表]
     * @param{[type]} data [作答数据]
     */
    ChoiceType.prototype.fillDataIntoComponent = function fillDataIntoComponent(data) {
      // 作答数据赋值
      this._selected = data;
      this._updateStyleState();
    };

    /**
     * [getConfig description]
     * @param{[type]} type [description]
     * @return {[type]}    [description]
     */
    ChoiceType.getConfig = function getConfig(type) {
      type = parseInt(type, 10);
      var config = {
        multipleChoice: type === 2,
        clozeChoice: type === 10
      };
      return config;
    };

    // 点击选项事件监听
    ChoiceType._dataApiClickHandler = function _dataApiClickHandler() {
      // 获取选项列表容器
      var containerElement = $(this).closest(Selector.CHOICE_CONTAINER)[0];
      // 获取此选项对应试题的 ID
      var queId = containerElement && containerElement.getAttribute(ATTR.QUE_ID);
      if (queId) {
        // 获取点选选项的数据
        var option = this.getAttribute(ATTR.CHOICE_ITEM);
        // 获取索引值
        var parent = this.parentElement;
        var index = parent && parent.getAttribute(ATTR.CHOICE_GROUP);
        // 更新选项数据
        ChoiceType._getInstance(queId, containerElement).updateSelectedState(option, index);
      }
    };

    /**
     * [_getInstance 获取一个组件实例，如果没有则初始化一个新的实例]
     * @param{[type]}     queId  [试题ID]
     * @param{[type]}     element[挂载元素]
     * @return {[ChoiceType]}        [组件实例]
     */
    ChoiceType._getInstance = function _getInstance(queId, element) {
      // 获取组件缓存
      var instance = $(element).data(DATA_KEY);
      if (!instance) {
        var type = element.getAttribute(ATTR.LOGIC_TYPE);
        var config = ChoiceType.getConfig(type);
        // 初始化组件并写入缓存
        instance = new ChoiceType(queId, element, [], config);
        $(element).data(DATA_KEY, instance);
      }
      return instance;
    };

    // 带初始化数据的初始化组件
    ChoiceType._dataInitialHandler = function _dataInitialHandler() {
      // 获取所有选择题
      var choiceTypeArray = $(Selector.CHOICE_CONTAINER).toArray();
      var len = choiceTypeArray && choiceTypeArray.length || 0;
      for (var i = 0; i < len; i++) {
        var item = choiceTypeArray[i];
        var queId = item.getAttribute(ATTR.QUE_ID);
        // 缓存中对应该试题的数据
        var initialData = talqsStorageData.cache[queId];
        if (initialData) {
          // 查看是否有初始化标记
          ChoiceType._getInstance(queId, item).fillDataIntoComponent(initialData);
        }
      }
    };

    Object.defineProperties(ChoiceType, staticAccessors);

    $(document).on(Event.CLICK_DATA_API, Selector.CHOICE_ITEM, ChoiceType._dataApiClickHandler);
    $(document).on(Event.UPDATE_CACHE_DATA_API, ChoiceType._dataInitialHandler);
  }(jQuery);

  /**
   * 填空型作答
   * 
   * 适用题型
   * 1. 填空题
   *
   * TODO: 
   * 1. 判断是否可以机器判卷
   */
  var BlankTypeQuestion = function ($) {

    var NAME = 'blank';
    var VERSION = '1.0.0';
    var DATA_KEY = 'talqs.blank';
    var EVENT_KEY = "." + DATA_KEY;
    var DATA_API_KEY = '.data-api';

    var Event = {
      KEYUP_DATA_API: "keyup" + EVENT_KEY + DATA_API_KEY,
      UPDATE_CACHE_DATA_API: UPDATE_TALQS_CACHE_EVENT
    };

    var ATTR = {
      QUE_ID: 'data-que-id',
      BLANK_ITEM: 'data-blank-item'
    };

    var Selector = {
      BLANK_ITEM: '[data-blank-item]',
      BLANK_CONTAINER: '[data-talqs-type="blank"]'
    };

    var BlankType = function BlankType(queId, element, data) {
      this._queId = queId;
      this._element = element;
      this._blankData = data || [];
    };

    var staticAccessors = { VERSION: {} };

    // getters
    staticAccessors.VERSION.get = function () {
      return VERSION;
    };

    // public

    /**
     * [updateBlankValueByIndex 更新某空的输入数据]
     * @param{[Number]} index [填空的索引值]
     * @param{[String]} value [输入的数据]
     */
    BlankType.prototype.updateBlankValueByIndex = function updateBlankValueByIndex(index, value) {
      index = parseInt(index, 10);
      if (!isNaN(index)) {
        // 更新对应空号的数据
        this._blankData[index] = value;
        // 更新缓存中的数据
        talqsStorageData.set(this._queId, this._blankData);
      }
    };

    /**
     * [fillDataIntoComponent 更新整个作答数据列表]
     * @param{[type]} data [作答数据]
     */
    BlankType.prototype.fillDataIntoComponent = function fillDataIntoComponent(data) {
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
    BlankType._dataApiInputHandler = function _dataApiInputHandler(evt) {
      // 获取挂载元素
      var containerElement = $(this).closest(Selector.BLANK_CONTAINER)[0];
      // 获取对应试题的 ID
      var queId = containerElement && containerElement.getAttribute(ATTR.QUE_ID);
      if (queId) {
        // 获取input输入值
        // 注意：输入的数据只处理首尾空格
        var value = evt.target.value;
        value = value.trim();
        evt.target.value = value;
        // 获取空号
        var index = this.getAttribute(ATTR.BLANK_ITEM);
        BlankType._getInstance(queId, containerElement).updateBlankValueByIndex(index, value);
      }
    };

    /**
     * [_getInstance 获取一个组件实例，如果没有则初始化一个新的实例]
     * @param{[type]}     queId [试题ID]
     * @param{[type]}     element [挂载元素]
     * @return {[BlankType]}        [组件实例]
     */
    BlankType._getInstance = function _getInstance(queId, element) {
      // 获取组件缓存
      var instance = $(element).data(DATA_KEY);
      if (!instance) {
        // 初始化组件并写入缓存
        instance = new BlankType(queId, element, []);
        $(element).data(DATA_KEY, instance);
      }
      return instance;
    };

    /**
     * [_dataInitialHandler 从外部更新缓存数据监听处理]
     */
    BlankType._dataInitialHandler = function _dataInitialHandler() {
      // 获取所有带填空题组件标示的容器元素
      var blankTypeArray = $(Selector.BLANK_CONTAINER).toArray();
      var len = blankTypeArray && blankTypeArray.length || 0;
      // 遍历容器元素，从缓存获取数据
      for (var i = 0; i < len; i++) {
        var item = blankTypeArray[i];
        var queId = item.getAttribute(ATTR.QUE_ID);
        // 缓存中对应该试题的作答数据
        var initialData = talqsStorageData.cache[queId];
        if (initialData) {
          BlankType._getInstance(queId, item).fillDataIntoComponent(initialData);
        }
      }
    };

    Object.defineProperties(BlankType, staticAccessors);

    $(document).on(Event.KEYUP_DATA_API, Selector.BLANK_ITEM, BlankType._dataApiInputHandler);
    $(document).on(Event.UPDATE_CACHE_DATA_API, BlankType._dataInitialHandler);
  }(jQuery);

  /**
   * [下拉选择类型作答]
   * 适用题型
   * 1. 多选多
   * 2. 完形填空
   */
  var DropdownTypeQuestion = function ($) {
    var NAME = 'dropdown';
    var VERSION = '1.0.0';
    var DATA_KEY = 'talqs.dropdown';
    var EVENT_KEY = "." + DATA_KEY;
    var DATA_API_KEY = '.data-api';

    var Event = {
      CHANGE: "change" + EVENT_KEY + DATA_API_KEY,
      UPDATE_CACHE_DATA_API: UPDATE_TALQS_CACHE_EVENT
    };

    var Selector = {
      DROPDOWN_ITEM: '[data-inputid]',
      DROPDOWN_CONTAINER: '[data-talqs-type="dropdown"]'
    };

    var ATTR = {
      QUE_ID: 'data-que-id',
      INPUTID: 'data-inputid'
    };

    var DropdownType = function DropdownType(queId, element, data) {
      this._queId = queId;
      this._element = element;
      this._selectData = data || [];
    };

    var staticAccessors = { VERSION: {} };

    // getters
    staticAccessors.VERSION.get = function () {
      return VERSION;
    };

    // public

    /**
     * [updateBlankValueByIndex 更新某空的输入数据]
     * @param{[Number]} index [填空的索引值]
     * @param{[String]} value [输入的数据]
     */
    DropdownType.prototype.updateBlankValueByIndex = function updateBlankValueByIndex(index, value) {
      index = parseInt(index, 10);
      if (!isNaN(index)) {
        // 更新对应空号的数据
        this._selectData[index] = value;
        // 更新缓存中的数据
        talqsStorageData.set(this._queId, this._selectData);
      }
    };

    /**
     * [fillDataIntoComponent 更新整个作答数据列表]
     * @param{[type]} data [作答数据]
     */
    DropdownType.prototype.fillDataIntoComponent = function fillDataIntoComponent(data) {
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
    DropdownType._dataApiSelectHandler = function _dataApiSelectHandler(evt) {
      // 获取挂载元素
      var containerElement = $(this).closest(Selector.DROPDOWN_CONTAINER)[0];
      // // 获取对应试题的 ID
      var queId = containerElement && containerElement.getAttribute(ATTR.QUE_ID);
      if (queId) {
        // 获取input输入值
        // 注意：输入的数据只处理首尾空格
        var value = evt.target.value;
        // 获取空号
        var index = this.getAttribute(ATTR.INPUTID);
        DropdownType._getInstance(queId, containerElement).updateBlankValueByIndex(index, value);
      }
    };

    /**
     * [_getInstance 获取一个组件实例，如果没有则初始化一个新的实例]
     * @param{[type]}     queId [试题ID]
     * @param{[type]}     element [挂载元素]
     * @return {[BlankType]}        [组件实例]
     */
    DropdownType._getInstance = function _getInstance(queId, element) {
      // 获取组件缓存
      var instance = $(element).data(DATA_KEY);
      if (!instance) {
        // 初始化组件并写入缓存
        instance = new DropdownType(queId, element, []);
        $(element).data(DATA_KEY, instance);
      }
      return instance;
    };

    /**
     * [_dataInitialHandler 从外部更新缓存数据监听处理]
     */
    DropdownType._dataInitialHandler = function _dataInitialHandler() {
      // 获取所有带填空题组件标示的容器元素
      var dropdownTypeArray = $(Selector.DROPDOWN_CONTAINER).toArray();
      var len = dropdownTypeArray && dropdownTypeArray.length || 0;
      // 遍历容器元素，从缓存获取数据
      for (var i = 0; i < len; i++) {
        var item = dropdownTypeArray[i];
        var queId = item.getAttribute(ATTR.QUE_ID);
        // 缓存中对应该试题的作答数据
        var initialData = talqsStorageData.cache[queId];
        if (initialData) {
          DropdownType._getInstance(queId, item).fillDataIntoComponent(initialData);
        }
      }
    };

    Object.defineProperties(DropdownType, staticAccessors);

    $(document).on(Event.CHANGE, Selector.DROPDOWN_ITEM, DropdownType._dataApiSelectHandler);
    $(document).on(Event.UPDATE_CACHE_DATA_API, DropdownType._dataInitialHandler);
  }(jQuery);

  /**
   * 交互版试题题干组件
   * 根据逻辑类型区分不同的交互方式
   * logicQuesTypeId:  3    多选多   下拉选择(dropdown)
   * logicQuesTypeId:  4    填空题   输入框(blank)
   * logicQuesTypeId: 10  完型填空   下拉选择(dropdown)
   */
  var common = "class=\"talqs_content clearfix\" data-que-id=\"{{data.queId}}\"";
  var type = "data-talqs-type";

  var questionContent = "\n  {{if data.content && !data.hideContent}}\n    <div " + common + "\n      {{if data.logicQuesTypeId == 4}}\n        " + type + "=\"blank\"\n      {{ else if data.logicQuesTypeId == 10 || data.logicQuesTypeId == 3}}\n        " + type + "=\"dropdown\"\n      {{/if}}\n    >\n        {{#data.content | transfromBlankContent:data}}\n      </div>\n  {{/if}}\n";

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

  var main = "talqs_options";

  var style = {
    main: main,
    list: main + "_list",
    rows: main + "_rows",
    columns: main + "_columns",
    item: main + "_columns_item",
    index: main + "_index",
    label: main + "_label",
    content: main + "_content",
    clear: 'clearfix'
  };

  var questionOptions = "\n{{ if data.answerOptionList && !data.isCloze}}\n    {{if data.logicQuesTypeId == 1 || data.logicQuesTypeId == 2}}\n      <div class=\"" + style.main + "\" data-talqs-type=\"choice\" data-que-id=\"{{data.queId}}\" data-logic-type=\"{{data.logicQuesTypeId}}\">\n          <ul class=\"" + style.list + "\">\n            {{each data.answerOptionList}}\n              <li class=\"" + style.rows + "\">\n                <ul class=\"" + style.columns + "_{{$value.length}} " + style.clear + "\" data-option-group=\"{{$index}}\">\n                  {{each $value}}\n                    <li class=\"" + style.item + " " + style.clear + "\" data-option-item=\"{{$value.aoVal}}\">\n                      <span class=\"" + style.label + "\">{{$value.aoVal}}. </span>\n                      <div class=\"" + style.content + "\">{{#$value.content}}</div>\n                    </li>\n                  {{/each}}\n                </ul>\n              </li>\n            {{/each}}\n          </ul>\n      </div>\n    {{/if}}\n{{/if}}";

  /**
   * 交互版模板定义
   * questionContent 试题题干
   * questionOptions 试题选项
   */
  var templates = {
    questionContent: questionContent,
    questionOptions: questionOptions
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

  helper.transfromBlankContent = function (content, data) {
    var type = parseInt(data.logicQuesTypeId, 10);
    if (blankType.indexOf(type) !== -1) {
      // 空索引值
      var index = -1;
      var list;
      var output;
      // 多选多，先合并下选项的数据到一个数组
      if (type === 3) {
        list = data.answerOptionList.map(function (item) {
          return item[0];
        });
      }
      // 内容替换
      content = content.replace(BLANK_REGEX, function (match) {
        index++;
        if (type === 4) {
          // 填空题
          output = "<input type=\"text\" data-blank-item=\"" + index + "\">";
        } else {
          list = type === 3 ? list : data.answerOptionList[index];
          var options = list.map(function (item) {
            return "<option value=\"" + item.aoVal + "\">" + item.content + "</option>";
          });
          output = "\n              <span>\n                <select data-inputid=\"" + index + "\">\n                  <option value></option>\n                  " + options.join('') + "\n                </select>\n              </span>\n          ";
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
  (function registerInteractiveTemplate(TalqsTemplate) {
    // 注册交互版组件
    TalqsTemplate.registerComponent(templates);
    // 注册 helper
    for (var key in helper) {
      TalqsTemplate.registerHelper(key, helper[key]);
    }
  })(TalqsTemplate);

  var TalqsInteraction = {
    talqsStorageData: talqsStorageData,

    setInitialData: function setInitialData(data) {
      talqsStorageData.cache = data;

      var event = new Event(UPDATE_TALQS_CACHE_EVENT);
      document.dispatchEvent(event);
    }
  };

  return TalqsInteraction;
});

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _talqsInteraction = __webpack_require__(0);

var _talqsInteraction2 = _interopRequireDefault(_talqsInteraction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var data = [];
var currentIndex = 0;
var currentId;

// 试题请求完成
var loadComplete = function loadComplete(result) {
  data = result;
  renderIndex();
  getInputData();
};

var app = document.getElementById('app');
var changeQSBtn = document.getElementById('changeQS');
var info = document.getElementById('info');
var answer = document.getElementById('answer');

// 渲染试题
var renderIndex = function renderIndex() {
  var currentData = data[currentIndex];
  currentId = currentData.queId;
  app.innerHTML = TalqsTemplate.render(currentData, { queIndex: currentIndex + 1 });
  var jsonStr = _talqsInteraction2.default.talqsStorageData.get(currentId);
  if (jsonStr) {
    _talqsInteraction2.default.setInitialData(JSON.parse(jsonStr));
  }
  info.innerHTML = '\u903B\u8F91\u7C7B\u578B\uFF1A ' + currentData.logicQuesTypeName + '\uFF0C\u903B\u8F91\u7C7B\u578BID\uFF1A ' + currentData.logicQuesTypeId;
};

// 切换下一道题
changeQSBtn.addEventListener('click', function () {
  currentIndex = currentIndex < data.length - 1 ? currentIndex + 1 : 0;
  renderIndex();
  getInputData();
});

var getInputData = function getInputData() {
  var jsonStr = _talqsInteraction2.default.talqsStorageData.get(currentId);
  answer.innerHTML = jsonStr ? jsonStr : '你还未作答此题';
};

// 获取作答数据
document.getElementById('getData').addEventListener('click', getInputData)

// 请求试题数据
;(function (cb) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '../data.json');
  xhr.send();
  xhr.onload = function () {
    cb(JSON.parse(this.responseText).data);
  };
})(loadComplete);

/***/ })
],[1]);