/**
 * [transfromBlankContent description]
 * @return {[type]} [description]
 */
import { BLANK_REGEX } from '../regex/index';

import attr from '../template/attr';

import style from '../template/style';

const blankType = [3, 4, 10];

const helper = {};

helper.transfromBlankContent = function(content, data) {
  const type = parseInt(data.logicQuesTypeId, 10);
  if (blankType.indexOf(type) !== -1) {
    // 空索引值
    let index = -1;
    let list;
    let output;
    // 多选多，先合并下选项的数据到一个数组
    if (type === 3) {
      list = data.answerOptionList.map((item) => item[0]);
    }
    // 内容替换
    content = content.replace(BLANK_REGEX, function(match) {
        index++;
        if (type === 4) { // 填空题
         output = `<input type="text" ${attr.blankItem}="${index}" class="${style.input}">`
        } else {
          list = type === 3 ? list : data.answerOptionList[index];
          const options = list.map((item) => `<option value="${item.aoVal}">${item.content}</option>`);
          output =  `
              <span>
                <select ${attr.inputid}="${index}">
                  <option value></option>
                  ${options.join('')}
                </select>
              </span>
          `
        }
        return output;
    })
  }
  return content;
}

export default helper;