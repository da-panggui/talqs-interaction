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
  TalqsTemplate.registerComponent(templates);
  // 注册 helper
  for (let key in helper) {
    TalqsTemplate.registerHelper(key, helper[key]);
  }
})(TalqsTemplate)


const TalqsInteraction = {
  talqsStorageData,

  setInitialData(data) {
    talqsStorageData.cache = data;

    const event = new Event(UPDATE_TALQS_CACHE_EVENT) 
    document.dispatchEvent(event);
    
  }
}

export default TalqsInteraction;

