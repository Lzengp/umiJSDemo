import { Button } from 'antd';
// import debounce from 'lodash/debounce';

interface Props {}

function Algorithm(props: Props) {
  const {} = props;

  enum testData {
    EMA = 1,
    BMA = 2,
  }

  /**防抖按钮触发事件 */
  const debounceButton = () => {
    console.log(testData.EMA)
    const fn = () => {
      console.log('防抖');
    };
    debounce(fn, 500);
  };

  /**节流按钮触发事件 */
  const throttleButton = () => {
    throttle(() => {
      console.log('节流');
    });
  };

  /**防抖的原理实现 */
  let timer: any = null;
  const debounce = (fn: any, time: number = 500) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      typeof fn === 'function' && fn();
    }, time);
  };

  // 节流核心代码
  let throttleTimer = 0;
  const throttle = (fn: any, delay: number = 800) => {
    if (!throttleTimer) {
      setTimeout(() => {
        fn();
        throttleTimer = 0;
      }, delay);
    }
  };

  const setTimeOutPro1 = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('1秒');
    }, 1000);
  });

  const setTimeOutPro2 = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('3秒');
    }, 3000);
  });

  /**promise.all和promise.race */
  const promiseFunc = () => {
    Promise.all([setTimeOutPro1, setTimeOutPro2]).then((res) => {
      console.log('Promise.all:', res);
    });

    Promise.race([setTimeOutPro1, setTimeOutPro2]).then((res) => {
      console.log('Promise.race:', res);
    });
  };

  return (
    <div style={{ margin: 20 }}>
      <h1>算法演练</h1>
      <Button onClick={debounceButton} style={{ display: 'block', marginBottom: 20 }}>
        防抖按钮
      </Button>
      <Button onClick={throttleButton} style={{ display: 'block', marginBottom: 20 }}>
        节流按钮
      </Button>
      <Button onClick={promiseFunc} style={{ display: 'block', marginBottom: 20 }}>
        Promise按钮
      </Button>
    </div>
  );
}

export default Algorithm;
