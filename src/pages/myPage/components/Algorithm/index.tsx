import { isElementVisible } from '@/util';
import { Button, Input } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import styles from './index.less';

interface Props {}

let countDownTimer: any = null;

function Algorithm(props: Props) {
  const {} = props;
  const [num, setNum] = useState<any>(20); // 倒计时值
  const [flag, setFlag] = useState<any>(false); // 倒计时按钮点击判断
  const [reverseList, setReverseList] = useState<string>('1,2,3,4,5'); // 倒序输入框里面的值
  const [rollFlag, setRollFlag] = useState<boolean>(true); // 是否监听滚动事件

  /**为了解决闭包问题，这个需要每次都重新调用，让countDown里面的num值是最新的，并且每次调用完成都要清空当前定时器 */
  useEffect(() => {
    if (num > 0 && flag) countDown();
    return () => clearInterval(countDownTimer);
  }, [num, flag]);

  const countDown = useCallback(() => {
    countDownTimer = setInterval(() => {
      console.log(num);
      setNum(num - 1);
      if (num === 0) {
        clearInterval(timer);
      }
    }, 1000);
  }, [num]);

  enum testData {
    EMA = 1,
    BMA = 2,
  }

  /**防抖按钮触发事件 */
  const debounceButton = () => {
    console.log(testData.EMA);
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

  /**滚动事件 */
  const scrollEvent = () => {
    const el = document.getElementById('suanfa');
    if (!rollFlag) return;
    if (isElementVisible(el)) {
      console.log('当前元素可见');
    } else {
      console.log('当前元素不可见');
    }
  };

  window.addEventListener('scroll', scrollEvent, false);

  /**倒序 */
  const reverse = () => {
    const arr = reverseList.split(',');
    const arrRev = [...arr];
    for (let i = 0; i < arr.length; i += 1) {
      arrRev[arr.length - i - 1] = arr[i];
    }
    console.log(arrRev);
  };

  return (
    <div className={styles.wrapper}>
      <h1 id="suanfa">算法演练</h1>

      <div className={styles.buttonColony}>
        <Button
          onClick={() => {
            setRollFlag(!rollFlag);
          }}
        >
          {rollFlag ? '关闭' : '开启'}监听滚动事件
        </Button>
        <Button
          onClick={() => {
            setFlag(true);
          }}
        >
          倒计时 {num}
        </Button>
        <Button onClick={debounceButton}>防抖按钮</Button>
        <Button onClick={throttleButton}>节流按钮</Button>
        <Button onClick={promiseFunc}>Promise按钮</Button>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Input
            placeholder="格式：'1,2,3,4,5', 请用英文逗号"
            onChange={(val) => {
              setReverseList(val.target.value);
            }}
          />
          <Button onClick={reverse}>倒序按钮</Button>
        </div>
      </div>
    </div>
  );
}

export default Algorithm;