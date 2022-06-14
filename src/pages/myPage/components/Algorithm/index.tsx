import { isElementVisible } from '@/util';
import { Button, Input } from 'antd';
import { useCallback, useEffect, useState, useContext } from 'react';
import styles from './index.less';
import Context from './context';
import { useDispatch, useModel, useSelector } from 'umi';
import { useDebounce } from '@/hooks';
interface Props {}

function Algorithm(props: Props) {
  const {} = props;
  const [num, setNum] = useState<any>(20); // 倒计时值
  const [reverseList, setReverseList] = useState<string>('1,2,3,4,5'); // 倒序输入框里面的值
  const [rollFlag, setRollFlag] = useState<boolean>(false); // 是否监听滚动事件
  const [reverseValue, setReverseValue] = useState<string[]>([]);
  const dispatch = useDispatch();
  const { algorithmObj } = useSelector(mapState);
  const { count, addCount } = useModel('project', (modal) => ({
    count: modal.count,
    addCount: modal.addCount,
  }));
  const [positionFixedTop, setPositionFixedTop] = useState<boolean>(false); // 在窗口上面出现
  const [positionFixedBottom, setPositionFixedBottom] = useState<boolean>(false); // 在窗口下面出现

  const [debounceFlag, setDebounceFlag] = useState<number>(0);
  useDebounce(() => { debounceFlag && console.log('自定义hooks')}, 500, [debounceFlag]); // 自定义hooks-防抖

  useEffect(() => {
    dispatch({
      type: `algorithm/fetchAlgorithmObj`,
      payload: { value: 'testValue', name: 'longwei' },
    });
    console.log('冒泡排序：',  bubbleSorting([1, 5, 6, 2, 4,11,6,4,0,-1]))

  }, []);

  // 冒泡排序
  const bubbleSorting = (list: number[]) => {
    list.forEach(() => {
      for(let i = 1; i < list.length; i++) {
        const num = list[i];
        if (list[i - 1] >= list[i]) {
          list[i] = list[i - 1];
          list[i - 1] = num;
        }
      }
    })
    return list;
  }

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
    console.log(eval('5 * 5'));
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

    // 需要判断当前元素是在窗口上面消失还是在窗口下面消失
    const rect = el?.getBoundingClientRect() || { top: 0, bottom: 0 };
    const vHeight = window.innerHeight || document.documentElement.clientHeight;
    // 在窗口上面消失
    if (rect.top - 48 < 0) {
      setPositionFixedTop(true);
    } else {
      setPositionFixedTop(false);
    }

    // 在窗口下面消失
    if (rect.bottom > vHeight) {
      setPositionFixedBottom(true);
    } else {
      setPositionFixedBottom(false);
    }

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
  }, [rollFlag]);

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

  /**深拷贝 */
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
    const a = arr.reduce((prev: any, cur: any) => {
      obj[cur] ? '' : (obj[cur] = true && prev.push(cur));
      return prev;
    }, []);

    // 简单数组去重
    const b = arr.reduce((prev: any, cur: any) => (prev.includes(cur) ? prev : [...prev, cur]), []);

    // 对象数组去重
    const c = arrObj.reduce(
      (prev: any, cur: any) =>
        JSON.stringify(prev).includes(JSON.stringify(cur)) ? prev : [...prev, cur],
      [],
    );

    console.log(a, b, c);
  };

  /**高阶函数： 一个函数就可以接收另一个函数作为参数，这种函数就称之为高阶函数,map, reduce, sort */
  const higherOrderFunction = () => {
    function pow(x: number) {
      return x * x;
    }
    const arr = [1, 2, 3];
    const a = arr.map(pow);

    // 数组求和
    const b = arr.reduce(function (x, y) {
      return x + y;
    });

    // 取2的倍数
    const c = arr.filter(function (x) {
      return x % 2 === 0;
    });
    console.log(a, b, c);
  };

  /**阶乘 */
  const factorial = (num: number): number => {
    if (num === 1) {
      return 1;
    }
    return num * factorial(num - 1);
  };

  /**字符递增 */
  const stringIncrementer = (strng: string) => {
    // const arr = strng.split('');
    // let letter = '';
    // let number = '';
    // arr.forEach((item) => {
    //   if (Number(item) || Number(item) === 0) {
    //     number += item;
    //   } else {
    //     letter += item;
    //   }
    // });
    // console.log('letter:', letter, ',number:', number, Number(number) + 1);
    // return letter + (Number(number) + 1).toString();
    if (isNaN(parseInt(strng[strng.length - 1]))) {
      return strng + '1';
    }
    return strng.replace(/(0*)([0-9]+$)/, function (match, p1, p2) {
      console.log(match, p1, p2);
      const num = parseInt(p2) + 1;
      // 加1之后大于之前的长度，说明进一位了
      return num.toString().length > p2.length ? p1.slice(0, -1) + num : p1 + num;
    });
  };

  const testFn = () => {
    // console.log(factorial(4));
    setDebounceFlag(debounceFlag + 1)
    // console.log(stringIncrementer('foobar009'));
  };

  return (
    <div className={styles.wrapper}>
      <h1
        id="lianxiTitleFixedBottom"
        style={{
          position: 'fixed',
          top: positionFixedTop ? 45 : 'auto',
          bottom: positionFixedBottom ? 0 : 'auto',
          display: positionFixedBottom || positionFixedTop ? 'initial' : 'none',
          zIndex: 1,
        }}
      >
        练习
      </h1>
      <h1 id="lianxiTitle" style={{ opacity: !positionFixedBottom || !positionFixedTop ? 1 : 0 }}>
        练习
      </h1>
      <div className={styles.buttonColony}>
        <Button onClick={testFn}>测试</Button>
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
        <Button onClick={duplicateRemoval}>去重</Button>
        <Button onClick={higherOrderFunction}>高阶函数</Button>
      </div>
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
    <div className={styles.childrenComponent}>
      子子组件: {context.id}, {context.name}
    </div>
  );
}
