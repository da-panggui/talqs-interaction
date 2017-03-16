/**
 * [BLANK_REGEX 空格正则匹配]
 * @type {RegExp}
 */
export const BLANK_REGEX = /(?:&nbsp;)*<(?:u|span\s[^>]+)>(?:&nbsp;|\s){3,}(\d*)(?:&nbsp;|\s){3,}<\/(?:u|span)>(?:&nbsp;)*/g;