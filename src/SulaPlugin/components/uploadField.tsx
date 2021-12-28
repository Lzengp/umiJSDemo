import { UploadOutlined } from '@ant-design/icons';
import { Button, message, Select, Upload } from 'antd';

function UploadField(props: any) {
  // props如果是EnterInputProps类型，在注册插件的时候提示警告
  const {} = props;

  const props1 = {
    name: 'file',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <Upload {...props1}>
      <Button icon={<UploadOutlined />} type="link">点击上传</Button>
    </Upload>
  );
}

export default UploadField;
