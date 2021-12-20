// import React from 'react';
import { Input } from 'antd';

// interface EnterInputProps extends React.FunctionComponent {
//   value?: string; // 值
//   placeholder?: string; // 提示信息
//   disabled?: boolean; // 禁用
//   onChange?: (value: any) => void; // 输入框改变事件
// }

function EnterInput(props: any) {
  // props如果是EnterInputProps类型，在注册插件的时候提示警告
  const { value, placeholder, disabled, onChange: propsOnChange, ctx } = props;

  const onKeyDown = (e: any) => {
    // 键盘的Enter按键编码
    if (e.keyCode === 13) {
      ctx?.table.refreshTable();
    }
  };

  /**onChange的时候需要手动setFilters,不然其他输入框触发onKeyDown无法拿到当前输入框的值 */
  const onChange = (e: any) => {
    ctx?.table.setFilters({ [ctx.name]: e.target.value });
    propsOnChange && propsOnChange(e);
  };

  return (
    <Input
      allowClear={true}
      placeholder={placeholder}
      onChange={onChange}
      value={value}
      disabled={disabled}
      onKeyDown={onKeyDown}
    />
  );
}

export default EnterInput;
