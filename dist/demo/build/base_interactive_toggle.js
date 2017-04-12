webpackJsonp([1],{

/***/ 3:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _talqsInteraction = __webpack_require__(0);

var _talqsInteraction2 = _interopRequireDefault(_talqsInteraction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// 试题数据集合
var data = [];
// 当前显示的数据索引值
var currentIndex = 0;
// 当前显示试题的 ID
var currentId;
// 目前支持的题型
var typeList = [1, 2, 4, 10];

// 试题请求完成
var loadComplete = function loadComplete(result) {
    // 数据筛选，只拿出目前支持交互的题型
    data = result.filter(function (item) {
        return typeList.indexOf(parseInt(item.logicQuesTypeId, 10)) !== -1;
    });
    // 试题渲染
    renderQS();
};

var app = document.getElementById('app');
var info = document.getElementById('info');

(function () {
    var talComponents = TalqsTemplate.components;
    // 更新组件列表，移除试题 ID 和知识点组件
    TalqsTemplate.updateTemplateList(_defineProperty({}, talComponents.AnalyzeWrapper, {
        exclude: [talComponents.QueID, talComponents.KnowledgePoint]
    }));
    // 禁用交互
    _talqsInteraction2.default.toggleInteraction(false);
})();

// 渲染试题
var renderQS = function renderQS() {
    // 当前试题数据赋值
    var currentData = data[currentIndex];
    currentId = currentData.queId;
    // 我的答案赋值
    currentData.myanswer = 'CD';

    // 进行试题渲染
    app.innerHTML = TalqsTemplate.render(currentData, {
        queIndex: currentIndex + 1,
        hideDifficulty: true,
        hideSource: true,
        analyzeVersion: 2,
        labels: {
            myanswer: '我的答案', // 
            answer: '正确答案', // 正确答案显示文案
            analyze: '试题详解' // 
        }
    });

    info.innerHTML = '\u903B\u8F91\u7C7B\u578B\uFF1A ' + currentData.logicQuesTypeName + '\uFF0C\u903B\u8F91\u7C7B\u578BID\uFF1A ' + currentData.logicQuesTypeId;

    MathJax.Hub.Queue(['Typeset', MathJax.Hub], function () {
        // 自动布局
        TalqsTemplate.autoLayout();
    });
};

// 切换下一道题
document.getElementById('changeQS').addEventListener('click', function () {
    currentIndex = currentIndex < data.length - 1 ? currentIndex + 1 : 0;
    renderQS();
})

// 请求试题数据
;
(function (cb) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '../data.json');
    xhr.send();
    xhr.onload = function () {
        cb(JSON.parse(this.responseText).data);
    };
})(loadComplete);

/***/ })

},[3]);