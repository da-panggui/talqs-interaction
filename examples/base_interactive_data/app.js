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
// 格式为两者之一即可
//  {
//    试题ID: {
//      data: [] // 作答数据
//    }
//  }
//  或者
//  [
//    {
//      queId: 试题ID,
//      data: [] // 作答数据
//    }
//  ]
var inputData = {
    "8aac49074ed448ae014ef9036d300196": {
        data: ["A"]
    },
    "2ef895a3fd0f46a0bb944f6b1983e90f": {
        data: ["A"]
    },
    "2c17e91fb0bd43d78eb55c2f84faa963": {
        data: ['2']
    },
    "b6bda1c008e94d8681a6debdadb9027f": {
        data: ['4']
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
        TalqsInteraction.setData({[currentId]: cache});
    }
    
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
