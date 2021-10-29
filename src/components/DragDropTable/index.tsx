import { useState } from 'react';
import type { ProColumns } from '@ant-design/pro-table';
import { DragSortTable } from '@ant-design/pro-table';
import { CloseCircleFilled } from '@ant-design/icons';
import { message } from 'antd';
import styles from './index.less';

const columns2: ProColumns[] = [
  {
    title: '排序',
    dataIndex: 'sort',
  },
  {
    title: '姓名',
    dataIndex: 'name',
    className: 'drag-visible',
  },
  {
    title: '年龄',
    dataIndex: 'age',
  },
  {
    title: '地址',
    dataIndex: 'address',
  },
  {
    title: '操作',
    dataIndex: 'action',
    render: () => <CloseCircleFilled />,
  },
];

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 36,
    address: 'New York No. 1 Lake Park',
    index: '777',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    index: '555',
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    index: '333',
  },
];

interface DragDropTableProps {}

const DragDropTable = (props: DragDropTableProps) => {
  const {} = props;
  const [dataSource2, setDatasource2] = useState(data);
  const handleDragSortEnd2 = (newDataSource: any) => {
    setDatasource2(newDataSource);
    message.success('修改列表排序成功');
  };

  return (
    <div className={styles.content}>
      <DragSortTable
        headerTitle="拖拽排序(自定义把手)"
        columns={columns2}
        rowKey="index"
        search={false}
        pagination={false}
        dataSource={dataSource2}
        dragSortKey="sort"
        onDragSortEnd={handleDragSortEnd2}
        options={false}
        showHeader={false}
      />
    </div>
  );
};

export default DragDropTable;
