import { message } from 'antd';

export const uuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const isCustomArray = (value: any) => {
  return value && Array.isArray(value) && value.length;
};

export function requiredRule(msg: string = '该项为必填项', required: boolean = true) {
  return [{ required, message: msg }];
}

/**复制文本 */
export function copyText(text: string, msg?: string) {
  let transfer = document.createElement('input');
  document.body.appendChild(transfer);
  transfer.value = text;
  transfer.focus();
  transfer.select();
  if (document.execCommand('copy')) {
    document.execCommand('copy');
  }
  transfer.blur();
  document.body.removeChild(transfer);
  message.success(msg ? msg : '复制成功');
}

/**标红展示选择字段 */
export function brightenKeyWord(val: string, keyword: string) {
  const Reg = new RegExp(keyword, 'g');
  let res = '';
  if (val && keyword) {
    res = val.replace(Reg, `<span style="color: red">${keyword}</span>`);
    return res;
  }
  return val;
}

/**判断当前元素是否在视窗内 */
export function isInViewPortOfOne(el: any) {
  // viewPortHeight 兼容所有浏览器写法
  const viewPortHeight =
    window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  const offsetTop = el.offsetTop;
  const scrollTop = document.documentElement.scrollTop;
  return offsetTop - scrollTop <= viewPortHeight;
}
