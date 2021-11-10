import { useCallback, useState } from 'react';

export default () => {
  const [count, setCount] = useState<number>(0);

  // 添加数量
  const addCount = useCallback((val: number = 1) => {
    setCount((num) => num + val);
  }, []);

  return {
    count,
    addCount,
  };
};
