import CustomSelect from '@/components/CustomSelect';
import DragDropTable from '@/components/DragDropTable';
import EditableTable from '@/components/EditableTable';
import PriorityConfig from '@/components/PriorityConfig';
import styles from './index.less';

interface MyPageProps {}

function MyPage(props: MyPageProps) {
  const {} = props;

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
    </>
  );
}

export default MyPage;
