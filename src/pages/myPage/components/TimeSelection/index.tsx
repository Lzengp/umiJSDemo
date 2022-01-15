import { getRangeDayByRangeOneValue, getWeek } from '@/util';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { DatePicker, Divider } from 'antd';
import classNames from 'classnames';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import styles from './index.less';

interface TimeSelectionProps {
  needDatePicker?: boolean; // 是否需要日期选择，默认需要
  needLeftAndRightOperation?: boolean; // 是否需要左右操作项，默认需要
  clickRollingDistance?: number; // 点击滚动的距离， 默认500px
  onChange: (value: string) => void; // 选择的时间改变事件，返回选择时间字符串格式，例如：'2022-01-14', 注意，月份和日期一定是两位数
  value?: string; // 回填的值，默认当天
  rangeValue?: number; // 时间范围，默认以当天的前后15天范围
}

/**时间范围滚动选择组件 */
function TimeSelection(props: TimeSelectionProps) {
  const {
    needDatePicker = true,
    needLeftAndRightOperation = true,
    clickRollingDistance = 500,
    onChange,
    value = moment().format('YYYY-MM-DD'),
  } = props;

  const [selectedDate, setselectedDate] = useState<string>(value);
  const containerRef = useRef<any>();
  const [leftDisabled, setLeftDisabled] = useState<boolean>(false); // 左侧箭头按钮置灰
  const [rightDisabled, setRightDisabled] = useState<boolean>(false); // 右侧箭头按钮置灰
  const [dateList, setDateList] = useState<Array<string>>();

  console.log(props, dateList, selectedDate);

  useEffect(() => {
    value && setselectedDate(value);
  }, [value]);

  useEffect(() => {
    /**默认选中当天, 滚动条应该要滚动到当天的位置，那么滚动的距离=框的宽度（100px） * 15个 = 1500px
     * 如果给了选定的值，需要跳到选定值的位置
     * 方案一：以给定的值为中心，然后前后各15天，这样滚动的位置还是1535，这个容易做
     * 方案二：还是以当天为中心，前后各15天，但是，如果要滚动到给定日期，那么滚动的距离就要计算出来，这个相对于方案一还是难做一点
     * */
    setDateList(getRangeDayByRangeOneValue(15, value));
    /**监听鼠标滑轮滚动事件 */
    containerRef.current?.addEventListener('wheel', moveWheel, false);
    function moveWheel(e: any) {
      // 阻止原生滚动事件(防止竖方向的滚动)
      e.preventDefault();
      e.currentTarget.scrollLeft += e.deltaY; // deltaY: 往左滚动是负数，往右滚动是正数，默认是125px
    }

    /**监听滚动事件 */
    containerRef.current?.addEventListener('scroll', onscroll, false);
    function onscroll(e: any) {
      if (e.currentTarget.scrollLeft < 100) {
        setLeftDisabled(true);
        setRightDisabled(false);
      } else if (e.currentTarget.scrollLeft >= 3075) {
        setLeftDisabled(false);
        setRightDisabled(true);
      } else {
        setLeftDisabled(false);
        setRightDisabled(false);
      }
    }
    return () => {
      containerRef.current?.removeEventListener('wheel', moveWheel, false);
      containerRef.current?.removeEventListener('scroll', onscroll, false);
    };
  }, []);

  useEffect(() => {
    dateList && containerRef.current?.scrollTo(1535, 0);
  }, [dateList]);

  /**时间改变事件 */
  const dateOnChange = (date: any, dateString: string) => {
    setselectedDate(dateString);
    typeof onChange === 'function' && onChange(dateString);
  };

  return (
    <div className={styles.timeSelectionWrap}>
      {needLeftAndRightOperation && (
        <LeftOutlined
          onClick={(e) => {
            containerRef.current.scrollLeft -= clickRollingDistance;
          }} // 每次点击，滚动条滚动500px
          className={classNames(leftDisabled && styles.disabledOutlined)}
        />
      )}
      <div className={styles.mainTime} ref={containerRef} id="dateMainTime">
        {dateList?.map((item, index) => (
          <div
            className={styles.mainTimeItem}
            onClick={() => {
              setselectedDate(item);
              typeof onChange === 'function' && onChange(item);
            }}
            key={item}
          >
            <Divider type="vertical" />
            <div
              className={classNames(
                styles.dayAndWeek,
                selectedDate === item && styles.selectedDateItem,
              )}
            >
              <span>{item}</span>
              <span>{getWeek(item)}</span>
            </div>
            {index === dateList.length - 1 && <Divider type="vertical" />}
          </div>
        ))}
      </div>
      {needLeftAndRightOperation && (
        <RightOutlined
          onClick={(e) => {
            containerRef.current.scrollLeft += clickRollingDistance;
          }}
          className={classNames(rightDisabled && styles.disabledOutlined)}
        />
      )}
      {needDatePicker && (
        <DatePicker
          onChange={dateOnChange}
          style={{ marginLeft: '20px' }}
          value={moment(selectedDate, 'YYYY-MM-DD')}
        />
      )}
    </div>
  );
}

export default TimeSelection;
