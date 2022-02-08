/**自定义hooks组件 */
import { useEffect, useRef } from "react";

// 防抖
export const useDebounce = (fn: any, ms = 30, deps: Array<any> = []) => {
  let timeout: any = useRef();
  useEffect(() => {
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      fn();
    }, ms);
  }, deps);
  const cancel = () => {
    clearTimeout(timeout.current);
    timeout = null;
  };
  return [cancel];
};
