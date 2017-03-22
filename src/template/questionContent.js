/**
 * 交互版试题题干组件
 * 根据逻辑类型区分不同的交互方式
 * logicQuesTypeId:  3    多选多     下拉选择(dropdown)
 * logicQuesTypeId:  4    填空题     输入框(blank)
 * logicQuesTypeId: 10    完型填空   下拉选择(dropdown)
 */

import style from './style';
import attr from './attr';
import {isBlank,  isDropdown } from './validate';

export default `
  {{if data.content && !data.hideContent}}
    <div class="${style.content} ${style.clear}" ${attr.queId}="{{data.queId}}"
      {{if ${isBlank} }}
        ${attr.type}="blank"
      {{ else if ${isDropdown} }}
        ${attr.type}="dropdown"
      {{/if}}
    >
        {{#data.content | transfromBlankContent:data}}
      </div>
  {{/if}}
`
