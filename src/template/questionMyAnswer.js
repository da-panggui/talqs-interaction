/**
 * 交互版 我的答案组件
 */

import style from './style';

export default `
  <label class="${style.label}">
    {{config.labels.myanswer}}
  </label>
  <div class="${style.panel}">
     {{#(data.myanswer&&data.myanswer.join(' ')) || config.labels.myanswerNote }}
  </div>
`
