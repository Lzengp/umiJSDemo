import MyDndComponent from '@/components/MyDndComponent';
import React, {
  useEffect,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from 'react';
import styles from './index.less';

interface Props {}

function componentName(props: Props, ref: any) {
  const {} = props;

  useImperativeHandle(ref, () => ({}));

  const data = [
    {
      id: '1',
      title: '开始',
      list: [
        { id: '11', title: '开始-我的看板项一' },
        { id: '12', title: '开始-我的看板项二' },
      ],
    },
    {
      id: '2',
      title: '进行中',
      list: [
        { id: '21', title: '进行中-我的看板项一' },
        { id: '22', title: '进行中-我的看板项二' },
      ],
    },
    {
      id: '3',
      title: '已结束',
      list: [
        { id: '31', title: '已结束-我的看板项一' },
        { id: '32', title: '已结束-我的看板项二' },
      ],
    },
  ];

  return (
    <>
      <MyDndComponent dataSource={data} />
    </>
  );
}

export default forwardRef(componentName);
