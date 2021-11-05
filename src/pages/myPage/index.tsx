import CustomSelect from '@/components/CustomSelect';
import DragDropTable from '@/components/DragDropTable';
import EditableTable from '@/components/EditableTable';
import PriorityConfig from '@/components/PriorityConfig';
import { Button } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import Algorithm from './components/Algorithm';
import CssTest from './components/CssTest';
import PositioningData from './components/PositioningData';
import SearchHighlight from './components/SearchHighlight';
import styles from './index.less';

interface MyPageProps {}

let timer: any = null;

function MyPage(props: MyPageProps) {
  const {} = props;
  const [num, setNum] = useState<any>(20);
  const [flag, setFlag] = useState<any>(false);

  useEffect(() => {
    if (num > 0 && flag) djs();
    return () => clearInterval(timer);
  }, [num, flag]);

  const djs = () => {
    timer = setInterval(() => {
      console.log(num);
      setNum(num - 1);
      if (num === 0) {
        clearInterval(timer);
      }
    }, 1000);
  };

  const components = [
    <Algorithm />,
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
      <Button
        onClick={() => {
          setFlag(true);
        }}
      >
        {num}
      </Button>
      {components.map((item, index) => (
        <div className={styles.unit} key={index} id={`id_${index}`}>
          {item}
        </div>
      ))}
    </>
  );
}

export default MyPage;
