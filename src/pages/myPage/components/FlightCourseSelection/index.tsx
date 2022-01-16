import TimeSelection from '@/components/TimeSelection';
import classNames from 'classnames';
import { CheckOutlined } from '@ant-design/icons';
import { Pagination } from 'antd';
import React, { useState } from 'react';
import styles from './index.less';
import { getWeek } from '@/util';
import moment from 'moment';
// import { AircraftOutlined } from '@icons';

interface FlightCourseType {
  id: string;
  flightCourseName: string;
  flightCourseCode: string;
  flightCourseTime: string;
}

const testData = [
  {
    id: '1',
    flightCourseName: '航线一',
    flightCourseCode: 'CAN-TBS-FRA1',
    flightCourseTime: '2021-12-06 08:00',
  },
  {
    id: '2',
    flightCourseName: '航线二',
    flightCourseCode: 'CAN-TBS-FRA2',
    flightCourseTime: '2021-12-07 08:00',
  },
  {
    id: '3',
    flightCourseName: '航线三',
    flightCourseCode: 'CAN-TBS-FRA3',
    flightCourseTime: '2021-12-08 08:00',
  },
  {
    id: '4',
    flightCourseName: '航线四',
    flightCourseCode: 'CAN-TBS-FRA4',
    flightCourseTime: '2021-12-09 08:00',
  },
  {
    id: '5',
    flightCourseName: '航线五',
    flightCourseCode: 'CAN-TBS-FRA5',
    flightCourseTime: '2021-12-10 08:00',
  },
];

interface FlightCourseSelectionProps {}

function FlightCourseSelection(props: FlightCourseSelectionProps) {
  const {} = props;
  const [timeValue, setTimeValue] = useState<string>('2022-01-18');
  const [flightCourseList, setFlightCourseList] = useState<Array<FlightCourseType>>([...testData]); // 航线信息
  const [selectedIds, setSelectedId] = useState<Array<string>>([]);

  console.log(selectedIds);

  return (
    <div className={styles.flightCourseSelectionWrap}>
      <TimeSelection
        onChange={(val) => {
          console.log(val);
          setTimeValue(val);
        }}
        value={timeValue}
      />
      <div className={styles.flightCourse}>
        {flightCourseList.map((item, index) => (
          <div
            key={item.id}
            className={classNames(
              styles.flightCourseItem,
              selectedIds.includes(item.id) && styles.selectedFilghtCourseItem,
            )}
            style={selectedIds.includes(item.id) ? { border: '1px solid #2a8dfd' } : {}}
            onClick={() => {
              if (!selectedIds.includes(item.id)) {
                setSelectedId([...selectedIds, item.id]);
              } else {
                const data = selectedIds.filter((e) => e !== item.id);
                setSelectedId([...data]);
              }
            }}
          >
            <img alt="aircraftIcon" className={styles.aircraftIcon} src="/aircraft_icon.svg" />

            <div className={styles.textInfo}>
              <div className={styles.flightCourseTitle}>
                {item.flightCourseName}
                {selectedIds.includes(item.id) && <CheckOutlined className={styles.checkIcon} />}
              </div>
              <div>航线：{item.flightCourseCode}</div>
              <div className={styles.takeoffTime}>起飞时间：{item.flightCourseTime}</div>
              <div className={styles.nameCenter}>
                {getWeek(moment(item.flightCourseTime).format('YYYY-MM-DD'))}
              </div>
            </div>
            {/* <div
              className={styles.actionBtn}
              onClick={() => {
                console.log();
                if (!selectedIds.includes(item.id)) {
                  setSelectedId([...selectedIds, item.id]);
                } else {
                  const data = selectedIds.filter((e) => e !== item.id);
                  setSelectedId([...data]);
                }
              }}
            >
              {selectedIds.includes(item.id) ? '取消' : '选择'}
            </div> */}
          </div>
        ))}
      </div>
      <Pagination
        defaultCurrent={6}
        total={500}
        showTotal={(total: number) => `总共${total}条`}
        style={{ display: 'flex', justifyContent: 'end' }}
      />
    </div>
  );
}

export default FlightCourseSelection;
