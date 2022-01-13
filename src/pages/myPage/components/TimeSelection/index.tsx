import { getRangeDayByRangeOneValue, getWeek } from '@/util';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Divider } from 'antd';
import classNames from 'classnames';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import styles from './index.less';

interface Props {}

function TimeSelection(props: Props) {
  const {} = props;

  const dateList: Array<string> = getRangeDayByRangeOneValue(15);
  const [selected, setSelected] = useState<string>();
  const containerRef = useRef<any>();

  console.log(containerRef.current, document.getElementById('dateMainTime'));

  useEffect(() => {
    /**默认选中当天, 滚动条应该要滚动到当天的位置，那么滚动的距离=框的宽度（100px） * 15个 = 1500px */
    setSelected(dateList.find((e) => e === moment().format('YYYY-MM-DD')));
    if (dateList) {
      containerRef.current?.scrollTo(1535, 0);
    }
    /**监听滚动事件 */
    containerRef.current?.addEventListener('wheel', moveWheel, false);
    function moveWheel(e: any) {
      console.log(e, e.currentTarget.scrollLeft);
      // 阻止原生滚动事件
      e.preventDefault();
      e.currentTarget.scrollLeft += e.deltaY; // deltaY: 往左滚动是负数，往右滚动是正数，默认是125px
    }
    return () => {
      containerRef.current?.removeEventListener('wheel', moveWheel, false);
    };
  }, []);

  return (
    <div className={styles.timeSelectionWrap}>
      <LeftOutlined
        onClick={(e) => {
          console.log(e, containerRef.current.scrollLeft);
          containerRef.current.scrollLeft -= 500;
        }}
      />
      <div className={styles.mainTime} ref={containerRef} id="dateMainTime">
        {dateList.map((item, index) => (
          <div
            className={styles.mainTimeItem}
            onClick={() => {
              setSelected(item);
            }}
            key={item}
          >
            <Divider type="vertical" />
            <div
              className={classNames(styles.dayAndWeek, selected === item && styles.selectedItem)}
            >
              <span>{item}</span>
              <span>{getWeek(item)}</span>
            </div>
            {index === dateList.length - 1 && <Divider type="vertical" />}
          </div>
        ))}
      </div>
      <RightOutlined
        onClick={(e) => {
          console.log(e, containerRef.current.scrollLeft);
          containerRef.current.scrollLeft += 500;
        }}
      />
    </div>
  );
}

export default TimeSelection;
