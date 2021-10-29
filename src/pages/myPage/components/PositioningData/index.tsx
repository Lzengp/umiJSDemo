import React, {
  useEffect,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import styles from './index.less';
import { Input, Popconfirm, PopconfirmProps, Tree } from 'antd';
import { DeleteOutlined, EditOutlined, PlusCircleFilled, PlusOutlined } from '@ant-design/icons';
import { isCustomArray, uuid } from '@/util';

interface Props {}

const initData = [
  { title: '分类一', key: '0-1', parentKey: '0' },
  { title: '分类一1', key: '0-1-1', parentKey: '0-1' },
  { title: '分类一2', key: '0-1-2', parentKey: '0-1' },
  { title: '分类二', key: '0-2', parentKey: '0' },
  { title: '分类三', key: '0-3', parentKey: '0' },
];

function componentName(props: Props, ref: any) {
  const {} = props;
  const [treeData, setTreeData] = useState<any>();
  const [originalDataSource, setOriginalDataSource] = useState<any[]>(initData);
  const [selectedKeys, setSelectedKeys] = useState<any[]>([]);

  const treeRef = useRef<any>();

  useImperativeHandle(ref, () => ({}));

  /**递归生成树结构 */
  const dataTree = (dataSource: any[], searchVal?: string) => {
    const keys = dataSource.map((item) => item.key);

    function findChildList(data: any): any {
      const childList = dataSource.filter((item) => data.key === item.parentKey);
      if (isCustomArray(childList)) {
        return {
          ...data,
          children: childList?.map((item) => findChildList(item)),
        };
      }
      return {
        ...data,
      };
    }

    // 获取父节点（在所有key中，parentKey只出现过一次）
    const topList = dataSource.filter((item) => !keys.includes(item.parentKey));
    return topList.map((item) => findChildList(item));
  };

  useEffect(() => {
    const data = dataTree(originalDataSource);
    setTreeData(data);
  }, [originalDataSource]);

  /**编辑 */
  const editTreeData = useCallback(
    (values: any, parentNode?: any) => {
      const data = [...originalDataSource];
      data.map((item) => {
        if (parentNode.key === item.key) {
          item.title = values.title;
        }
      });
      setOriginalDataSource(data);
    },
    [originalDataSource],
  );

  // /**新增 */
  const addTreeData = useCallback(
    (values: any, parentNode?: any) => {
      const key = uuid();
      const params = {
        ...values,
        parentKey: parentNode?.key || '0',
        key,
      };
      const data = [...originalDataSource];
      data.push(params);
      setOriginalDataSource(data);
      new Promise((resolve, reject) => {
        // 默认展开
        treeRef.current?.setExpandedKeys([
          ...treeRef.current?.state.expandedKeys,
          parentNode?.key || '0',
        ]);
        resolve(true);
      }).then(() => {
        // 默认选择上，需要等展开之后才给选中值
        setSelectedKeys([key]);
      });
      // .then(() => {
      //   // 定位到当前选中的树
      //   var row = document.getElementById(key);
      //   row?.scrollIntoView();
      // });
    },
    [originalDataSource],
  );

  /**删除 */
  const delTreeData = useCallback(
    (values: any, parentNode?: any) => {
      const orgData = [...originalDataSource];
      const data = orgData.filter((item) => item.key !== parentNode.key);
      console.log(data, orgData);
      setOriginalDataSource(data);
    },
    [originalDataSource],
  );

  const titleRender = useCallback(
    (nodeData) => {
      return (
        <div className={styles.title} id={nodeData.key}>
          <div>{nodeData.title}</div>
          <div className={styles.operationTree}>
            <EditPopconfirm
              defaultValue={nodeData.title}
              onConfirm={(title) => editTreeData({ title }, nodeData)}
            >
              <EditOutlined title="编辑" />
            </EditPopconfirm>
            <EditPopconfirm onConfirm={(title) => addTreeData({ title }, nodeData)}>
              <PlusOutlined title="新增" />
            </EditPopconfirm>
            <Popconfirm
              title="确定删除吗？"
              okText="删除"
              cancelText="取消"
              okButtonProps={{ danger: true }}
              onConfirm={(title) => delTreeData({ title }, nodeData)}
            >
              <DeleteOutlined title="删除" />
            </Popconfirm>
          </div>
        </div>
      );
    },
    [originalDataSource],
  );

  /**顶部栏 */
  const toolbarBar = useMemo(() => {
    return (
      <div className={styles.topBar}>
        {/* <Input
          className={styles.input}
          allowClear
          suffix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
          placeholder="搜索"
          // onChange={(e) => onSearch(e.target.value)}
        /> */}

        <EditPopconfirm onConfirm={(title) => addTreeData({ title })}>
          <PlusCircleFilled className={styles.addIcon} title="新增" />
        </EditPopconfirm>
      </div>
    );
  }, [originalDataSource]);

  return (
    <div className={styles.wrap}>
      {toolbarBar}
      <Tree
        className={styles.treeWrap}
        ref={treeRef}
        selectedKeys={selectedKeys}
        onSelect={(keys, info) => {
          setSelectedKeys(keys);
        }}
        treeData={treeData}
        titleRender={titleRender}
      />
    </div>
  );
}

interface EditPopconfirmProps extends Omit<PopconfirmProps, 'onConfirm' | 'title'> {
  onConfirm?: (title: string) => void;
  title?: React.ReactNode;
  defaultValue?: string;
}
function EditPopconfirm(props: EditPopconfirmProps) {
  const { onConfirm, onVisibleChange, children, onCancel, defaultValue, ...popconfirmProps } =
    props;
  const [visible, set_visible] = useState<boolean>(false);
  const [inputVal, set_inputVal] = useState<string | undefined>(defaultValue);
  const inputRef = useRef<Input>(null);
  const PopconfirmRef = useRef<any>(null);

  const confirm = useCallback(() => {
    if (onConfirm && inputVal) onConfirm(inputVal);
    set_inputVal(undefined);
    set_visible(false);
  }, [inputVal, onConfirm]);

  useEffect(() => {}, [visible]);

  return (
    <Popconfirm
      ref={PopconfirmRef}
      overlayClassName={styles.popconfirm}
      icon={null}
      okText="确定"
      cancelText="取消"
      visible={visible}
      title={
        <Input
          ref={inputRef}
          size="small"
          allowClear
          autoFocus
          value={inputVal}
          onChange={(e) => set_inputVal(e.target.value)}
          onKeyDown={({ key }) => key === 'Enter' && confirm()}
        />
      }
      onConfirm={confirm}
      onVisibleChange={(visible, e) => {
        if (onVisibleChange) onVisibleChange(visible, e);
        if (visible) {
          setTimeout(() => inputRef.current?.focus());
          set_inputVal(defaultValue);
        }
      }}
      onCancel={(e) => {
        if (onCancel) onCancel(e);
        set_visible(false);
      }}
      {...popconfirmProps}
    >
      <div style={{ display: 'flex', alignItems: 'center' }} onClick={() => set_visible(true)}>
        {children}
      </div>
    </Popconfirm>
  );
}

export default forwardRef(componentName);
