import { useModel } from 'umi';
import styles from './index.less';

interface Props {}

function CssTest(props: Props) {
  const {} = props;

  const { count } = useModel('project', (modal) => ({
    count: modal.count,
  }));

  const testDataArray = [
    { value: '1', lable: '22' },
    { value: '2', lable: '33' },
  ];

  const testDataObj = { value: '1', lable: '22', id: '11223333', name: '龙伟' };

  const deelClone = (obj: any) => {
    if (!obj) return null;
    let newObj = obj instanceof Array ? [] : {};
    for (const i in obj) {
      newObj[i] = typeof obj[i] === 'object' ? deelClone(obj[i]) : obj[i];
    }
    return newObj;
  };

  /**去重 */
  const duplicateRemoval = () => {
    const arr = [1, 2, 3, 4, 4, 4, 5, 5, 6];
    const arrObj = [
      { value: '1', lable: '22' },
      { value: '2', lable: '33' },
      { value: '2', lable: '33' },
    ];
    /**下面两种去重效果一样, 都只能去重简单的，比如arr那种 */
    const setArr1 = [...new Set(arr)];
    const setArr2 = Array.from(new Set(arr));
    console.log(setArr1, setArr2);
    let obj = {};
    arrObj.reduce((prev: any, cur: any) => {
      obj[cur] ? '' : (obj[cur] = true && prev.push(cur));
      return prev;
    }, []);
    arrObj.reduce((prev: any, cur: any) => (prev.includes(cur) ? prev : [...prev, cur]), []);
  };

  return (
    <div className={styles.cssWrap}>
      <div style={{ margin: 20 }}>useModal全局状态测试：{count}</div>
      <div className={styles.top}></div>
      <div className={styles.center}></div>
      <div className={styles.right}></div>
      {/* <div>
        <div
          style={{ margin: 20, backgroundColor: 'red' }}
          onMouseOver={() => {
            console.log('鼠标移入了');
          }}
        >
          鼠标移入事件
        </div>
        <div
          style={{ margin: 20, backgroundColor: 'yellow' }}
          onMouseDown={() => {
            console.log('鼠标按下事件');
          }}
        >
          鼠标按下事件
        </div>
        <div
          style={{ margin: 20, backgroundColor: 'green' }}
          onMouseMove={() => {
            console.log('鼠标onMouseMove事件');
          }}
        >
          鼠标onMouseMove事件
        </div>
        <div
          style={{ margin: 20, backgroundColor: 'red' }}
          onMouseUp={() => {
            console.log('鼠标onMouseUp事件');
          }}
        >
          鼠标onMouseUp事件
        </div>
      </div> */}
      {/* <div>模拟深拷贝</div> */}
    </div>
  );
}

export default CssTest;
