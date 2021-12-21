import CustomSelect from '@/components/CustomSelect';
import DragDropTable from '@/components/DragDropTable';
import EditableTable from '@/components/EditableTable';
import PriorityConfig from '@/components/PriorityConfig';
import Algorithm from './components/Algorithm';
import AntdTable from './components/AntdTable';
import CssTest from './components/CssTest';
import HOC from './components/HOC';
import MyTestTree from './components/MyTestTree';
import PositioningData from './components/PositioningData';
import MyProTable from './components/MyProTable';
import SearchHighlight from './components/SearchHighlight';
import styles from './index.less';

interface MyPageProps {}

function MyPage(props: MyPageProps) {
  const {} = props;

  const components = [
    <CssTest />,
    <PositioningData />,
    <EditableTable />,
    <DragDropTable />,
    <Algorithm />,
    <div className={styles.priorityConfig}>
      <PriorityConfig />
    </div>,
    <div className={styles.customSelect}>
      <CustomSelect />
    </div>,
    <SearchHighlight />,
    <HOC />,
    <MyTestTree />,
    <MyProTable />,
    <AntdTable />,
  ];

  return (
    <>
      {components.map((item, index) => (
        <div className={styles.unit} key={index} id={`id_${index}`}>
          {item}
        </div>
      ))}
    </>
  );
}

export default MyPage;
