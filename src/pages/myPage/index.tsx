import CustomSelect from '@/components/CustomSelect';
import DragDropTable from '@/components/DragDropTable';
import EditableTable from '@/components/EditableTable';
import PriorityConfig from '@/components/PriorityConfig';
import Algorithm from './components/Algorithm';
import CssTest from './components/CssTest';
import HOC from './components/HOC';
import MyTestTree from './components/MyTestTree';
import PositioningData from './components/PositioningData';
import SearchHighlight from './components/SearchHighlight';
import styles from './index.less';

interface MyPageProps {}

function MyPage(props: MyPageProps) {
  const {} = props;

  const components = [
    <Algorithm />,
    <CssTest />,
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
    <HOC />,
    <MyTestTree />,
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
