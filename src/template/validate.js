// 判断逻辑类型的相关逻辑
export const logicType = 'data.logicQuesTypeId';

export const isBlank = `${logicType} == 4`;

export const isDropdown = `${logicType} == 10 || ${logicType} == 3`;

export const isChoice = `${logicType} == 1 || ${logicType} == 2`