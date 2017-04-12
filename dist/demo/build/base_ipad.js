webpackJsonp([0],{

/***/ 4:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _talqsInteraction = __webpack_require__(0);

var _talqsInteraction2 = _interopRequireDefault(_talqsInteraction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

var answer = document.getElementById('answer');

// 转为可读性高的 JSON 字符串
var readableJson = function readableJson(data) {
    return JSON.stringify(data, null, 4);
};

_talqsInteraction2.default.onChange = function (evt) {
    answer.innerHTML = '\u5B9E\u65F6\u6570\u636E\uFF0C\u7528\u4E8E\u5B9E\u65F6\u63D0\u4EA4\uFF0C\u901A\u8FC7 <code>onChange</code> \u8BA2\u9605: \n                        <pre>' + readableJson(evt.data) + '</pre>';
};

var app = document.getElementById('app');
var info = document.getElementById('info');
// 渲染试题
var renderQS = function renderQS() {
    // 当前试题数据赋值
    var currentData = data[currentIndex];
    currentId = currentData.queId;
    // 进行试题渲染
    app.innerHTML = TalqsTemplate.render(currentData, {
        queIndex: currentIndex + 1,
        hideDifficulty: true,
        hideSource: true
    });
    // 写入之前的作答缓存
    var cache = _talqsInteraction2.default.getData(currentId);
    answer.innerHTML = '';
    if (cache) {
        _talqsInteraction2.default.setData(cache);
        answer.innerHTML = '\u4E4B\u524D\u7684\u4F5C\u7B54\u8BB0\u5F55\u4E3A: ' + readableJson(cache);
    }
    info.innerHTML = '\u903B\u8F91\u7C7B\u578B\uFF1A ' + currentData.logicQuesTypeName + '\uFF0C\u903B\u8F91\u7C7B\u578BID\uFF1A ' + currentData.logicQuesTypeId;

    MathJax.Hub.Queue(['Typeset', MathJax.Hub], function () {
        // 自动布局
        TalqsTemplate.autoLayout();
    });
};

// 切换下一道题
document.getElementById('changeQS').addEventListener('click', function () {
    // 获取作答记录
    var jsonStr = _talqsInteraction2.default.getData(currentId);
    var info = (jsonStr ? '\u4F5C\u7B54\u8BB0\u5F55\u4E3A\uFF1A' + readableJson(jsonStr) : '你还未作答此题') + '，确定切换到下一题？';
    if (window.confirm(info)) {
        currentIndex = currentIndex < data.length - 1 ? currentIndex + 1 : 0;
        renderQS();
    }
});

// 获取作答数据
document.getElementById('getData').addEventListener('click', function () {
    var jsonStr = _talqsInteraction2.default.getData(currentId);
    var info = jsonStr ? readableJson(jsonStr) : '你还未作答此题';
    alert(info);
});

// 结束答题
document.getElementById('finish').addEventListener('click', function () {
    answer.innerHTML = '\u6240\u6709\u7684\u4F5C\u7B54\u8BB0\u5F55\u4E3A\uFF1A<pre>' + readableJson(_talqsInteraction2.default.getData()) + '</pre>';
});

// 检查答案
document.getElementById('validate').addEventListener('click', function () {
    _talqsInteraction2.default.submit({
        id: currentId,
        data: { // 必填参数，动态修改
            "systemSign": 0, // 系统标示
            "paperId": "2e68816e062349219a77ddaf0b7a0093", // Paper ID
            "courseId": "123", // 课程 ID
            "stuId": "123", // 学生 ID
            "chapterId": "123" },
        success: function success(json) {
            answer.innerHTML = '\u5224\u5377\u8FD4\u56DE\u7ED3\u679C\u5982\u4E0B\uFF0C1 \u4E3A\u6B63\u786E\u2705  0 \u4E3A\u9519\u8BEF\u274E\uFE0F: \n                        <pre>' + readableJson(json) + '</pre>';
        },
        error: function error(err) {
            console.log(err.status);
        }
    });
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

},[4]);