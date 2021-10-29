import CustomSelect from '@/components/CustomSelect';
import DragDropTable from '@/components/DragDropTable';
import EditableTable from '@/components/EditableTable';
import PriorityConfig from '@/components/PriorityConfig';
import { requiredRule } from '@/util';
import createFormModal from '@/util/createFormModal';
import { ProFormText } from '@ant-design/pro-form';
import { Button } from 'antd';
import { useCallback } from 'react';
import CssTest from './components/CssTest';
import PositioningData from './components/PositioningData';
import SearchHighlight from './components/SearchHighlight';
import styles from './index.less';

interface MyPageProps {}

function MyPage(props: MyPageProps) {
  const {} = props;

  const components = [
    <PositioningData />,
    <EditableTable />,
    <DragDropTable />,
    <div className={styles.priorityConfig}>
      <PriorityConfig />
    </div>,
    <div className={styles.customSelect}>
      <CustomSelect />
    </div>,
    <SearchHighlight />,
    <CssTest />,
  ];

  return (
    <>
      {components.map((item, index) => (
        <div className={styles.unit} key={index}>
          {item}
        </div>
      ))}
    </>
  );
}

export default MyPage;
