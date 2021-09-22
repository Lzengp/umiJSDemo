import { CSSProperties } from 'react';
import { DragDropContextProps, DropResult, ResponderProvided } from 'react-beautiful-dnd';

export interface ListDndItemType {
  id: string;
  disabled?: boolean;
  [key: string]: any;
}

export type OnItemMoveType = (
  item: ListDndItemType,
  dataSource: ListDndItemType[],
  result: DropResult,
  provided: ResponderProvided,
) => any;

export interface ListDndProps extends Omit<DragDropContextProps, 'children' | 'onDragEnd'> {
  loading?: boolean;
  className?: string;
  style?: CSSProperties;
  /**数据源 */
  dataSource: ListDndItemType[];
  /**当拖拽列表项时 */
  onItemMove?: OnItemMoveType;
  /**数据发生改变时 */
  onChange: (data: ListDndItemType[]) => void;
  readOnly?: boolean;
  /**重新渲染列表项 */
  renderItem: (row: ListDndItemType, index: number) => React.ReactNode;
  /**禁用拖拽的id数组 */
  disabledKeys?: any[];
  /**当拖拽结束时 */
  onDragEnd?: (result: DropResult, provided: ResponderProvided) => void;
}
