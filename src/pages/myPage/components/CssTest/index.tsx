import { useModel } from 'umi';
import styles from './index.less';

interface Props {}

function CssTest(props: Props) {
  const {} = props;

  const { count } = useModel('project', (modal) => ({
    count: modal.count,
  }));

  return (
    <div className={styles.cssWrap}>
      <div style={{ margin: 20, display: "flex", justifyContent: "space-between" }}>
        <div>useModal全局状态测试：{count}</div>
        <div className={styles.lessLoop}>测试less循环</div>
        <div className={styles.beforeAfter}>测试伪元素before/after</div>
      </div>

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
