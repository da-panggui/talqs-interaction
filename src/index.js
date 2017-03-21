// 存储实例
import talqsStorageData from './data/data';
// 选择型
import choiceType from './question/choiceType';
// 填空型
import blankType from './question/blankType';
// 下拉选择型
import dropdownType from './question/dropdownType';
// 交互模板
import templates from './template/index';
// 模板辅助函数
import helper from './helper/index';

import { UPDATE_TALQS_CACHE_EVENT } from './events/index';

// 注册交互版本的组件和辅助函数
(function registerInteractiveTemplate(TalqsTemplate){
  // 注册交互版组件
  let components = TalqsTemplate.components;
  TalqsTemplate.updateTemplateList({
    [components.StemsWrapper]: {
      components: [
        {
          name: components.Content,
          template: templates.questionContent
        },
        {
          name: components.Options,
          template: templates.questionOptions
        }
      ]
    }
  });
  // 注册 helper
  for (let key in helper) {
    TalqsTemplate.registerHelper(key, helper[key]);
  }
})(TalqsTemplate)


const TalqsInteraction = {
  setData(data) {
    for (let key in data) {
      talqsStorageData.set(key, data[key]);
    }
    document.dispatchEvent(new Event(UPDATE_TALQS_CACHE_EVENT));
  },
  getData(id) {
    return talqsStorageData.get(id);
  }
}

export default TalqsInteraction;

