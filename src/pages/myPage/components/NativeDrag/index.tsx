import { Button } from 'antd';
import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'umi';
import styles from './index.less';

interface Props {}

function NativeDrag(props: Props) {
  const {} = props;

  const testDate = new Array(10).fill('').map((item, index) => index);

  return (
    <div className={styles.nativeDragWrap}>
      <div
        id="leftDrop"
        className={styles.nativeDragLeft}
        onDragEnter={() => {
          console.log('进到目标元素leftDrop中');
        }}
        onDragLeave={() => {
          console.log('拖放离开目标元素leftDrop');
        }}
        onDragOver={(e) => {
          console.log('在目标元素leftDrop中拖拽');
          e.preventDefault();
        }}
        onDrop={(event) => {
          const e = event || window.event;
          const data = e.dataTransfer.getData('text');
          console.log('拖放onDropleftDrop', ' e.target.id:', e.target.id, ',data:', data);
          if (e.target.id !== 'leftDrop') { // 不能拖拽到自己本身和其他button上
            return;
          }
          e.target.appendChild(document.getElementById(data));
        }}
      >
        {testDate.map((item, index) => {
          return (
            <Button
              type="primary"
              shape="round"
              className={styles.box1}
              key={`button_${index}`}
              id={`button_${index}`}
              draggable="true"
              onDragStart={(e) => {
                console.log('onDragStart, 开始拖拽', e.target.id);
                e.dataTransfer.setData('text', e.target.id);
              }}
            >
              事项_{item}
            </Button>
          );
        })}
      </div>
      <div
        id="rightDrop"
        className={styles.nativeDragRight}
        onDragEnter={() => {
          console.log('进到目标元素rightDrop中');
        }}
        onDragOver={(e) => {
          console.log('在目标元素rightDrop中拖拽');
          e.preventDefault();
        }}
        onDragLeave={() => {
          console.log('拖放离开目标元素rightDrop');
        }}
        onDrop={(event) => {
          const e = event || window.event;
          const data = e.dataTransfer.getData('text');
          console.log('拖放onDroprightDrop', ' e.target.id:', e.target.id, ',data:', data);
          if (e.target.id !== 'rightDrop') {
            return;
          }
          e.target.appendChild(document.getElementById(data));
        }}
      />
    </div>
  );
}

export default NativeDrag;
