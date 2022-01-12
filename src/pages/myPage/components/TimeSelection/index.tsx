import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Divider } from 'antd';
import classNames from 'classnames';
import { useState } from 'react';
import styles from './index.less';

interface Props {}

function TimeSelection(props: Props) {
  const {} = props;

  const data = new Array(10).fill('xxxxx');
  const [selected, setSelected] = useState<any>();

  return (
    <div className={styles.timeSelectionWrap}>
      <LeftOutlined />
      <div className={styles.mainTime}>
        {/* <div className={styles.mainTimeItem}>2021-12-06</div> */}
        {data.map((item, index) => (
          <div className={classNames(styles.mainTimeItem, selected === index && styles.selectedItem)} onClick={() => { setSelected(index); }} >
            <Divider type="vertical" />
            <div className={styles.dayAndWeek}>
              <span>2021-12-06</span>
              <span>周一</span>
            </div>
            {index === data.length - 1 && <Divider type="vertical" />}
          </div>
        ))}
      </div>
      <RightOutlined />
    </div>
  );
}

export default TimeSelection;
