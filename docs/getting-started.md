# 快速上手

## 1. 引入依赖

``` html
<script src="jQuery.js"></script>
<script src="talqsTemplate.js"></script>
<link href="talqsTemplate.css" rel="stylesheet">
```

## 2. 引入 TalqsInteraction
``` html
<script src="talqsInteraction.js"></script>
```

## 3. 用 TalqsTemplate 进行试题渲染
> 关于 TalqsTemplate 的配置和用法详情请参考[文档](https://hejinjun.github.io/talqs-template/)

```js
var questionHTMLStr = TalqsTemplate.render({question, options});
```

## 4. 填充到指定的 DOM
```js
document.getElementById('app').innerHTML = questionHTMLStr;
```

## 5. 进行作答交互

## 6. 获取作答数据
```js
var queId = '...' // 试题ID
TalqsInteraction.getData(queId)
```