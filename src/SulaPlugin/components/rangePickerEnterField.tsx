import { DatePicker } from 'antd';

const { RangePicker } = DatePicker;

function EnterSelect(props: any) {
  const { value, disabled, onChange: propsOnChange, ctx } = props;

  /**时间控件不太适合绑定keyDown事件，因为会触发控件本身的打开选择日期面版操作 */
  const onKeyDown = (e: any) => {
    // 键盘的Enter按键编码
    if (e.keyCode === 13) {
      ctx?.table.refreshTable();
    }
  };

  /**时间控件设置为onChange事件触发查询 */
  const onChange = (e: any) => {
    console.log(e);
    ctx?.table.setFilters({ [ctx.name]: e });
    propsOnChange && propsOnChange(e);
    setTimeout(() => {
      ctx?.table.refreshTable();
    });
  };

  return (
    <RangePicker
      allowClear
      disabled={disabled}
      onChange={onChange}
      value={value}
      onKeyDown={onKeyDown}
      style={{ minWidth: '235px' }}
    />
  );
}

export default EnterSelect;
