/**需求：做一个可编辑表格字段sula插件
 * 功能点：
 * 1、套用在form表单中，和form表单中的rules做绑定
 * 2、可以增加必填字段校验，同时需要给出哪一行第几个是必填字段的提示信息，也支持自定义规则校验
 * 3、表格里面的框支持常见的类型，例如输入框Input、下拉框Select、日期Date等等，也支持传入自定义类型
 */
import { PlusOutlined } from '@ant-design/icons';
import { ActionType, EditableProTable, ProColumnType } from '@ant-design/pro-table';
import { Button, Input } from 'antd';
import Form from 'antd/lib/form';
import React, { useEffect, useRef, useState } from 'react';

/**编辑表格的valueType默认支持很多种类型
 * 参考官网https://procomponents.ant.design/components/schema#valuetype-%E5%88%97%E8%A1%A8
 * 常见的：text（文本框，默认的），date（日期），dateRange（日期区间），select（下拉框），radio（单选框）
 * 下拉框的数据可以动态获取，通过在columns里面配置request
 */

interface EditTableColumnsType extends ProColumnType {
  isRequired?: boolean; // 是否必填
  type?: string; // 输入框类型
}

interface EditTableFieldProps {
  rowKey?: string; // 表格的主键，默认是字段“id”
  headerTitle?: string; // 表格的标题，默认右上角
  columns: EditTableColumnsType[]; // 表格里面展示的字段
  value: any; // 数据源，form表单的value值
  onChange: (value: any) => void; // form表单的onChange事件
}

const EditTableField: React.FC<EditTableFieldProps> = (props) => {
  const {
    columns: propsColumns,
    headerTitle = '',
    rowKey = 'id',
    value = [],
    onChange: propsOnChange,
  } = props;

  console.log(value);

  const [dataSource, setDataSource] = useState<Array<any>>([...value]); // 数据源
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]); // 编辑行的key

  const [form] = Form.useForm(); // 编辑表格的form
  const actionRef = useRef<ActionType>();

  useEffect(() => {
    value.length !== dataSource.length && setDataSource([...value])
  }, [value]);

  /**表格字段 */
  const columns = propsColumns.map((item) => {
    // 通过renderFormItem 自定义字段
    return {
      formItemProps: () => ({
        // 可以通过重写formItemProps自定义校验规则
        rules: item.isRequired
          ? [{ required: item.isRequired, message: `${item.title}为必填项` }]
          : [],
      }),
      ...item,
      title: (
        <div>
          {item.isRequired && <span style={{ color: 'red', margin: '0 5px' }}>*</span>}
          {item.title}
        </div>
      ),
    };
  });

  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          actionRef.current?.addEditRecord?.({
            id: (Math.random() * 1000000).toFixed(0),
            title: '新的一行',
          });
        }}
        icon={<PlusOutlined />}
        style={{ margin: '10px 25px'}}
      >
        新建一行
      </Button>
      <EditableProTable
        rowKey={rowKey}
        headerTitle={headerTitle}
        actionRef={actionRef}
        recordCreatorProps={{
          record: () => ({ id: (Math.random() * 1000000).toFixed(0) }),
        //   position: 'top',
          creatorButtonText: '新增一行',
        }}
        columns={columns}
        value={dataSource}
        onChange={(val) => {
          setDataSource(val);
          typeof propsOnChange === 'function' && propsOnChange(val);
        }}
        editable={{
          type: 'multiple',
          form: form,
          editableKeys,
          onSave: async (rowKey, data, row) => {},
          onChange: setEditableRowKeys,
        }}
        columnEmptyText={false} // 默认展示空
      />
    </div>
  );
};

export default EditTableField;
