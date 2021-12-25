import { useModel } from 'umi';
import styles from './index.less';

interface Props {}

function CssTest(props: Props) {
  const {} = props;

  const { count } = useModel('project', (modal) => ({
    count: modal.count,
  }));

  const testData = new Array(10).fill('1');

  return (
    <div className={styles.cssWrap}>
      <div style={{ margin: 20, display: 'flex', justifyContent: 'space-between' }}>
        <div>useModal全局状态测试：{count}</div>
        <div className={styles.lessLoop}>测试less循环</div>
        <div className={styles.beforeAfter}>测试伪元素before/after</div>

      </div>
      <div className={styles.mySelector}>
        {
          testData.map((item, index) => index % 2 === 0 ? <p className={styles.mySelectorItemEven} key={index}>{index}</p> : <p className={styles.mySelectorItemOdd}  key={index}>{index}</p>)
        }
      </div>

      <div className={styles.myTransfrom}>
        <div className={styles.myFixed}>
        </div>
      </div>

      <div className={styles.top}></div>
      <div className={styles.center}></div>
      <div className={styles.right}></div>

    </div>
  );
}

export default CssTest;
