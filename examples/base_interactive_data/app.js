import TalqsInteraction from 'talqsInteraction';

var data = [];
var currentIndex = 0;
var currentId;
var typeList = [1, 2, 4, 10];

// 试题请求完成
var loadComplete = function(result) {
    data = result.filter((item) => typeList.indexOf(parseInt(item.logicQuesTypeId, 10)) !== -1);
    renderQS();
};

var app = document.getElementById('app');
var info = document.getElementById('info');

// 设置默认数据 
// 格式为
//  {
//    试题ID: {
//      data: [] // 作答数据
//    }
//  }
var inputData = {
    "507a636aaae2498098064ae91493c78a": {
        data: ["A"]
    },
    "0ceb786a26cb40879825d3602d13747c": {
        data: ["A", "C", "D"]
    },
    "1edda836906b451086427667e0f83ada": {
        data: ['abcd']
    },
    "9f41eb9cd4b942eea86fde0747bd19ca": {
        data: ['A', '', '', '', 'D']
    }
}

// 渲染试题
var renderQS = function() {
    var currentData = data[currentIndex];
    currentId = currentData.queId;
    app.innerHTML = TalqsTemplate.render(currentData, {
        queIndex: currentIndex + 1
    });
    // 全部设置(多题模式下启用)
    // TalqsInteraction.setData(inputData);

    // 单题模式设置
    var cache = inputData[currentId];
    if (cache) { 
        TalqsInteraction.setData({[currentId] : cache});
    }
    
    info.innerHTML = `逻辑类型： ${currentData.logicQuesTypeName}，逻辑类型ID： ${currentData.logicQuesTypeId}`;
    // 自动布局
    TalqsTemplate.autoLayout();
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
