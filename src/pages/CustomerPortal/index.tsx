import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { history } from 'umi';

let timer: any = null;
let maxTime = 600;
const CustomerPortal = () => {
  const [minutes, setMinutes] = useState<string>('10');
  const [seconds, setSeconds] = useState<string>('00');

  useEffect(() => {
    // 监听鼠标移动
    document.addEventListener('mousemove', () => {
      maxTime = 600;
    });

    // 监听键盘按下事件
    document.addEventListener('keydown', () => {
      maxTime = 600;
    });

    countDownFn();
    return () => {
      clearInterval(timer);
    };
  }, []);

  const countDownFn = () => {
    timer = setInterval(() => {
      if (maxTime >= 0) {
        setMinutes(() => {
          return Math.floor(maxTime / 60).toString();
        });
        setSeconds(() => {
          const sec = Math.floor(maxTime % 60).toString();
          return sec.length == 1 ? `0${sec}` : sec;
        });
        --maxTime;
      } else {
        clearInterval(timer);
      }
    }, 1000);
  };

  return (
    <div className={styles.customerPortalWrap}>
      <div className={styles.header}>
        <div className={styles.iconAndName} onClick={() => {
          history.push('/welcome');
        }}>
          <img
            className={styles.websiteIcon}
            alt="logo"
            src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
          />
          <span className={styles.name}>Lzengp</span>
        </div>

        <div className={styles.menuTitleList}>
          <div>首页</div>
          <div>基础信息</div>
          <div>税金管理</div>
          <div>商品备案</div>
        </div>
      </div>
      <div className={styles.content}>
        <div>
          时间倒计时：{minutes}:{seconds}
        </div>
      </div>
    </div>
  );
};

export default CustomerPortal;
