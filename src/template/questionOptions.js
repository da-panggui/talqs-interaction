/**
 * 交互版试题选项组件
 * logicQuesTypeId: 1  单选   data-talqs-type="choice"
 * logicQuesTypeId: 2  多选   data-talqs-type="choice"
 *
 * 需要的属性
 * data-talqs-type="choice"
 * data-que-id="{{data.queId}}"
 * data-logic-type="{{data.logicQuesTypeId}}"  
 * data-option-group="{{$index}}"
 * data-option-item="{{$value.aoVal}}"
 */

import style from './style';
import attr from './attr';
import { isChoice, logicType } from './validate'

export default
`
{{ if data.answerOptionList && !data.isCloze && ${isChoice} }}
    <div class="${style.options}" ${attr.type}="choice" ${attr.queId}="{{data.queId}}" ${attr.logicType}="{{${logicType}}}">
        <ul class="${style.optionsList}" ${attr.autoLayout}="{{data.answerOptionList[0].length}}">
          {{each data.answerOptionList}}
            <li class="${style.optionsRows}">
              <ul class="${style.optionsColumns}_{{$value.length}} ${style.clear}" ${attr.optionGroup}="{{$index}}">
                {{each $value}}
                  <li class="${style.optionsItem} ${style.clear}" ${attr.optionItem}="{{$value.aoVal}}">
                    <span class="${style.optionsLabel}">{{$value.aoVal}}. </span>
                    <div class="${style.optionsContent}">{{#$value.content}}</div>
                  </li>
                {{/each}}
              </ul>
            </li>
          {{/each}}
        </ul>
    </div>
{{/if}}`
