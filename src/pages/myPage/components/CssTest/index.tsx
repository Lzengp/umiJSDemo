import Icon from '@ant-design/icons';
import { Progress } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import styles from './index.less';

interface Props {}

const SVGIcon = () => (
  <svg
    className="mysvg"
    viewBox="0 0 1024 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    p-id="1561"
    width="50"
    height="50"
    color="yellow"
  >
    <path
      d="M348.16 742.4l-40.96 0c-14.1312 0-25.58976-11.45856-25.58976-25.6s11.45856-25.6 25.58976-25.6l40.96 0c14.14144 0 25.6 11.45856 25.6 25.6S362.30144 742.4 348.16 742.4zM348.16 373.76l-40.96 0c-14.1312 0-25.58976-11.45856-25.58976-25.6s11.45856-25.6 25.58976-25.6l40.96 0c14.14144 0 25.6 11.4688 25.6 25.6S362.30144 373.76 348.16 373.76zM348.16 558.09024l-40.96 0c-14.1312 0-25.58976-11.4688-25.58976-25.61024s11.45856-25.6 25.58976-25.6l40.96 0c14.14144 0 25.6 11.45856 25.6 25.6S362.30144 558.09024 348.16 558.09024zM512 1018.88C232.05888 1018.88 5.12 791.94112 5.12 512S232.05888 5.12 512 5.12c74.76224 0 145.75616 16.19968 209.64352 45.25056 24.59648 17.77664 5.20192 47.39072-16.91648 37.31456C645.98016 60.95872 580.72064 46.08 512 46.08 254.67904 46.08 46.08 254.67904 46.08 512S254.67904 977.90976 512 977.90976 977.90976 769.32096 977.90976 512c0-35.39968-3.93216-69.85728-11.40736-103.00416-7.68-36.49536 36.67968-41.54368 39.96672-9.04192C1014.5792 435.99872 1018.88 473.4976 1018.88 512 1018.88 791.94112 791.94112 1018.88 512 1018.88zM471.04 691.2l327.68 0c14.14144 0 25.6 11.45856 25.6 25.6s-11.45856 25.6-25.6 25.6L471.04 742.4c-14.1312 0-25.6-11.45856-25.6-25.6S456.89856 691.2 471.04 691.2zM471.04 373.76c-14.1312 0-25.6-11.45856-25.6-25.6s11.45856-25.6 25.6-25.6l92.16 0c14.14144 0 25.6 11.4688 25.6 25.6s-11.45856 25.6-25.6 25.6L471.04 373.76zM587.60192 544.26624c-1.04448 1.06496-2.2016 1.9456-3.3792 2.77504-4.61824 6.63552-12.29824 11.03872-21.02272 11.03872l-92.16 0c-14.1312 0-25.6-11.4688-25.6-25.61024s11.45856-25.6 25.6-25.6l81.60256 0 354.79552-344.59648c10.00448-10.00448 26.20416-10.00448 36.1984 0 10.00448 10.00448 10.00448 26.20416 0 36.1984L587.60192 544.26624z"
      p-id="1562"
      fill="#d81e06"
    ></path>
  </svg>
);

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
        <Icon component={SVGIcon} style={{ width: '50px', color: 'yellow' }} />
      </div>
    </div>
  );
}

export default CssTest;
