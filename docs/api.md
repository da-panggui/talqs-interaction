# API 参考

### TalqsInteraction 方法

- **`setData(data: Object)`**

  将作答数据传入 TalqsInteraction

  `data`    作答数据
  
  `data` 的数据格式为:

  试题 ID 为键，作答数据为值，类似：

  ```js
  { 
    id1: ['A'], // 单选题
    id2: ['A', 'D'], // 多选题
    id3: ['A', 'D', 'C', 'E', '', ], // 多选多
    id4: ['这是一道填空题'], // 填空题
    id5: ['A', 'A', '', '' ], // 完型填空
  }

  '' 表示未答题

  ```
    

- **`getData(id)`**

  从 TalqsInteraction 获取作答数据

  `id`    试题ID

  试题 id 为空则返回所有作答数据


  
### TalqsInteraction 属性




  