import MyDndComponent from '@/components/MyDndComponent';
import React, { useEffect, useState, useCallback, forwardRef, useImperativeHandle, useMemo} from 'react';
import styles from './index.less'

interface Props {}

function componentName(props: Props, ref:any) {
    const {} = props;

    useImperativeHandle(ref, () => ({}));

    return (
        <>
            <MyDndComponent dataSource={[]} />
        </>
    );
}

export default forwardRef(componentName)