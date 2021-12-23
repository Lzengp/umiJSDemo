import { Radio } from 'antd';

function RadioEnterField(props: any) {
  const { value, onChange: propsOnChange, ctx } = props;

  /**重新组装数据 */
  const options = ctx?.source.map((item: { value: string | number; text: string }) => {
    return {
      label: item.text,
      value: item.value,
    };
  });

  /**onChange的时候需要手动setFilters, 不然refreshTable无法拿到其值，并且单选框没有KeyDown事件 */
  const onChange = (e: any) => {
    console.log(e)
    ctx?.table.setFilters({ [ctx.name]: e.target.value });
    propsOnChange && propsOnChange(e.target.value);
    setTimeout(() => {
      ctx?.table.refreshTable();
    });
  };

  return (
    <Radio.Group
      options={options}
      onChange={onChange}
      value={value}
    />
  );
}

export default RadioEnterField;
