import React, { useState } from 'react';
import { QueryTable } from 'sula';

export default function BasicDemo() {
  const [tableProps, setTableProps] = useState<any>();

  const queryFields = Array(9)
    .fill(0)
    .map((_, index) => {
      return {
        name: `input${index}`,
        label: `Input${index}`,
        field: 'input',
      };
    });

  const remoteDataSource = {
    url: 'https://randomuser.me/api',
    method: 'GET',

    convertParams({ params }) {
      // 剔除对象里面为空的字段
      const filters = params?.filters || {};
      for (const key in filters) {
        if (!filters[key]) {
          delete filters[key];
        }
      }
      return {
        results: params.pageSize,
        ...filters,
      };
    },
    converter({ data, table }) {
      setTableProps(table);
      return {
        list: data.results.map((item, index) => {
          return {
            ...item,
            id: `${index}`,
            name: `${item.name.first} ${item.name.last}`,
            index,
          };
        }),
        total: 100,
      };
    },
  };

  const columns = [
    {
      title: '序号',
      key: 'index',
    },
    {
      title: '国家',
      key: 'nat',
    },
    {
      title: '名字',
      key: 'name',
      ellipsis: true,
      width: 200,
    },
    {
      title: '年龄',
      key: 'age',
      render: (ctx) => {
        return <span>{ctx.record.registered.age}</span>;
      },
    },
    {
      title: '操作',
      key: 'operation',
      // render: (ctx) => {
      //   return <a>xx</a>;
      // },
      render: [
        {
          type: 'link',
          code: 'inv:kyzdd-c:view',
          props: {
            type: 'primary',
            children: '查看', // 暂存 / 提交 查看
          },
          visible:
            '#{(record.tradeStatus === 25 || record.tradeStatus === 30) && record.mainOrderType != 20}',
          action: {
            type: 'route',
            path: '/order/mainOrder/view/#{record.orderNo}',
          },
        },

        // {
        //   confirm: '是否删除？',
        //   type: 'button',
        //   props: {
        //       type: 'link',
        //       style: { background: 'red' }
        //     // type: 'appstore',
        //   },
        //   action: [
        //     {
        //       type: 'request',
        //       url: 'https://www.mocky.io/v2/5185415ba171ea3a00704eed',
        //       method: 'POST',
        //       params: {
        //         id: '#{record.id}',
        //       },
        //       successMessage: '删除成功',
        //     },
        //     'refreshTable',
        //   ],
        // },
      ],
    },
  ];

  const actions = [
    {
      type: 'button',
      disabled: (ctx) => {
        const selectedRowKeys = ctx.table.getSelectedRowKeys();
        return !(selectedRowKeys && selectedRowKeys.length);
      },
      props: {
        type: 'primary',
        children: '批量注册',
      },
      action: [
        {
          type: 'modalform',
          title: '信息',
          resultPropName: 'modalform', // 加入results
          fields: [
            {
              name: 'name',
              label: '名称',
              field: 'input',
            },
          ],
          submit: {
            url: 'https://www.mocky.io/v2/5185415ba171ea3a00704eed',
            method: 'POST',
            convertParams: (ctx) => {
              const uuids = ctx.table.getSelectedRows().map((item) => item.login.uuid);
              return {
                ...ctx.params,
                uuids,
              };
            },
          },
        },
        (ctx) => {
          console.log('result', ctx.result);
          console.log('results', ctx.results);
        },
        'refreshTable',
      ],
    },
  ];

  const config = {
    visibleFieldsCount: 1000,
    // layout: "vertical",
    itemLayout: { span: 6 },
    columns: columns,
    remoteDataSource: remoteDataSource,
    fields: [
      // 需求： sula的form表单中，选中多选框，如果触发表单提交事件，并且查询表格
      {
        name: 'fruits',
        label: '水果',
        initialSource: [
          {
            text: '苹果 🍎',
            value: 'apple',
          },
          {
            text: '桃子 🍑',
            value: 'peach',
          },
        ],
        field: {
          type: 'checkboxgroup',
          props: {
            onChange: (e) => {
              console.log(
                e,
                tableProps.getSelectedRowKeys(),
                tableProps.getDataSource(),
                tableProps.getPaging(),
              );
              tableProps.setFilters({ fruits: e }); // 只写refreshTable是无效的，需要使用setFilters把值放到form里面去
              tableProps?.refreshTable(); // 如果不去setFilters，这里的刷新只是拿上次查询表单里面的数据去重新去查询
            },
          },
        },
      },
      // 需求：敲击键盘enter键，触发查询
      {
        name: 'inputEnter',
        label: '键盘事件',
        field: {
          type: 'input',
          props: {
            onKeyDown: (e) => {
              if (e.keyCode === 13) {
                // 键盘的Enter按键编码
                tableProps.setFilters({ inputEnter: e.target.value });
                tableProps?.refreshTable();
              }
            },
          },
        },
      },
      // 需求：写一个插件，可以实现输入enter键就可以进行查询，先实现常用的表单输入框（input、selet、data、checked）
      {
        name: 'inputCutomerPlug',
        label: '输入事件',
        field: {
          type: 'inputEnterField',
          props: {
            placeholder: '请输入',
          },
        },
      },
      {
        name: 'selectCutomerPlug',
        label: '选择事件',
        initialSource: [
          { text: '选择一', value: '1' },
          { text: '选择二', value: '2' },
          { text: '选择三', value: '3' },
        ],
        field: {
          type: 'selectEnterField',
          props: {
            placeholder: '请选择',
          },
        },
      },
      // ...queryFields,
    ],
    rowKey: 'id',
    actionsRender: [...actions],
    rowSelection: {
      selectedRowKeys: [],
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(selectedRowKeys, selectedRows);
      },
    },
  };

  return (
    <div>
      <div style={{ padding: 16, marginTop: 16 }}>
        <QueryTable {...config} />
      </div>
    </div>
  );
}
