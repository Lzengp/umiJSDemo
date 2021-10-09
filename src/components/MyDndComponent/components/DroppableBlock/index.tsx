// import { BtnPoponfirm } from '@/components/SiderMenu';
// import { requiredRule, uuid } from '@/util';
// import createFormModal from '@/utils/createFormModal';
import { MoreOutlined, PlusOutlined } from '@ant-design/icons';
// import { ProFormText } from '@ant-design/pro-form';
import { Dropdown } from 'antd';
import classNames from 'classnames';
import React, { forwardRef, useImperativeHandle, useCallback, useMemo, useContext, useState, useEffect } from 'react';
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot,
} from 'react-beautiful-dnd';
import { DroppableBlockProps } from '../../interface';
import DndItem from '../DndItem';
import styles from './index.less';
import Context from '../../context';

function DroppableBlock(props: DroppableBlockProps, ref: any) {
  const { data, index, onNoSortDrag } = props;
  const {
    readOnly,
    customEvent,
    disabledEnterKeys = [],
    disabledKeys = [],
    operate,
    blockAlias,
    itemAlias,
    blockStyle,
    renderBlockTitle,
    options = {},
    renderAddItemBtn,
    renderModifyBlockBtn,
    renderDelBlockBtn,
    extraBlockAction,
    noSortDrag,
    drag,
    dragItemData,
  } = useContext(Context);
  const [dragLoading, set_dragLoading] = useState<boolean>(false);
  const { addItem: isAddItem = true, modifyBlock: isModifyBlock = true, delBlock: isDelBlock = true } = options;
  const { modifyBlock, addItem, modifyItem, addBlock, delBlock } = operate || {};
  const { onAddItem, onModifyItem, onModifyBlock, onDelBlock } = customEvent || {};
  const { id: dragId } = dragItemData || {};

  useImperativeHandle(ref, () => ({}));

  useEffect(() => {
    if (!dragItemData) set_dragLoading(false);
  }, [dragItemData]);

  const editItem = useCallback(
    (initialValues?: any) => {
      if (onAddItem && !initialValues) return onAddItem();
      if (onModifyItem && initialValues) return onModifyItem(initialValues, data);
      // createFormModal({
      //   title: initialValues ? `修改${itemAlias}` : `添加${itemAlias}`,
      //   proFormProps: { initialValues },
      //   renderForm: () => (
      //     <ProFormText
      //       label={itemAlias}
      //       name="title"
      //       placeholder={itemAlias}
      //       rules={requiredRule()}
      //       fieldProps={{ autoFocus: true }}
      //     />
      //   ),
      //   onOk: (values) => {
      //     if (!initialValues) {
      //       if (addItem) addItem(data.id, { ...values, id: uuid() });
      //     } else {
      //       if (modifyItem) modifyItem(initialValues.id, { ...initialValues, ...values });
      //     }
      //   },
      // });
    },
    [data, addItem, modifyItem, onAddItem, onModifyItem, itemAlias],
  );

  const modifyBlockModal = useCallback(
    (initialValues: any) => {
      if (onModifyBlock) return onModifyBlock(initialValues);
      // createFormModal({
      //   title: `修改${blockAlias}`,
      //   proFormProps: { initialValues },
      //   renderForm: () => (
      //     <ProFormText
      //       label={blockAlias}
      //       name="title"
      //       placeholder={blockAlias}
      //       rules={requiredRule()}
      //       fieldProps={{ autoFocus: true }}
      //     />
      //   ),
      //   onOk: (values) => {
      //     if (modifyBlock) modifyBlock(initialValues.id, { ...initialValues, ...values });
      //   },
      // });
    },
    [modifyBlock, addBlock, onModifyBlock, blockAlias],
  );

  const addItemBtnDom = (
    <div className={styles.addItemBtn}>
      <PlusOutlined />
      <span className={styles.text}>添加新{itemAlias}...</span>
    </div>
  );

  /**禁止拖拽放置 */
  const isDropDisabled = useMemo(
    () => readOnly || disabledEnterKeys.includes(data.id),
    [disabledEnterKeys, data, readOnly],
  );

  /**禁止拖拽 */
  const isDragDisabled = useMemo(
    () => data.disabled || readOnly || disabledKeys.includes(data.id),
    [disabledKeys, data, readOnly],
  );

  //不等于当前拖拽任务的版块
  const showSortDragMask = useMemo(() => !(data.list || []).some((item) => item.id === dragId), [data, dragId]);

  /**无排序拖拽的监听实现 */
  const noSortDragMask = useMemo(() => {
    if (!showSortDragMask) return null;

    return (
      <div
        className={classNames(styles.noSortDragMask, 'noSortDragMask')}
        onMouseUp={() => {
          const item = document.getElementById(`${dragId}`);
          if (onNoSortDrag && item) {
            const dragSort = Number(item.getAttribute('datatype') || '0');

            const sortList = data.list.map((r) => r.dragSort || 0);
            sortList.push(dragSort);
            const index = sortList.sort((a, b) => a - b).indexOf(dragSort);

            onNoSortDrag({ index });

            item.style.transition = `transform 0.2s`;
            item.style.opacity = `0`;
          }
        }}
      />
    );
  }, [dragId, data, showSortDragMask, dragItemData, dragLoading]);

  return (
    <div className={classNames(styles.blockBox, 'blockBox')}>
      <Draggable isDragDisabled={isDragDisabled} draggableId={data.id} index={index}>
        {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
          <div
            ref={provided.innerRef}
            className={classNames(styles.block, `${data.id}--block`, isDropDisabled && 'dropDisabled')}
            style={blockStyle}
            {...provided.draggableProps}
          >
            <div
              className={classNames(styles.blockTitleBox, 'block-title', `${data.id}--block-title`)}
              {...provided.dragHandleProps}
            >
              {renderBlockTitle ? renderBlockTitle(data) : <div className={styles.blockTitle}>{data.title}</div>}
              {(isModifyBlock || isDelBlock) && !readOnly && (
                <Dropdown
                  className={styles.moreBtn}
                  placement="bottomLeft"
                  overlay={
                    <ul>
                      {isModifyBlock &&
                        (renderModifyBlockBtn ? (
                          renderModifyBlockBtn(data, () => modifyBlockModal(data))
                        ) : (
                          <li className={styles.menuItem} onClick={() => modifyBlockModal(data)}>
                            编辑
                          </li>
                        ))}
                      {isDelBlock &&
                        (renderDelBlockBtn ? (
                          renderDelBlockBtn(data)
                        ) : (
                          // <BtnPoponfirm
                          //   onConfirm={() => {
                          //     if (onDelBlock) onDelBlock(data.id, data);
                          //     else if (delBlock) delBlock(data.id);
                          //   }}
                          // >
                            <li className={styles.menuItem}>删除</li>
                          // </BtnPoponfirm>
                        ))}
                      {extraBlockAction && extraBlockAction(data)}
                    </ul>
                  }
                >
                  <MoreOutlined />
                </Dropdown>
              )}
            </div>
            <Droppable isDropDisabled={isDropDisabled || noSortDrag} droppableId={data.id} type="item">
              {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
                <div
                  ref={provided.innerRef}
                  className={classNames(styles.itemlist, 'itemlist', `${data.id}--itemlist`)}
                >
                  {data.list?.map((item, index) => (
                    <DndItem key={item.id} block={data} data={item} index={index} />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            {isAddItem &&
              !readOnly &&
              (renderAddItemBtn ? (
                renderAddItemBtn(data, { addItemModal: editItem, dom: addItemBtnDom })
              ) : (
                <div onClick={() => editItem()}>{addItemBtnDom}</div>
              ))}
          </div>
        )}
      </Draggable>
      {drag === 'item' && !isDropDisabled && noSortDrag && noSortDragMask}
    </div>
  );
}

export default forwardRef(DroppableBlock);
