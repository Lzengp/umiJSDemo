import { useCallback, useMemo, useState } from 'react';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import {
  CheckOutlined,
  CloseCircleFilled,
  CloseOutlined,
  EditOutlined,
  MenuOutlined,
  PlusCircleFilled,
} from '@ant-design/icons';
import { message, Input, Button, Tag, Tooltip } from 'antd';
import styles from './index.less';
import classNames from 'classnames';
import { isCustomArray, uuid } from '@/util';
import ListDnd from '../ListDnd/ListDnd';
import { newExpression } from '@babel/types';

const data = [
  {
    id: '1',
    name: '非常紧急',
    color: '#e62412',
  },
  {
    id: '2',
    name: '紧急',
    color: '#fa8c15',
  },
  {
    id: '3',
    name: '普通',
    color: '#1b9aee',
  },
  {
    id: '4',
    name: '较低',
    color: '#8c8c8c',
  },
];

/**颜色 */
const color = [
  { notSelect: '#ffcccc', select: '#e62412' },
  { notSelect: '#ffd591', select: '#fa8c15' },
  { notSelect: '#cafac8', select: '#15ad31' },
  { notSelect: '#ccecff', select: '#1b9aee' },
  { notSelect: '#e5e5e5', select: '#8c8c8c' },
];

interface PriorityConfigProps {}

function PriorityConfig(props: PriorityConfigProps) {
  const {} = props;
  const [dataSource, setDatasource] = useState<any[]>(data);
  const [oldDtaSource, setOldDatasource] = useState<any[]>(data);
  const [tableDataSource, setTableDatasource] = useState<any[]>(data);
  const [tableVisible, setTableVisible] = useState<boolean>(true); // 编辑和管理按钮是否可见

  const columns: ProColumns[] = [
    {
      title: '展示',
      dataIndex: 'show',
      render: (text, rowData) => (
        <div className={styles.showData}>
          <Tooltip title={rowData.name}>
            <Tag
              key={rowData.id}
              style={{ color: rowData.color, border: `1px solid ${rowData.color}` }}
              className={styles.itemTag}
            >
              {rowData.name}
            </Tag>
          </Tooltip>
        </div>
      ),
    },
  ];

  const addRow = useCallback(() => {
    const data = [...dataSource];
    data.push({ id: uuid(), color: '#e62412', name: '' });
    setDatasource(data);
  }, [dataSource]);

  const changeRow = useCallback(
    (name: string, val: string, id: string) => {
      const data = [...dataSource];
      data.forEach((item) => {
        if (name === 'name' && item.id === id) {
          item.name = val;
        }
        if (name === 'color' && item.id === id) {
          item.color = val;
        }
      });
      setDatasource(data);
    },
    [dataSource],
  );

  const deleteRow = useCallback(
    (id) => {
      const data = dataSource.filter((item) => item.id !== id);
      setDatasource(data);
    },
    [dataSource],
  );

  const renderItem = (rowData: any) => (
    <div className={styles.rowData}>
      <div className={styles.itemLeft}>
        <MenuOutlined />
        <div className={styles.priorityEditor}>
          <Input
            className={styles.inputStyle}
            value={rowData.name}
            onChange={(e) => changeRow('name', e.target.value, rowData.id)}
          />
          <div className={styles.colorPicker}>
            {color.map((item, index) => (
              <div
                key={item.notSelect}
                className={classNames(
                  styles.colorItem,
                  rowData.color === item.select && styles.selected,
                )}
                style={{ background: item.select, borderColor: item.notSelect }}
                onClick={(e) => changeRow('color', item.select, rowData.id)}
              />
            ))}
          </div>

          <div className={styles.colorTip}>
            <span style={{ opacity: ['#e62412', '#fa8c15'].includes(rowData.color) ? 1 : 0 }}>
              该优先级颜色将常驻在任务卡片和列表上
            </span>
          </div>
        </div>
      </div>
      <div className={styles.itemRight}>
        <CloseCircleFilled onClick={() => deleteRow(rowData.id)} />
      </div>
    </div>
  );

  const submit = useCallback(() => {
    try {
      dataSource.forEach((item) => {
        if (!item.name) {
          message.error(`名称不能为空`);
          throw newExpression;
        }
        if (
          isCustomArray(dataSource.filter((n) => n.name === item.name)) &&
          dataSource.filter((n) => n.name === item.name).length > 1
        ) {
          message.error(`名称不能为重复`);
          throw newExpression;
        }
      });
      setTableDatasource(dataSource);
      setTableVisible(true);
    } catch {
      return;
    }
  }, [dataSource]);

  const disabledBtn = useMemo(() => {
    return (
      JSON.parse(JSON.stringify(oldDtaSource)) === JSON.parse(JSON.stringify(dataSource)) ||
      isCustomArray(dataSource.filter((item) => !item.name))
    );
  }, [oldDtaSource, dataSource]);

  return (
    <div className={styles.wrap}>
      <div>
        {tableVisible ? (
          <Button type="primary" onClick={() => setTableVisible(false)}>
            <EditOutlined />
            编辑和管理
          </Button>
        ) : (
          <div className={styles.editBtn}>
            <Button type="link" onClick={() => setTableVisible(true)}>
              <CloseOutlined />
              取消
            </Button>
            <Button type="primary" onClick={submit} disabled={disabledBtn}>
              <CheckOutlined />
              提交
            </Button>
          </div>
        )}
      </div>
      <div className={styles.prioritySortRule}>列表顺序由上至下为：最高优先级 至 最低优先级</div>
      {tableVisible ? (
        <div className={styles.showTable}>
          <ProTable
            columns={columns}
            dataSource={tableDataSource}
            rowKey="id"
            search={false}
            pagination={false}
            showHeader={false}
            toolBarRender={false}
          />
        </div>
      ) : (
        <div className={styles.editTable}>
          <ListDnd dataSource={dataSource} renderItem={renderItem} onChange={setDatasource} />
          <div className={styles.addData}>
            <Button type="link" icon={<PlusCircleFilled />} onClick={addRow}>
              添加
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PriorityConfig;
