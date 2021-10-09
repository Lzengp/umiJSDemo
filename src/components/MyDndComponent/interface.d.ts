import React, { CSSProperties } from 'react';
import {
  DragDropContextProps,
  DraggableProvided,
  DraggableStateSnapshot,
  DragStart,
  DropResult,
  ResponderProvided,
} from 'react-beautiful-dnd';

type DisabledKey = string | number;

export type OnBlockMoveType = (
  data: { block: MyDndComponentItemType; toIndex: number },
  dataSource: MyDndComponentItemType[],
  result: DropResult,
  provided: ResponderProvided,
) => any;

export type OnItemMoveType = (
  data: { block: MyDndComponentItemType; item: DndItemType; toBlock: MyDndComponentItemType; toIndex: number },
  dataSource: MyDndComponentItemType[],
  result: DropResult,
  provided: ResponderProvided,
) => any;

type ChangeType =
  /**移动任务项 */
  | 'move-item'
  /**添加任务项 */
  | 'add-item'
  /**编辑任务项 */
  | 'modify-item'
  /**移动版块 */
  | 'move-block'
  /**添加版块 */
  | 'add-block'
  /**删除版块 */
  | 'del-block'
  /**编辑版块 */
  | 'modify-block';

export interface MyDndComponentProps extends Omit<DragDropContextProps, 'children' | 'onDragEnd' | 'onDragStart'> {
  loading?: boolean;
  className?: string;
  style?: CSSProperties;
  /**数据源 */
  dataSource: MyDndComponentItemType[];
  /**当拖拽版块时 */
  onBlockMove?: OnBlockMoveType;
  /**当拖拽任务时 */
  onItemMove?: OnItemMoveType;
  /**重新渲染添加版块按钮 */
  renderAddBlockBtn?: (addBlockModal: () => void) => React.ReactNode;
  /**渲染操作栏左侧 */
  renderTopBarLeft?: () => React.ReactNode;
  /**渲染操作栏右侧 */
  renderTopBarRight?: () => React.ReactNode;
  /**顶部栏类名 */
  topBarClassName?: string;
  /**顶部栏样式 */
  topBarStyle?: CSSProperties;
  /**自定义增删改查操作事件 */
  customEvent?: CustomEventType;
  /**当拖拽结束时 */
  onDragEnd?: (result: DropResult, provided: ResponderProvided) => void;
  /**数据发生改变时 */
  onChange?: (
    data: MyDndComponentItemType[],
    extra: {
      type: ChangeType;
      block?: MyDndComponentItemType;
      item?: DndItemType;
    },
  ) => void;
  /**拖拽开始时,可返回禁止拖拽放置的id数组 */
  onDragStart?: (
    data: { block?: MyDndComponentItemType; item?: DndItemType; type: 'item' | 'block' },
    initial: DragStart,
    provided: ResponderProvided,
  ) => DisabledKey[] | void;
  /**重新渲染版块标题 */
  renderBlockTitle?: (data: MyDndComponentItemType) => React.ReactNode;
  readOnly?: boolean;
  /**重新渲染任务块 */
  renderItem?: (params: RenderDndItemParams) => React.ReactNode;
  /**操作配置 */
  options?: MyDndOptionsType;
  /**重新渲染添加任务按钮 */
  renderAddItemBtn?: (data: MyDndComponentItemType, option: { addItemModal: () => void; dom: any }) => React.ReactNode;
  /**版块盒子额外样式 */
  blockStyle?: CSSProperties;
  /**重新渲染编辑版块按钮 */
  renderModifyBlockBtn?: (data: MyDndComponentItemType, modifyBlockModal: () => void) => React.ReactNode;
  /**重新渲染删除版块按钮 */
  renderDelBlockBtn?: (data: MyDndComponentItemType) => React.ReactNode;
  /**版块别名 */
  blockAlias?: string;
  /**任务项别名 */
  itemAlias?: string;
  /**渲染额外操作 */
  extraBlockAction?: (data: MyDndComponentItemType) => React.ReactNode;
  /**禁用拖拽的id数组 */
  disabledKeys?: DisabledKey[];
  /**禁止拖拽放置的id数组 */
  disabledEnterKeys?: DisabledKey[];
  /**无排序拖拽 */
  noSortDrag?: boolean;
}

export interface CustomEventType {
  onModifyBlock?: (data: MyDndComponentItemType) => void;
  onAddBlock?: () => void;
  onDelBlock?: (id: string, data: MyDndComponentItemType) => void;
  onModifyItem?: (item: DndItemType, block: MyDndComponentItemType) => void;
  onAddItem?: () => void;
}

export interface MyDndComponentRefType {
  modifyBlock: (id: string, values: any) => MyDndComponentItemType[];
  modifyItem: (id: string, values: any) => MyDndComponentItemType[];
  addItem: (blockId: string, values: any) => MyDndComponentItemType[];
  addBlock: (values: any) => MyDndComponentItemType[];
  delBlock: (id: string) => MyDndComponentItemType[];
}

export interface MyDndOptionsType {
  /**是否渲染添加版块按钮 */
  addBlock?: boolean;
  /**是否渲染添加任务按钮 */
  addItem?: boolean;
  /**是否渲染修改版块按钮 */
  modifyBlock?: boolean;
  /**是否渲染删除版块按钮 */
  delBlock?: boolean;
}

export interface MyDndComponentItemType {
  id: string;
  /**版块标题 */
  title: string;
  list: DndItemType[];
  disabled?: boolean;
  [key: string]: any;
}

export interface DndItemType {
  id: string;
  /**任务块内容 */
  title: string;
  disabled?: boolean;
  /**排序字段,用作无排序拖拽使用 */
  dragSort?: number;
  [key: string]: any;
}

export interface RenderDndItemParams {
  data: DndItemType;
  block: MyDndComponentItemType;
  isDragging: boolean | undefined;
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
  draggedSourceBlockId?: string;
  draggedItemId?: string;
}

export interface DroppableBlockProps {
  data: MyDndComponentItemType;
  index: number;
  onNoSortDrag?: (param: { index: number; targetId?: string }) => void;
}

export interface DndItemProps {
  data: DndItemType;
  block: MyDndComponentItemType;
  index: number;
}

export interface MyDndComponentContextType extends MyDndComponentProps {
  operate?: MyDndComponentRefType;
  drag?: 'item' | 'block';
  dragItemData?: DndItemType;
}

export interface MyDndComponentRefType extends MyDndComponentContextType {}
