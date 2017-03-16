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

const main = `talqs_options`

const style = {
  main,
  list: `${main}_list`,
  rows: `${main}_rows`,
  columns: `${main}_columns`,
  item: `${main}_columns_item`,
  index: `${main}_index`,
  label: `${main}_label`,
  content: `${main}_content`,
  clear: 'clearfix'
}


export default
`
{{ if data.answerOptionList && !data.isCloze}}
    {{if data.logicQuesTypeId == 1 || data.logicQuesTypeId == 2}}
      <div class="${style.main}" data-talqs-type="choice" data-que-id="{{data.queId}}" data-logic-type="{{data.logicQuesTypeId}}">
          <ul class="${style.list}">
            {{each data.answerOptionList}}
              <li class="${style.rows}">
                <ul class="${style.columns}_{{$value.length}} ${style.clear}" data-option-group="{{$index}}">
                  {{each $value}}
                    <li class="${style.item} ${style.clear}" data-option-item="{{$value.aoVal}}">
                      <span class="${style.label}">{{$value.aoVal}}. </span>
                      <div class="${style.content}">{{#$value.content}}</div>
                    </li>
                  {{/each}}
                </ul>
              </li>
            {{/each}}
          </ul>
      </div>
    {{/if}}
{{/if}}`
