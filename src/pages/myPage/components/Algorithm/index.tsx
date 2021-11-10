import { isElementVisible } from '@/util';
import { Button, Col, Input, Row } from 'antd';
import { useCallback, useEffect, useState, useContext } from 'react';
import styles from './index.less';
import Context from './context';
import { useDispatch, useModel, useSelector } from 'umi';
interface Props {}

function Algorithm(props: Props) {
  const {} = props;
  const [num, setNum] = useState<any>(20); // 倒计时值
  const [reverseList, setReverseList] = useState<string>('1,2,3,4,5'); // 倒序输入框里面的值
  const [rollFlag, setRollFlag] = useState<boolean>(true); // 是否监听滚动事件
  const [reverseValue, setReverseValue] = useState<string[]>([]);
  const dispatch = useDispatch();
  const { algorithmObj } = useSelector(mapState);
  const { count, addCount } = useModel('project', (modal) => ({
    count: modal.count,
    addCount: modal.addCount,
  }));

  useEffect(() => {
    dispatch({
      type: `algorithm/fetchAlgorithmObj`,
      payload: { value: 'testValue', name: 'longwei' },
    });
  }, []);

  const countDown = useCallback(() => {
    const countDownTimer = setInterval(() => {
      console.log(num);
      // 解决闭包问题, 但是此时从外层拿到的num还是存在闭包问题,也就是上面的打印的num还是初始值（20）
      setNum((num: number) => {
        console.log('setSTate里面的值', num);
        if (num === 1) {
          clearInterval(countDownTimer);
        }
        return num - 1;
      });
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
    console.log(algorithmObj);
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
    const el = document.getElementById('lianxiTitle');
    if (!rollFlag) return;
    if (isElementVisible(el)) {
      console.log('当前元素可见');
    } else {
      console.log('当前元素不可见');
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', scrollEvent, false);
    return () => {
      window.removeEventListener('scroll', scrollEvent, false);
    };
  }, []);

  /**倒序 */
  const reverse = () => {
    const arr = reverseList.split(',');
    const arrRev = [...arr];
    for (let i = 0; i < arr.length; i += 1) {
      arrRev[arr.length - i - 1] = arr[i];
    }
    setReverseValue(arrRev);
    console.log(arrRev);
  };

  return (
    <div className={styles.wrapper}>
      <h1 id="lianxiTitle">练习</h1>
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
            countDown();
          }}
        >
          倒计时 {num}
        </Button>
        <Button onClick={debounceButton}>防抖按钮</Button>
        <Button onClick={throttleButton}>节流按钮</Button>
        <Button onClick={promiseFunc}>Promise按钮</Button>
        <div style={{ display: 'flex', flexDirection: 'column', margin: '20px' }}>
          <Input
            placeholder="格式：'1,2,3,4,5', 请用英文逗号"
            onChange={(val) => {
              setReverseList(val.target.value);
            }}
            onKeyDown={(e) => {
              if (e.keyCode === 13) {
                reverse();
              }
            }}
          />
          <Button onClick={reverse}>倒序按钮</Button>
          输出：{JSON.stringify(reverseValue)}
        </div>
        <div style={{ margin: '20px' }}>
          测试useContext
          <Context.Provider value={{ id: '1', name: 'lw' }}>
            <ContextComponentOne />
          </Context.Provider>
        </div>
        <Button
          onClick={() => {
            addCount(1);
          }}
        >
          测试useModal：{count}
        </Button>
      </div>
      {/* <Row gutter={24}>
        <Col span="8">xxx</Col>
        <Col span="8">xxx</Col>
        <Col span="8">xxx</Col>
      </Row> */}
    </div>
  );
}

const mapState = (state: any) => ({
  algorithmObj: state.algorithm.algorithmObj,
});

export default Algorithm;

interface ContextComponentOneProps {}

function ContextComponentOne(props: ContextComponentOneProps) {
  const {} = props;
  const context = useContext(Context);

  return (
    <div>
      子组件: {context.id}, {context.name}
      <ContextComponentTwo />
    </div>
  );
}

interface ContextComponentTwoProps {}

function ContextComponentTwo(props: ContextComponentTwoProps) {
  const {} = props;
  const context = useContext(Context);

  return (
    <div>
      子子组件: {context.id}, {context.name}
    </div>
  );
}
