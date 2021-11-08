import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

interface Props {}

function PageLoading(props: Props) {
  const {} = props;

  const antIcon = <LoadingOutlined style={{ fontSize: 30 }} spin />;

  return (
    <Spin
      indicator={antIcon}
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    />
  );
}

export default PageLoading;
