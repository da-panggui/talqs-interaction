const EVENT_NAME_SAPCE = "TALQS_INTERACTION"

export const TALQS_EVENT = {
  INPUT: `${EVENT_NAME_SAPCE}_INPUT`, // 用户输入数据
  CHANGE: `${EVENT_NAME_SAPCE}_CHANGE`, // 用户初始化数据
}

// 用户作答数据更新
export const dispatchUpdateEvent = (data) => {
  const evt = new Event(TALQS_EVENT.INPUT);
  evt.data = data;
  document.dispatchEvent(evt);
}