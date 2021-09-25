import { CheckOutlined, DownOutlined } from '@ant-design/icons';
import { Dropdown, Select } from 'antd';
import React, {
  useEffect,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from 'react';
import styles from './index.less';

interface Props {}

const typeSelectData = [
  { value: '1', label: '按泳道', isSelected: true },
  { value: '2', label: '按状态', isSelected: false },
];

const detailedSelectData = [
  { value: '3', label: '所有任务', isSelected: true },
  { value: '4', label: '仅父任务', isSelected: false },
  { value: '5', label: '仅子任务', isSelected: false },
];

interface selectDataProps {
  value: string;
  label: string;
  isSelected: boolean;
}

function componentName(props: Props, ref: any) {
  const {} = props;
  const [typeSelectList, setTypeSelectList] = useState<selectDataProps[]>(typeSelectData);
  const [detailedSelectList, setDetailedSelectList] =
    useState<selectDataProps[]>(detailedSelectData);
  const [visible, setVisible] = useState<boolean>(false);
  const [viewType, setViewType] = useState<string>('table');

  useImperativeHandle(ref, () => ({}));

  const changeSelect = useCallback(
    (value, flag) => {
      if (flag === 'type') {
        const data = [...typeSelectList];
        data.forEach((item) => {
          console.log(item.value, value);
          if (item.value === value) {
            item.isSelected = true;
          } else {
            item.isSelected = false;
          }
        });
        setTypeSelectList(data);
        setVisible(false);
      }
      if (flag === 'task') {
        const data = [...detailedSelectList];
        data.forEach((item) => {
          if (item.value === value) {
            item.isSelected = true;
          } else {
            item.isSelected = false;
          }
        });
        setDetailedSelectList(data);
        setVisible(false);
      }
    },
    [typeSelectList, detailedSelectList],
  );

  const content = useMemo(
    () => (
      <div className={styles.kanbanDropdown}>
        <ul className={styles.kanbanDropdownUl}>
          <li className={styles.tableShow} onClick={() => setViewType('table')}>
            表格视图
          </li>
          {typeSelectList.map((item) => (
            <li key={item.value} onClick={() => changeSelect(item.value, 'type')}>
              {item.label}
              {item.isSelected ? <CheckOutlined /> : null}
            </li>
          ))}
          <div className={styles.splitLine} />
          {detailedSelectList.map((item, index) => (
            <li key={item.value} onClick={() => changeSelect(item.value, 'task')}>
              {item.label}
              {item.isSelected ? <CheckOutlined /> : null}
            </li>
          ))}
        </ul>
      </div>
    ),
    [typeSelectList, detailedSelectList],
  );

  const kanbanSelect = useMemo(
    () => (
      <Dropdown
        overlay={content}
        trigger={['click']}
        visible={visible}
        onVisibleChange={setVisible}
      >
        <div className={styles.kanbanSelect} onClick={() => setVisible(true)}>
          看板视图
          <DownOutlined />
        </div>
      </Dropdown>
    ),
    [visible, typeSelectList, detailedSelectList],
  );

  const tableSelect = useMemo(
    () => (
      <Select value={viewType} onChange={setViewType} bordered={false}>
        <Select.Option value="table">列表视图</Select.Option>
        <Select.Option value="kanban">看板视图</Select.Option>
      </Select>
    ),
    [],
  );

  return (
    <>
      <div style={{ fontSize: 16 }}>自定义下拉框</div>
      {viewType === 'kanban' ? (
        <div className={styles.kanbanView}>
          {kanbanSelect}
          <div>看板kanban目前选择的：</div>
          <div>{typeSelectList.find((item) => item.isSelected)?.label}</div>
          <div>{detailedSelectList.find((item) => item.isSelected)?.label}</div>
        </div>
      ) : (
        <div>
          {tableSelect}
          <div>列表table</div>
        </div>
      )}
    </>
  );
}

export default forwardRef(componentName);
