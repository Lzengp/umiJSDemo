import React, { useEffect, useState, useCallback, forwardRef, useImperativeHandle, useMemo } from 'react';
import styles from './index.less'

interface MyPageProps { }

function MyPage(props: MyPageProps, ref: any) {
  const { } = props;

  useImperativeHandle(ref, () => ({}));

  return (
    <div className={styles.wrap}>
      myPage
    </div>
  );
}

export default forwardRef(MyPage)