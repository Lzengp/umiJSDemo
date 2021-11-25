import React from 'react';
import { Select as ASelect } from 'antd';
import { SelectProps as ASelectProps } from 'antd/lib/select';

export type SelectSourceItem = {
  text: any;
  value: any;
}

export interface SelectGroupItem {
  text: any;
  children: SelectSourceItem[];
}

export interface SelectProps extends ASelectProps<any> {
  source: Array<SelectSourceItem | SelectGroupItem>;
}

export default class Select extends React.Component<SelectProps> {
  renderOption = (item: SelectSourceItem) => {
    return (
      <ASelect.Option value={item.value} key={item.value}>
        {item.text}
      </ASelect.Option>
    );
  };

  renderGroupOptions = (group: SelectGroupItem) => {
    return (
      <ASelect.OptGroup key={group.text} label={group.text}>
        {(group.children as SelectSourceItem[]).map((item) => {
          return this.renderOption(item);
        })}
      </ASelect.OptGroup>
    );
  };

  innerChange = (value: any) => {
    const { onChange } = this.props as any;

    let innerValue = value;
    if (Array.isArray(value)) {
      innerValue = Object.assign([], value);
      innerValue = innerValue.join(',')
    }
    onChange(innerValue);
  }

  render() {
    const { source = [], value, mode, ...restProps } = this.props;
    return (
      <ASelect value={mode === 'multiple' ? value?.split(',') : value} mode={mode} {...restProps} onChange={this.innerChange}>
        {source.map((item) => {
          if ((item as SelectGroupItem).children) {
            return this.renderGroupOptions(item as SelectGroupItem);
          }
          return this.renderOption(item as SelectSourceItem);
        })}
      </ASelect>
    );
  }
}
