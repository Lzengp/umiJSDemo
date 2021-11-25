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
      <div style={{ margin: 20, display: 'flex', justifyContent: 'space-between' }}>
        <div>useModal全局状态测试：{count}</div>
        <div className={styles.lessLoop}>测试less循环</div>
        <div className={styles.beforeAfter}>测试伪元素before/after</div>
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
