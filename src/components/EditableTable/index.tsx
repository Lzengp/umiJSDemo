import { ProFormSelect } from '@ant-design/pro-form';
import { EditableProTable, ProColumns } from '@ant-design/pro-table';
import { Form } from 'antd';
import React, { useState } from 'react';

interface EditableTableProps {}

interface DataSourceType {
  id: React.Key;
  type?: string;
  state?: string;
}

const TYPE = {
  demand: '需求',
  task: '任务',
};

const demandState = [
  { value: '1', label: '需求一' },
  { value: '2', label: '需求二' },
  { value: '3', label: '需求三' },
];

const taskState = [
  { value: 'open', label: '开始' },
  { value: 'closed', label: '关闭' },
  { value: 'waiting', label: '等待' },
];

const defaultData: DataSourceType[] = [
  {
    id: '1234567890',
    type: 'demand',
    state: '1',
  },
  {
    id: '1234567891',
    type: 'task',
    state: 'closed',
  },
];

function EditableTable(props: EditableTableProps) {
  const {} = props;

  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<DataSourceType[]>([]);
  const [form] = Form.useForm();

  const RenderFromSelect = (props: any) => {
    return (
      <ProFormSelect
        {...props}
        fieldProps={{
          onChange: (val) => {
            if (props.name.indexOf('type') > -1) {
              const values = form.getFieldsValue();
              form.setFieldsValue({
                [props.recordKey]: { state: '', type: values[props.name] },
                [`${props.recordKey}_state`]: '',
              });
            }
            props.onChange && props.onChange(val);
          },
        }}
      />
    );
  };

  const columns: ProColumns<DataSourceType>[] = [
    {
      title: '类型',
      dataIndex: 'type',
      renderFormItem: (_, config, form) => {
        return (
          <RenderFromSelect
            recordKey={config.recordKey}
            name={`${config.recordKey}_type`}
            options={[
              { value: 'task', label: '任务' },
              { value: 'demand', label: '需求' },
            ]}
          />
        );
      },
      render: (text, row, index) => {
        /**@ts-ignore */
        return TYPE[text];
      },
      formItemProps: () => ({ rules: [{ required: true, message: '此项为必填项' }] }),
    },
    {
      title: '状态',
      key: 'state',
      dataIndex: 'state',
      renderFormItem: (_, config, form) => {
        let options: any[] = [];
        if (config.record?.type === 'task') {
          options = taskState;
        }
        if (config.record?.type === 'demand') {
          options = demandState;
        }
        return <RenderFromSelect name={`${config.recordKey}_state`} options={options} />;
      },
      render: (text, row, index) => {
        let options: any[] = [];
        if (row.type === 'task') {
          options = taskState;
        }
        if (row.type === 'demand') {
          options = demandState;
        }
        const showTextObj = options?.find((n) => n.value === text);
        return showTextObj.label;
      },
      formItemProps: (form, { rowIndex }) => {
        return {
          rules: [{ required: true, message: '此项为必填项' }],
        };
      },
    },
    {
      title: '操作',
      valueType: 'option',
      width: 200,
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id);
          }}
        >
          编辑
        </a>,
        <a
          key="delete"
          onClick={() => {
            setDataSource(dataSource.filter((item) => item.id !== record.id));
          }}
        >
          删除
        </a>,
      ],
    },
  ];

  return (
    <>
      <EditableProTable<DataSourceType>
        rowKey="id"
        headerTitle="可编辑表格+表单联动效果"
        recordCreatorProps={{
          record: () => ({ id: (Math.random() * 1000000).toFixed(0) }),
        }}
        columns={columns}
        request={async () => ({
          data: defaultData,
          total: 3,
          success: true,
        })}
        value={dataSource}
        onChange={(val) => {
          setDataSource(val);
        }}
        editable={{
          form: form,
          editableKeys,
          onSave: async (rowKey, data, row) => {},
          onChange: setEditableRowKeys,
        }}
      />
    </>
  );
}

export default EditableTable;
