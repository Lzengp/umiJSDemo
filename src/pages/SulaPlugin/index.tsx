import sula from 'sula/es/core';
import { registerRenderPlugin, registerFieldPlugin, registerActionPlugin, request } from 'sula';
import BsSelect from './components/BsSelect';


/**
 * registerRenderPlugin: 节点
 * registerFieldPlugin：字段
 * registerActionPlugin： 操作
 */

// 订单成本明细查询头部展示
registerRenderPlugin('tableRowSelect_showCostDetail')(({ ctx, config }) => {

  return (
    <div style={{ marginLeft: '8px' }}>
   
      <span
        style={{ padding: '5px', color: '#E82D1E', cursor: 'pointer' }}
        onClick={() => ctx.table.clearRowSelection()}
      >
        清除
      </span>
    </div>
  );
}, true);

/**@ts-ignore */
registerFieldPlugin('bs-select')(BsSelect, true, true);



/**批量删除 */
registerActionPlugin('delete-batch', async (ctx: any, config: any) => {
    const {
      requestCfg: { url, method },
    } = config;
    const {
      table: { getSelectedRowKeys },
    } = ctx;
    const querys = getSelectedRowKeys().join(',');
    let res = await request({
      url: url + querys,
      method,
      successMessage: '删除成功',
    });
  });
  

sula.converterType('tableToSlectConvertType', (ctx: any, config: any) => {
  let convertData = [];

  if (ctx.data.list) {
    convertData = ctx.data?.list;
  } else {
    convertData = ctx.data;
  }

  const returnValue = convertData.map((item: any) =>
    config.mappingCustomerProperty
      ? {
          ...item,
          text: item[config.mappingTextField],
          value: item[config.mappingValueField],
          [config.mappingCustomerProperty]: item[config.mappingCustomerValue],
        }
      : {
          ...item,
          text: item[config.mappingTextField],
          value: item[config.mappingValueField],
        },
  );

  return returnValue || [];
});
