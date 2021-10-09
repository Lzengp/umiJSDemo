import React, { useContext } from 'react';
import { Draggable, DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';
import classnames from 'classnames';
import styles from './index.less';
import { DndItemProps, DndItemType } from '../../interface';
import Context from '../../context';

/** 可拖动元素 */
const DndItem = (props: DndItemProps) => {
  const { data, index, block } = props;
  const { renderItem, readOnly, disabledKeys = [], drag } = useContext(Context);

  const isDragging = drag === 'item';

  return (
    <Draggable
      isDragDisabled={data.disabled || readOnly || disabledKeys.includes(data.id)}
      draggableId={data.id}
      index={index}
    >
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <div
          ref={provided.innerRef}
          id={data.id}
          className={classnames(
            styles.dndItem,
            `${data.id}--item`,
            isDragging ? `${data.id}--item-dragging` : undefined,
          )}
          datatype={String(data.dragSort || 0)}
          {...provided.draggableProps}
          {...(renderItem ? {} : provided.dragHandleProps)} // 默认拖动控制元素，如果传入render则需要在render中使用dragHandleProps
        >
          {renderItem ? renderItem({ data, isDragging, provided, snapshot, block }) : <DefaultContent data={data} />}
        </div>
      )}
    </Draggable>
  );
};

/** 默认Item展示 */
const DefaultContent = ({ data }: { data: DndItemType }) => <div style={{ padding: '8px' }}>{data.title}</div>;

export default DndItem;
