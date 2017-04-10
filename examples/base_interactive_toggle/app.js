import TalqsInteraction from 'talqsInteraction';
// 试题数据集合
var data = [];
// 当前显示的数据索引值
var currentIndex = 0;
// 当前显示试题的 ID
var currentId;
// 目前支持的题型
var typeList = [1, 2, 4, 10];

// 试题请求完成
var loadComplete = function(result) {
    // 数据筛选，只拿出目前支持交互的题型
    data = result.filter((item) => typeList.indexOf(parseInt(item.logicQuesTypeId, 10)) !== -1);
    // 试题渲染
    renderQS();
};

var app = document.getElementById('app');
var info = document.getElementById('info');

(function() {
    var talComponents = TalqsTemplate.components;
    // 更新组件列表，移除试题 ID 和知识点组件
    TalqsTemplate.updateTemplateList({
        [talComponents.AnalyzeWrapper]: {
            exclude: [talComponents.QueID, talComponents.KnowledgePoint],
        }
    });
    // 禁用交互
    TalqsInteraction.toggleInteraction(false);
}())


// 渲染试题
var renderQS = function() {
    // 当前试题数据赋值
    var currentData = data[currentIndex];
    currentId = currentData.queId;
    // 我的答案赋值
    currentData.myanswer = 'CD'

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

    info.innerHTML = `逻辑类型： ${currentData.logicQuesTypeName}，逻辑类型ID： ${currentData.logicQuesTypeId}`;

    MathJax.Hub.Queue(['Typeset', MathJax.Hub], () => {
        // 自动布局
        TalqsTemplate.autoLayout();
    });
};

// 切换下一道题
document.getElementById('changeQS').addEventListener('click', function() {
    currentIndex = currentIndex < data.length - 1 ? currentIndex + 1 : 0;
    renderQS()
})

// 请求试题数据
;
(function(cb) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '../data.json');
    xhr.send();
    xhr.onload = function() {
        cb(JSON.parse(this.responseText).data)
    }
})(loadComplete)
