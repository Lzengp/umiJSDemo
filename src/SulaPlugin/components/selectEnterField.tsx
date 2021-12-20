import { Select } from 'antd';

function EnterSelect(props: any) {
  // props如果是EnterInputProps类型，在注册插件的时候提示警告
  const { value, placeholder, disabled, onChange: propsOnChange, ctx } = props;

  console.log(ctx);

  const onKeyDown = (e: any) => {
    console.log(e);
    // 键盘的Enter按键编码
    if (e.keyCode === 13) {
      ctx?.table.refreshTable();
    }
  };

  /**onChange的时候需要手动setFilters,不然其他输入框触发onKeyDown无法拿到当前输入框的值 */
  const onChange = (e: any) => {
    console.log(e);
    ctx?.table.setFilters({ [ctx.name]: e });
    propsOnChange && propsOnChange(e);
  };

  return (
    <Select
      showSearch
      allowClear
      filterOption={(input, option) =>
        option?.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
      onChange={onChange}
      value={value}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      disabled={disabled}
    >
      {ctx?.source.map((item: { value: string | number; text: string }) => (
        <Select.Option value={item.value} key={item.value}>
          {item.text}
        </Select.Option>
      ))}
    </Select>
  );
}

export default EnterSelect;
