# API 参考

### TalqsInteraction 方法

- **`setData(data: Object)`**

  将作答数据传入 TalqsInteraction

  `data`    作答数据
  
  `data` 的数据格式为:

  试题 ID 为键，作答数据为值，类似：

  ```js
  { 
    id: { 
      data: ["A", "B", ...]
    }
  }

  data 数组中 '' 表示未答题

  ```
    
- **`getData(id)`**

  从 TalqsInteraction 获取作答数据

  `id`    试题ID

  试题 id 为空则返回所有作答数据
  
  ```js
  { 
    id: { 
      data: ["A", "B", ...],
      rootId: '大题ID',
      queId: '试题ID',
      type: "choice/blank/dropdown", // 交互类型
      blankNum: '作答空数量', // 完形填空 和 填空专用
      multiple: true/false, //单选或者多选标示，选择类型特有
    }
  }

  data 数组中 '' 表示未答题

  ```

### TalqsInteraction 事件

- **`onChange`**

  用户输入数据变化监听方法

  ```js
    TalqsInteraction.onChange = function(evt) { 
      console.log(evt.data) // 单题最新用户作答数据
    }
  ```





  