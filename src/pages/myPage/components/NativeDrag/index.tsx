import { Button } from 'antd';
import { useState } from 'react';
import styles from './index.less';

interface Props {}

function NativeDrag(props: Props) {
  const {} = props;

  const testDate = new Array(50).fill('').map((item, index) => {
    return {
      index,
      name: `事项_${index}`,
      age: 10 + index,
    };
  });

  const [leftContent, setLeftContent] =
    useState<Array<{ index: number; name: string; age: number }>>(testDate);
  const [rightContent, setRightContent] = useState<
    Array<{ index: number; name: string; age: number }>
  >([]);

  const onDrop = (event: any, flag: string) => {
    const e = event || window.event;
    const data = e.dataTransfer.getData('text');
    const myItem = e.dataTransfer.getData('myItem');
    console.log(
      `拖放onDrop${flag}`,
      ' e.target.id:',
      e.target.id,
      ',data:',
      data,
      ',myItem: ',
      myItem,
    );
    // 不能拖拽到自己本身和其他button上
    if (e.target.id !== flag) {
      return;
    }
    const myItemObj = JSON.parse(myItem);
    /**拖拽时候，当前框内没有此元素，数组源需要加上，同时另外一个数组源需要删掉 */
    if (!JSON.stringify(testDate).includes(JSON.stringify(myItem))) {
      if (flag === 'leftDrop') {
        setLeftContent(leftContent.concat([myItemObj]));
        setRightContent(rightContent.filter((leftItem) => leftItem.name !== myItemObj.name));
      }
      if (flag === 'rightDrop') {
        setRightContent(rightContent.concat([myItemObj]));
        setLeftContent(leftContent.filter((leftItem) => leftItem.name !== myItemObj.name));
      }
    }
    e.target.appendChild(document.getElementById(data));
  };

  return (
    <>
      <div>拖拽池（两边都可以拖拽）</div>

      <div className={styles.nativeDragWrap}>
        <div className={styles.left}>
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
            onDrop={(e) => {
              onDrop(e, 'leftDrop');
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
                  onDragStart={(e: any) => {
                    console.log('onDragStart, 开始拖拽', e.target.id);
                    e.dataTransfer.setData('text', e.target.id);
                    e.dataTransfer.setData('myItem', JSON.stringify(item));
                  }}
                >
                  {item.name}
                </Button>
              );
            })}
          </div>
          数量： {leftContent.length}
        </div>
        <div className={styles.right}>
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
            onDrop={(e) => {
              onDrop(e, 'rightDrop');
            }}
          />
          数量： {rightContent.length}
        </div>
      </div>
    </>
  );
}

export default NativeDrag;
