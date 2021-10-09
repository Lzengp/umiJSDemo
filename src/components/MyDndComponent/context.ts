import { createContext } from 'react';
import { MyDndComponentContextType } from './interface';

const val: MyDndComponentContextType = {
  dataSource: [],
};

export default createContext(val);
