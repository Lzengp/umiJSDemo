import { message } from 'antd';
import moment from 'moment';

export type UmiRouteComponentProps<ParamsType = {}, QueryType = {}> = {
  match: {
    isExact: boolean;
    params: ParamsType;
    path: string;
    url: string;
  };
  location: {
    pathname: string;
    hash: string;
    search: string;
    query: QueryType;
  };
};

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
export function isElementVisible(el: any) {
  const rect = el.getBoundingClientRect();
  const vWidth = window.innerWidth || document.documentElement.clientWidth;
  const vHeight = window.innerHeight || document.documentElement.clientHeight;

  return !(
    rect.right < 0 ||
    rect.bottom < 0 ||
    rect.left > vWidth ||
    rect.top > vHeight ||
    rect.top - 48 < 0 || // 当元素上面部分开始遮挡的时候
    rect.bottom > vHeight // 当元素下面部门开始遮挡的时候
  );
}

/**传入日期，获取当前日期的星期, 默认当前时间的星期 */
export function getWeek(value?: string) {
  const weekList = ['日', '一', '二', '三', '四', '五', '六'];
  const weekName = value ? weekList[new Date(value).getDay()] : weekList[new Date().getDay()];
  return '星期' + weekName;
}

/**给定一个当前日期前后时间范围数，获取前后时间之间的所有日期, 一个参数的时候 */
export const getRangeDayByRangeOneValue = (rangeValue: number) => {
  let date: Array<string> = new Array(rangeValue * 2).fill('');
  let orgValue = rangeValue;
  while(rangeValue >= 0) {
    date[orgValue - rangeValue] = moment().subtract(rangeValue, 'days').format('YYYY-MM-DD');
    date[orgValue + rangeValue] = moment().add(rangeValue, 'days').format('YYYY-MM-DD')
    rangeValue--;
  }
  return date;
}

/**给定两个当前日期前后时间范围数，获取前后时间之间的所有日期, 两个参数的时候 */
export const getRangeDayByRangeTwoValue = (frontRangeValue: number, afterRangeValue: number) => {
  const frontDate: Array<string> = [];
  const afterDate: Array<string> = [];
  while(frontRangeValue >= 0) {
    frontDate.push(moment().subtract(frontRangeValue, 'days').format('YYYY-MM-DD'));
    frontRangeValue--;
  }
  while(afterRangeValue) {
    afterDate.push(moment().add(afterRangeValue, 'days').format('YYYY-MM-DD'));
    afterRangeValue--;
  }
  return frontDate.concat(afterDate.reverse());
}

/**给定时间范围，获取范围内所有的日期 */
export function getRangeDay(startDay: string, endDay: string){
  const timeInterval = moment(endDay).diff(moment(startDay), 'days');
  let num = Math.abs(timeInterval);
  let day = startDay;
  const date: Array<string> = [];
  // 如果输入的日期反了
  if (timeInterval < 0) day = endDay;
  while(num >=0) {
    date.push(moment(day).add(num, 'days').format('YYYY-MM-DD'));
    num--;
  }
  return date.reverse();
}