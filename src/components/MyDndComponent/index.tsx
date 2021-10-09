import React, { useEffect, useState, useCallback, forwardRef, useImperativeHandle, useMemo } from 'react';
import styles from './index.less';
import {
  DragDropContext,
  DragStart,
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot,
  DropResult,
  ResponderProvided,
} from 'react-beautiful-dnd';
import DroppableBlock from './components/DroppableBlock';
import classNames from 'classnames';
import { DndItemType, MyDndComponentItemType, MyDndComponentProps } from './interface';
import { requiredRule, uuid } from '@/util';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
// import createFormModal from '@/util/createFormModal';
// import { ProFormText } from '@ant-design/pro-form';
import Context from './context';

function MyDndComponent(props: MyDndComponentProps, ref: any) {
  const {
    onItemMove,
    onBlockMove,
    onChange,
    dataSource,
    renderAddBlockBtn,
    loading = false,
    className,
    style,
    renderTopBarLeft,
    renderTopBarRight,
    topBarClassName,
    topBarStyle,
    customEvent,
    blockAlias = '版块',
    itemAlias = '工作项',
    onBeforeCapture,
    onBeforeDragStart,
    onDragStart,
    onDragUpdate,
    onDragEnd: propsOnDragEnd,
    dragHandleUsageInstructions,
    nonce,
    enableDefaultSensors,
    sensors,
    readOnly,
    disabledEnterKeys: propsDisabledEnterKeys,
    noSortDrag,
    ...blockProps
  } = props;
  /**拖拽中类型 */
  const [drag, set_drag] = useState<'item' | 'block'>();
  const [dragItemData, set_dragItemData] = useState<DndItemType>();
  const [noSortDragData, set_noSortDragData] = useState<{ blockId: string; index: number }>();
  //用于拖住中禁止放置操作与样式控制
  const [tmpDisabledEnterKeys, set_tmpDisabledEnterKeys] = useState<any[]>([]);
  const { addBlock: isAddBlock = true } = blockProps.options || {};
  const { onAddBlock } = customEvent || {};

  const dataMap = useMemo(() => {
    const blockMap: { [key: string]: MyDndComponentItemType } = {};
    const itemMap: { [key: string]: DndItemType } = {};
    dataSource?.forEach((item) => {
      blockMap[item.id] = item;
      item.list?.forEach((r) => (itemMap[r.id] = r));
    });
    return { blockMap, itemMap };
  }, [dataSource]);

  const dragDropContextProps = {
    onBeforeCapture,
    onBeforeDragStart,
    onDragStart,
    onDragUpdate,
    onDragEnd: propsOnDragEnd,
    dragHandleUsageInstructions,
    nonce,
    enableDefaultSensors,
    sensors,
  };

  const contentBoxId = useMemo(() => uuid(), []);

  const disabledEnterKeys = useMemo(
    () => [...(propsDisabledEnterKeys || []), ...tmpDisabledEnterKeys],
    [propsDisabledEnterKeys, tmpDisabledEnterKeys],
  );

  //鼠标滑轮水平滚动
  useEffect(() => {
    const mainBox = document.getElementById(contentBoxId);
    if (mainBox) {
      mainBox.addEventListener('wheel', handler, false);

      function handler(e: any) {
        if (`${e.target.className}`.includes(styles.myDndComponent)) {
          function top() {
            if (mainBox) mainBox.scrollLeft = mainBox.scrollLeft - 100;
          }
          function bottom() {
            if (mainBox) mainBox.scrollLeft = mainBox.scrollLeft + 100;
          }
          if (e.wheelDelta) {
            //判断浏览器IE，谷歌滑轮事件
            if (e.wheelDelta > 0) top();
            if (e.wheelDelta < 0) bottom();
          } else if (e.detail) {
            //Firefox滑轮事件
            if (e.detail > 0) top();
            if (e.detail < 0) bottom();
          }
        }
      }

      return () => {
        mainBox.removeEventListener('scroll', handler, false);
      };
    }
  }, [contentBoxId]);

  /**修改版块 */
  const modifyBlock = useCallback(
    (id: string, values: any) => {
      const newData = dataSource.map((item) => {
        if (item.id === id) return values;
        return item;
      });
      if (onChange) onChange(newData, { type: 'modify-block', block: values });
      return newData;
    },
    [dataSource, onChange],
  );

  /**添加版块 */
  const addBlock = useCallback(
    (values: any) => {
      const newData = [...dataSource, { id: uuid(), ...values }];
      if (onChange) onChange(newData, { type: 'add-block', block: values });
      return newData;
    },
    [dataSource, onChange],
  );

  /**删除版块 */
  const delBlock = useCallback(
    (id) => {
      const delData = dataSource.find((item) => item.id === id);
      const newData = dataSource.filter((item) => item.id !== id);
      if (onChange) onChange(newData, { type: 'del-block', block: delData });
      return newData;
    },
    [dataSource],
  );

  const addBlockModal = useCallback(() => {
    if (onAddBlock) return onAddBlock();
    // createFormModal({
    //   title: `添加${blockAlias}`,
    //   renderForm: () => (
    //     <ProFormText
    //       label={blockAlias}
    //       name="title"
    //       placeholder={blockAlias}
    //       rules={requiredRule()}
    //       fieldProps={{ autoFocus: true }}
    //     />
    //   ),
    //   onOk: (values: any) => {
    //     addBlock(values);
    //   },
    // });
  }, [modifyBlock, addBlock, onAddBlock, blockAlias]);

  /**修改任务项 */
  const modifyItem = useCallback(
    (id: string, values: any) => {
      const newData = [...dataSource];
      newData.find((item) =>
        item.list.some((r) => {
          if (r.id === id) {
            r = values;
            return true;
          }
        }),
      );
      if (onChange) onChange(newData, { type: 'move-item', item: values });
      return newData;
    },
    [dataSource, onChange],
  );

  /**新增任务项 */
  const addItem = useCallback(
    (blockId: string, values: any) => {
      const newData = [...dataSource];
      const newItem = { id: uuid(), ...values };
      newData.find((item) => {
        if (item.id === blockId) {
          item.list.push(newItem);
          return true;
        }
      });
      if (onChange) onChange(newData, { type: 'add-item', item: newItem });
      return newData;
    },
    [dataSource, onChange],
  );

  /**当拖拽结束时 */
  const onDragEnd = useCallback(
    async (result: DropResult, provided: ResponderProvided) => {
      set_drag(undefined);
      set_dragItemData(undefined);
      if (tmpDisabledEnterKeys.length) set_tmpDisabledEnterKeys([]);
      if (dragDropContextProps.onDragEnd) dragDropContextProps.onDragEnd(result, provided);

      //无排序拖拽拖拽数据处理与样式重置
      if (noSortDrag && noSortDragData) {
        const { blockId, index } = noSortDragData;

        result.destination = { droppableId: blockId, index };
        set_noSortDragData(undefined);
      }

      const { destination, source, draggableId, type } = result;
      //当拖拽后的位置未发生变化,则不触发数据改变操作
      if (destination?.droppableId === source.droppableId && destination.index === source.index) return;

      if (typeof destination?.index === 'number') {
        const newData = [...dataSource];
        //移动任务
        if (type === 'item') {
          const sourceData = dataSource.find((item) => item.id === source.droppableId);
          const destinationData = dataSource.find((item) => item.id === destination?.droppableId);

          if (sourceData && destinationData) {
            const res = sourceData.list.find((item) => item.id === draggableId);
            sourceData.list = sourceData.list.filter((item) => item.id !== draggableId);
            if (res) {
              destinationData.list.splice(destination.index, 0, res);
              if (onItemMove) {
                onItemMove(
                  { block: sourceData, item: res, toBlock: destinationData, toIndex: destination.index },
                  newData,
                  result,
                  provided,
                );
              }
            }
          }
        }

        //移动版块
        if (type === 'block') {
          const [sourceData] = newData.splice(source.index, 1);
          if (sourceData) newData.splice(destination.index, 0, sourceData);
          if (onBlockMove && sourceData) {
            onBlockMove({ block: sourceData, toIndex: destination.index }, newData, result, provided);
          }
        }

        if (onChange) onChange(newData, { type: type === 'item' ? 'move-item' : 'move-block' });
      }
    },
    [
      dataSource,
      onItemMove,
      onBlockMove,
      onChange,
      dragDropContextProps.onDragEnd,
      tmpDisabledEnterKeys,
      noSortDrag,
      noSortDragData,
    ],
  );

  /**当拖拽开始 */
  const dragStart = useCallback(
    (initial: DragStart, provided: ResponderProvided) => {
      set_drag(initial.type as any);
      if (initial.type === 'item') set_dragItemData(dataMap.itemMap[initial.draggableId]);
      if (dragDropContextProps.onDragStart) {
        let block: MyDndComponentItemType | undefined = undefined;
        let item: DndItemType | undefined = undefined;

        if (initial.type === 'item') {
          block = dataMap.blockMap[initial.source.droppableId];
          item = dataMap.itemMap[initial.draggableId];
        } else {
          block = dataMap.blockMap[initial.draggableId];
        }

        const disabledKeys = dragDropContextProps.onDragStart(
          { block, item, type: initial.type as any },
          initial,
          provided,
        );

        if (disabledKeys || noSortDrag) {
          set_tmpDisabledEnterKeys((disabledKeys || []).filter((item) => !block || item !== block.id));
        }
      }
    },
    [dragDropContextProps.onDragStart, dataMap],
  );

  const contextVal: any = useMemo(() => {
    return {
      ...props,
      disabledEnterKeys,
      operate: { modifyBlock, modifyItem, addItem, addBlock, delBlock },
      blockAlias,
      itemAlias,
      drag,
      dragItemData,
    };
  }, [props, disabledEnterKeys, modifyBlock, modifyItem, addItem, addBlock, delBlock, drag, dragItemData]);

  useImperativeHandle(ref, () => contextVal);

  return (
    <div
      className={classNames(styles.mainBox, className, 'myDndComponent', drag && 'drag', drag && `dragAndDrop-${drag}`)}
      style={style}
    >
      <Context.Provider value={contextVal}>
        <div style={topBarStyle} className={classNames(styles.topBar, topBarClassName)}>
          <div className={styles.left}>{renderTopBarLeft && renderTopBarLeft()}</div>
          {renderTopBarRight && <div>{renderTopBarRight()}</div>}
        </div>
        <div id={contentBoxId} className={styles.content}>
          <DragDropContext {...dragDropContextProps} onDragEnd={onDragEnd} onDragStart={dragStart}>
            <Droppable droppableId="horizontalContainer" direction="horizontal" type="block">
              {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
                <div ref={provided.innerRef} className={classNames(styles.myDndComponent, `myDndComponent--block`)}>
                  {dataSource.map((item, index) => (
                    <DroppableBlock
                      key={item.id}
                      data={item}
                      index={index}
                      {...blockProps}
                      onNoSortDrag={({ index }) => set_noSortDragData({ index, blockId: item.id })}
                    />
                  ))}
                  {isAddBlock && !readOnly && (
                    <div className={styles.addBlockContainer}>
                      {renderAddBlockBtn ? (
                        renderAddBlockBtn(addBlockModal)
                      ) : (
                        <div
                          style={{ width: blockProps.blockStyle?.width }}
                          className={styles.addBlockBox}
                          onClick={addBlockModal}
                        >
                          <PlusOutlined />
                          <span className={styles.text}>添加新{blockAlias}...</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
        {loading && (
          <div className={styles.loadingMask}>
            <LoadingOutlined />
          </div>
        )}
      </Context.Provider>
    </div>
  );
}

export default forwardRef(MyDndComponent);
