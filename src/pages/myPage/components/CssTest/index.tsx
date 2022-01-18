import { Progress } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import styles from './index.less';

interface Props {}

function CssTest(props: Props) {
  const {} = props;

  const [percent, setPercent] = useState<number>(0); // 进度

  useEffect(() => {
    const timer = setInterval(() => {
      setPercent((percent) => {
        if (percent === 100) {
          return (percent = 0);
        }
        return (percent += 10);
      });
    }, 1000);
    return () => {
      clearInterval(timer);
    };
    // const id = requestAnimationFrame(() => {
    //   setPercent((percent) => {
    //     if (percent === 100) {
    //       return (percent = 0);
    //     }
    //     return (percent += 10);
    //   });
    // });
    // return () => {
    //   cancelAnimationFrame(id);
    // };
  }, []);

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
        {testData.map((item, index) =>
          index % 2 === 0 ? (
            <p className={styles.mySelectorItemEven} key={index}>
              {index}
            </p>
          ) : (
            <p className={styles.mySelectorItemOdd} key={index}>
              {index}
            </p>
          ),
        )}
      </div>

      <div className={styles.myTransfrom}>
        <div className={styles.myFixed} />
      </div>

      <div style={{ display: 'flex' }}>
        <div>
          <div className={styles.top} />
          <div className={styles.center} />
          <div className={styles.right} />
        </div>

        <div style={{ marginLeft: '100px' }}>
          <div style={{ marginTop: '-20px' }}>动画效果</div>
          <div className={styles.animationStyle} />
        </div>

        <div style={{ marginLeft: '100px', width: '300px' }}>
          <div style={{ marginTop: '-20px' }}>进度条</div>
          <Progress percent={percent} />
          <Progress
            type="circle"
            percent={percent}
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068',
            }}
          />
        </div>
        {/* 参考：https://www.mybj123.com/6311.html */}
        <div className={styles.textTwinkle}>文字闪烁</div>
      </div>
    </div>
  );
}

export default CssTest;
