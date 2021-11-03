import CustomSelect from '@/components/CustomSelect';
import DragDropTable from '@/components/DragDropTable';
import EditableTable from '@/components/EditableTable';
import PriorityConfig from '@/components/PriorityConfig';
import { useHistory } from '@umijs/runtime/node_modules/@types/react-router';
import { useLocation, useParams, useRouteMatch } from 'react-router';
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

  const pro = new Promise((resolve,reject)=>{
    console.log('执行');
    resolve('resolve');
  }).then((res:any) => {
    return 'xxxxx';
  });

  console.log(pro)


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
