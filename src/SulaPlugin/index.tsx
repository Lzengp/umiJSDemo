import { registerFieldPlugin } from 'sula';
import sula from 'sula/es/core';
import InputEnterField from './components/inputEnterField';
import SelectEnterField from './components/selectEnterField';
import RangePickerEnterField from './components/rangePickerEnterField';
import CheckeboxEnterField from './components/checkeboxEnterField';
import RadioEnterField from './components/radioEnterField';
import moment from 'moment';

registerFieldPlugin('inputEnterField')(InputEnterField, true, true);
registerFieldPlugin('selectEnterField')(SelectEnterField, true, true);
registerFieldPlugin('rangePickerEnterField')(RangePickerEnterField, true, true);
registerFieldPlugin('checkeboxEnterField')(CheckeboxEnterField, true, true);
registerFieldPlugin('radioEnterField')(RadioEnterField, true, true);

/* 查询表单数据处理插件 */
sula.convertParamsType('tableConvertParamsType', (ctx, config: any) => {
  const initialParams = config.initialParams || {};
  const params = Object.assign({}, ctx.params.filters);
  // 数组对象处理
  for (const key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      let element = params[key];
      if (element && key.indexOf('*fullDate*') >= 0) {
        const dataParams = key.split('*fullDate*');
        dataParams.forEach((value, index) => {
          if (index == 0) {
            params[value] = moment(element[index]).format('YYYY-MM-DD 00:00:00');
          } else {
            params[value] = moment(element[index]).format('YYYY-MM-DD 23:59:59');
          }
        });
        delete params[key];
      } else if (element && key.indexOf('*fullOne*') >= 0) {
        const dataParams = key.split('*fullOne*');
        params[dataParams[1]] = moment(element)
          .millisecond(59)
          .second(59)
          .minute(59)
          .hour(23)
          .format('YYYY-MM-DD HH:mm:ss');
        delete params[key];
      }
    }
  }

  let finalParams = {};
  for (let key in params) {
    if (params[key] && String(params[key]).trim()) {
      finalParams[key] = params[key];
    }
  }

  // 排序动作触发
  let sorter;
  if (Object.keys(ctx.params.sorter).length) {
    if (ctx.params.sorter['order'] == 'ascend') {
      sorter = `asc-${ctx.params.sorter.columnKey}`;
    } else if (ctx.params.sorter['order'] == 'descend') {
      sorter = `desc-${ctx.params.sorter.columnKey}`;
    }
  }

  return {
    ...initialParams,
    pageSize: ctx.params.pageSize,
    currentPage: ctx.params.current,
    ...finalParams,
    sorter,
  };
});