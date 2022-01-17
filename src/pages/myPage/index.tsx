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
import NativeDrag from './components/NativeDrag';
import Canvas from './components/Canvas';
import styles from './index.less';
import FlightCourseSelection from './components/FlightCourseSelection';
import request from 'umi-request';
import { useEffect } from 'react';

interface MyPageProps {}

function MyPage(props: MyPageProps) {
  const {} = props;

  useEffect(() => {
    // request
    //   .get(
    //     'https://proapi.azurewebsites.net/github/issues', {
    //       params: {
    //         current: 1,
    //         pageSize: 5,
    //       }
    //     }
    //   )
    //   .then(function (response) {
    //     console.log(response);
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //   });
    request('https://proapi.azurewebsites.net/github/issues1', {
      method: 'GET',
      params: {
        current: 1,
        pageSize: 5,
      },
    });
  }, []);

  const components = [
    <FlightCourseSelection />,
    // <Canvas />,
    <NativeDrag />,
    <CssTest />,
    <PositioningData />,
    <EditableTable />,
    <DragDropTable />,
    <Algorithm />,
    <div className={styles.priorityConfig}>{/* <PriorityConfig /> */}</div>,
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
