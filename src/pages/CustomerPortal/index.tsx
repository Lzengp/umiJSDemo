import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { history } from 'umi';
import { Input, Modal } from 'antd';

let timer: any = null;
let maxTime = 10;
const CustomerPortal = () => {
  const [minutes, setMinutes] = useState<string>('10');
  const [seconds, setSeconds] = useState<string>('00');
  const [visible, setVisible] = useState<boolean>(true);

  useEffect(() => {
    // 监听鼠标移动
    document.addEventListener('mousemove', () => {
      maxTime = 10;
    });

    // 监听键盘按下事件
    document.addEventListener('keydown', () => {
      console.log(maxTime)
      maxTime = 10;
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
        if (maxTime == 0) {
          setVisible(true);
        }
        --maxTime;
      } else {
        // clearInterval(timer);
      }
    }, 1000);
  };

  const hideModal = () => {
    setVisible(false);
  }

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
        <Modal
          title="弹窗"
          visible={visible}
          onOk={hideModal}
          onCancel={hideModal}
        >
          号码：<Input />
        </Modal>
      </div>
    </div>
  );
};

export default CustomerPortal;
