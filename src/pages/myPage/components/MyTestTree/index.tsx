import React, { useState } from 'react';
import { Tree } from 'antd';

interface MyTestTreeProps {}

function MyTestTree(props: MyTestTreeProps) {
  const treeData = [
    {
      title: 'parent 0-0',
      key: '0-0',
      children: [
        {
          title: 'parent 0-0-0',
          key: '0-0-0',
          // disabled: true,
          children: [
            {
              title: 'leaf 0-0-0-0',
              key: '0-0-0-0',
              //   disableCheckbox: true,
            },
            {
              title: 'leaf 0-0-0-1',
              key: '0-0-0-1',
            },
            {
              title: 'leaf 0-0-0-2',
              key: '0-0-0-2',
            },
          ],
        },
        {
          title: 'parent 0-0-1',
          key: '0-0-1',
          children: [
            { title: <span style={{ color: '#000' }}>sss 0-0-1-0</span>, key: '0-0-1-0' },
            { title: <span style={{ color: '#000' }}>sss 0-0-1-1</span>, key: '0-0-1-1' },
          ],
        },
      ],
    },
  ];

  const [checkedKeys, setCheckedKeys] = useState<any>();
  const [dataSoure, setDataSoure] = useState<any>(treeData);

  const Demo = () => {
    const onSelect = (selectedKeys: React.Key[], info: any) => {
      console.log('selected', selectedKeys, info);
    };

    const onCheck = (checkedKeys: any, info: any) => {
      console.log('onCheck', checkedKeys, info);
      //   setCheckedKeys(checkedKeys); // 不需要完全受控的时候直接set

      let checkedArr = { ...checkedKeys };
      // 当前节点选中，手动受控
      if (info.node.children) handleCheckedTreeData(info.node.children, info.checked);

      //   handleTreeData(dataSoure, (data: any) => {});
      handleTreeData(dataSoure, info.node);
      setTimeout(() => {

        setDataSoure(dataSoure);
        setCheckedKeys(checkedArr);
      });

      /**这个方法使处理当前节点及下面所有的子节点被选中或者取消选中，使节点完全受控 */
      function handleCheckedTreeData(data: any, checked: boolean) {
        console.log(data);
        data.map((item: any) => {
          checked && checkedArr.checked.push(item.key); // 选中
          if (!checked)
            checkedArr.checked = [...checkedArr.checked.filter((ele: any) => ele !== item.key)]; // 取消选中
          if (item.children) handleCheckedTreeData(item.children, checked);
        });
      }

      // 这个方法使为了处理当前节点控制其他父的子节点
      function handleTreeData(data: any, operateNode: any) {
        data.map((item: any) => {
          /**处理当前节点影响其他的同级子节点 */
          if (checkedKeys.checked?.includes('0-0-1') && item.key === '0-0-0-0') {
            console.log('处理当前节点影响其他的同级子节点', checkedKeys);
            // if (checkedKeys?.includes('0-0-1') && item.key === '0-0-0-0') {
            checkedArr.checked.push(item.key);
            item.disableCheckbox = true;
            item.disabled = true;
          }
          if (!checkedKeys.checked?.includes('0-0-1') && operateNode.key === '0-0-1' && item.key === '0-0-0-0') {
            checkedArr.checked = [...checkedArr.checked.filter((ele: any) => ele !== item.key)];
            item.disableCheckbox = false;
            item.disabled = false;
          }
          if (item.children) handleTreeData(item.children, operateNode);
        });
      }
    };

    return (
      <Tree
        checkable
        checkedKeys={checkedKeys}
        defaultExpandedKeys={['0-0-0', '0-0-1']}
        //   defaultSelectedKeys={['0-0-0', '0-0-1']}
        //   defaultCheckedKeys={['0-0-0', '0-0-1']}
        onSelect={onSelect}
        onCheck={onCheck}
        treeData={dataSoure}
        checkStrictly={true} // 父子节点不联动
      />
    );
  };

  console.log(checkedKeys, dataSoure);

  return <>{Demo()}</>;
}

export default MyTestTree;
