import classNames from 'classnames';
import React, { useState, useCallback, forwardRef, useImperativeHandle, useMemo, useRef, ElementRef } from 'react';
import styles from './index.less';
import { ListDndItemType, ListDndProps } from './interface';
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot,
  DropResult,
  ResponderProvided,
} from 'react-beautiful-dnd';
import { Spin } from 'antd';

function ListDnd(props: ListDndProps, ref: any) {
  const {
    style,
    className,
    loading = false,
    onDragStart,
    onChange,
    onItemMove,
    readOnly,
    disabledKeys = [],
    dataSource,
  } = props;
  const [drag, set_drag] = useState<boolean>(false);
  const contentRef = useRef<ElementRef<'div'>>(null);

  useImperativeHandle(ref, () => ({}));

  /**当拖拽结束时 */
  const onDragEnd = useCallback(
    async (result: DropResult, provided: ResponderProvided) => {
      set_drag(false);
      if (contentRef.current) contentRef.current.style.height = '';
      if (props.onDragEnd) props.onDragEnd(result, provided);

      const { destination, source, draggableId, type } = result;
      //当拖拽后的位置未发生变化,则不触发数据改变操作
      if (destination?.droppableId === source.droppableId && destination.index === source.index) return;

      if (typeof destination?.index === 'number' && type === 'item') {
        const newData = [...dataSource];
        const [sourceData] = newData.splice(source.index, 1);
        if (sourceData) newData.splice(destination.index, 0, sourceData);
        if (onItemMove && sourceData) onItemMove(sourceData, newData, result, provided);
        if (onChange) onChange(newData);
      }
    },
    [props.onDragEnd, dataSource],
  );

  const renderItem = useCallback(
    (row: ListDndItemType, index: number) => {
      const isDragDisabled = row.disabled || readOnly || disabledKeys.includes(row.id);
      return (
        <Draggable
          isDragDisabled={row.disabled || readOnly || disabledKeys.includes(row.id)}
          draggableId={row.id}
          index={index}
        >
          {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
            <div
              ref={provided.innerRef}
              className={classNames(`${row.id}--item`, isDragDisabled && 'dropDisabled')}
              {...provided.draggableProps}
            >
              <div
                draggable
                {...provided.dragHandleProps}
                onMouseDown={() => {
                  if (!isDragDisabled && contentRef.current) {
                    contentRef.current.style.height = `${contentRef.current.offsetHeight}px`;
                  }
                }}
                onMouseUp={() => {
                  if (contentRef.current) contentRef.current.style.height = '';
                }}
              >
                {props.renderItem(row, index)}
              </div>
            </div>
          )}
        </Draggable>
      );
    },
    [props.renderItem, readOnly, disabledKeys],
  );

  return (
    <div className={classNames(styles.ListDnd, className, 'ListDnd', drag && 'drag')} style={style}>
      <Spin spinning={loading}>
        <div ref={contentRef} className={styles.content}>
          <DragDropContext
            onDragEnd={onDragEnd}
            onDragStart={(initial, provided) => {
              set_drag(true);
              if (onDragStart) onDragStart(initial, provided);
            }}
          >
            <Droppable droppableId="horizontalContainer" direction="vertical" type="item">
              {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
                <div ref={provided.innerRef}>
                  {dataSource.map((item, index) => (
                    <React.Fragment key={item.id}>{renderItem(item, index)}</React.Fragment>
                  ))}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </Spin>
    </div>
  );
}

export default forwardRef(ListDnd);
