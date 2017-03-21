// 更新缓存数据
export const UPDATE_TALQS_CACHE_EVENT = 'update_talqs_cache_event';

// 用户作答数据更新
export const dispatchUpdateEvent = (data) => {
  const evt = new Event('UPDATE_TALQS_DATA');
  evt.data = data;
  document.dispatchEvent(evt);
}