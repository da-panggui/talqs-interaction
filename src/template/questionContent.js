/**
 * 交互版试题题干组件
 * 根据逻辑类型区分不同的交互方式
 * logicQuesTypeId:  3    多选多   下拉选择(dropdown)
 * logicQuesTypeId:  4    填空题   输入框(blank)
 * logicQuesTypeId: 10  完型填空   下拉选择(dropdown)
 */
const common = `class="talqs_content clearfix" data-que-id="{{data.queId}}"`;
const type = `data-talqs-type`;

export default `
  {{if data.content && !data.hideContent}}
    <div ${common}
      {{if data.logicQuesTypeId == 4}}
        ${type}="blank"
      {{ else if data.logicQuesTypeId == 10 || data.logicQuesTypeId == 3}}
        ${type}="dropdown"
      {{/if}}
    >
        {{#data.content | transfromBlankContent:data}}
      </div>
  {{/if}}
`
