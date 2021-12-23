import { Checkbox } from 'antd';
import { useEffect, useState } from 'react';

function CheckeboxEnterField(props: any) {
  const { value: propsValue, defaultValue, disabled, onChange: propsOnChange, ctx } = props;
  const [indeterminate, setIndeterminate] = useState<any>(); // 部分选中
  const [checkAll, setCheckAll] = useState<any>(); // 全选
  const [checkedList, setCheckedList] = useState(propsValue); // 当前选中的数据

  /**重新组装数据，为了规范化，初始数据默认是{ text: '', value: '' }格式，但是Checkbox需要{ label: '', value: '' }格式 */
  const options = ctx?.source.map((item: { value: string | number; text: string }) => {
    return {
      label: item.text,
      value: item.value,
    };
  });

  /**onChange的时候需要手动setFilters, 不然refreshTable无法拿到其值，并且多选框没有KeyDown事件 */
  const onChange = (e: any) => {
    // 需要设置全选、部分选中状态
    setCheckedList(e);
    setIndeterminate(!!e.length && e.length < options.length);
    setCheckAll(e.length === options.length);
  };

  /**全选按钮change事件 */
  const onCheckAllChange = (e: any) => {
    setCheckedList(
      e.target.checked
        ? options.map((item: { value: string | number; text: string }) => item.value)
        : [],
    );
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  /**处理table查询事件 */
  useEffect(() => {
    if (checkedList && checkedList instanceof Array) {
      ctx?.table.setFilters({ [ctx.name]: checkedList });
      propsOnChange && propsOnChange(checkedList);
      setTimeout(() => {
        ctx?.table.refreshTable();
      });
    }
  }, [checkedList]);

  return (
    <>
      <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
        全选
      </Checkbox>
      <Checkbox.Group
        options={options}
        disabled={disabled}
        defaultValue={defaultValue}
        onChange={onChange}
        value={checkedList}
      />
    </>
  );
}

export default CheckeboxEnterField;
