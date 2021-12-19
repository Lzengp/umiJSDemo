import React from 'react';
import { Input } from 'antd';

interface EnterInputProps extends React.FunctionComponent {
  value?: string; // 值
  placeholder?: string; // 提示信息
  disabled?: boolean; // 禁用
  onChange?: (value: any) => void; // 输入框改变事件
}

function EnterInput(props: any) {
  // props如果是EnterInputProps类型，在注册插件的时候提示警告
  const { value, placeholder, disabled, onChange, ctx } = props;

  const onKeyDown = (e: any) => {
    if (e.keyCode === 13) {
      // 键盘的Enter按键编码
      ctx?.table.setFilters({ inputEnter: e.target.value });
      ctx?.table.refreshTable();
    }
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
