import CustomSelect from '@/components/CustomSelect';
import DragDropTable from '@/components/DragDropTable';
import EditableTable from '@/components/EditableTable';
import PriorityConfig from '@/components/PriorityConfig';
import { requiredRule } from '@/util';
import createFormModal from '@/util/createFormModal';
import { ProFormText } from '@ant-design/pro-form';
import { Button } from 'antd';
import { useCallback } from 'react';
import SearchHighlight from './components/SearchHighlight';
import styles from './index.less';

interface MyPageProps {}

function MyPage(props: MyPageProps) {
  const {} = props;

  const clickModal = useCallback(() => {
    createFormModal({
      title: `弹窗`,
      renderForm: () => (
        <ProFormText
          label="标题"
          name="title"
          placeholder="标题"
          rules={requiredRule()}
          fieldProps={{ autoFocus: true }}
        />
      ),
      onOk: (values: any) => {
        // addBlock(values);
        console.log(values);
      },
    });
  }, []);

  return (
    <>
      <div className={styles.unit}>
        <EditableTable />
      </div>
      <div className={styles.unit}>
        <DragDropTable />
      </div>
      <div className={styles.unit}>
        <div className={styles.priorityConfig}>
          <PriorityConfig />
        </div>
      </div>
      <div className={styles.unit}>
        <div className={styles.customSelect}>
          <CustomSelect />
        </div>
      </div>
      <div className={styles.unit}>
        <SearchHighlight />
      </div>
      <div>
        <Button onClick={clickModal}>添加</Button>
      </div>
    </>
  );
}

export default MyPage;
