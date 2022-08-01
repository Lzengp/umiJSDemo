import CustomSelect from '@/components/CustomSelect';
import DragDropTable from '@/components/DragDropTable';
import EditableTable from '@/components/EditableTable';
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
import { GetWeek, duplicateRemoval } from 'lzengp-util';
import VideoAndPrint from './components/VideoAndPrint';

interface MyPageProps {}

function MyPage(props: MyPageProps) {
  const {} = props;
  
  useEffect(() => {
      // IntersectionObserver接口 (从属于Intersection Observer API) 提供了一种异步观察目标元素与其祖先元素或顶级文档视窗 (viewport) 交叉状态的方法
      // 返回观察器实例
      const intersectionObserver = new IntersectionObserver(function (entries) {
          console.log(entries[0])
          if (entries[0].intersectionRatio <= 0) return;
          if (entries[0].intersectionRatio > 0) {
              console.log('元素已经到达可视范围')
          }
      });
      if (document.querySelector('.scrollerFooter')) {
          intersectionObserver.observe(document.querySelector('.scrollerFooter'));
      }
  }, []);

  const sleep = (timeout: number) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('ok');
      }, timeout);
    });
  };

  //   function duplicateRemoval(arr: Array<{}> = [], field: string) {
  //     const obj: any = {}
  //     return arr.reduce((cur: any, next: any, index: number) => {
  //         if (!obj[next[field]]) {
  //             obj[next[field]] = true
  //             cur.push(next)
  //         }
  //         return cur
  //     }, [])
  // }

  useEffect(() => {
    console.log(
      'xxxx',
      GetWeek('', true),
      duplicateRemoval([{ value: 1 }, { value: 1 }, { value: 2 }], 'value'),
    );
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
    myTestFn();
  }, []);

  const myTestFn = async () => {
    let data = {};
    request('https://proapi.azurewebsites.net/github/issues', {
      method: 'GET',
      params: {
        current: 1,
        pageSize: 5,
      },
    }).then((res) => {
      console.log(res);
      data = res;
    });
    const a = await sleep(100);
    console.log(data);
  };

  const components = [
    <VideoAndPrint />,
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
      <div className='scrollerFooter'>观察者测试</div>
    </>
  );
}

export default MyPage;
