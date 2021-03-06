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
export function getWeek(value?: string, needDefault: boolean = false) {
  const weekList = ['日', '一', '二', '三', '四', '五', '六'];
  const weekName = value ? weekList[new Date(value).getDay()] : needDefault ? weekList[new Date().getDay()] : '';
  return weekName ? '星期' + weekName : '';
}

/**给定一个当前日期前后时间范围数，获取前后时间之间的所有日期, 一个参数的时候 */
export const getRangeDayByRangeOneValue = (rangeValue: number, day?: string) => {
  let date: Array<string> = new Array(rangeValue * 2).fill('');
  let orgValue = rangeValue;
  while(rangeValue >= 0) {
    date[orgValue - rangeValue] = moment(day).subtract(rangeValue, 'days').format('YYYY-MM-DD');
    date[orgValue + rangeValue] = moment(day).add(rangeValue, 'days').format('YYYY-MM-DD')
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

export const fn = (val: number) => {
  let n: number = 5;
  let resArr: Array<number> = [];
  while(n >= 1){
    const res = parseInt(((val % Math.pow(10,n)) / Math.pow(10, n - 1)).toString()) 
    if (res) {
      resArr = [...resArr, res, Math.pow(10, n - 1)]
    } else {
      resArr = [...resArr, res]
    }
    n--;
  }
  console.log(resArr)
}

/**
 * 传入秒，返回时间格式
 * @param maxTime 时间/秒，例如：30
 * @returns 返回时间格式字符串，例如：00:30
 */
export const getTimeStrBySec = (maxTime: number) => {
  const second = Math.floor(maxTime % 60).toString();
  const minute = Math.floor(maxTime / 60).toString();
  return `${minute.length == 1 ? `0${minute}` : minute}:${second.length == 1 ? `0${second}` : second}`
}

const letters = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G',
  'H', 'I', 'J', 'K', 'L', 'M', 'N',
  'O', 'P', 'Q', 'R', 'S', 'T',
  'U', 'V', 'W', 'X', 'Y', 'Z'
];

/**
 * 数字转换成字符，A-Z AA-AZ BA-BZ...
 * @param num 传入的数子
 * @returns 0 -> A 1->B 26->AA
 */
export const transformNumToLetter = function (num: number) {
  let letter = "";
  let loopNum = parseInt((num / 26).toString());
  if(loopNum>0){
      letter += transformNumToLetter(loopNum-1);
  }
  letter += letters[num%26];
  return letter;
};

/**
 * 字符转换成数字
 * @param letter 传入的字符
 * @returns A -> 0 B -> 1 AA -> 26
 */
 export const transformLetterToNum = function (str: string) {
  let num = 0;
  const letterArr = str.split('');
  letterArr.map((letter, index) => {
    const letterIndex = letters.findIndex(item => item == letter)
    num += index * 26 + letterIndex;
  })
  return num;
};