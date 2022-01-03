import { UploadOutlined } from '@ant-design/icons';
import { Button, message, Upload } from 'antd';
import { useState } from 'react';
import { FileType } from './interface';

interface UploadField {
  maxSize?: number; // 上传文件大小限制
  promptInfo?: string;
  disabled?: boolean;
  maxCount?: number; // 上传的最大数量限制
  fileType?: string; // 限制的上传类型，字符串类型，例如： 'png,jpg,doc'
  ctx?: any;
}

function UploadField(props: any) {
  // props如果是EnterInputProps类型，在注册插件的时候提示警告
  const { maxSize, promptInfo, disabled, ctx, maxCount, fileType, value } = props;

  const [fileList, setFileList] = useState<Array<any>>(value || []); // 文件上传列表

  const beforeUpload = async (file: any) => {
    /**文件上传大小限制 */
    if (maxSize && Number((Number(file.size) / 1024 / 1024).toFixed(2)) > maxSize) {
      message.error(`上传文件大小不能超过${maxSize}M`);
      return false;
    }
    /**上传文件类型限制 */
    if (fileType && !fileType.includes(file.name.split('.')[1])) {
      message.error(`请上传指定类型的文件`);
      return false;
    }

    return file;
  };

  const uploadProps = {
    name: 'file',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info: any) {
      console.log(info);
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        setFileList([...info.fileList]);
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    beforeUpload,
    // ...props,
  };

  const maxCountDisable = maxCount ? maxCount <= fileList.length : false; // 最大上传数量限制(注意: Upload的disabled属性如果是true,那么已经上传的就无法删除了 )

  return (
    <div style={{ display: 'flex', position: 'relative' }}>
      <Upload disabled={disabled || ctx.mode === 'view'} {...uploadProps}>
        {ctx.mode !== 'view' && (
          <Button disabled={disabled || maxCountDisable} icon={<UploadOutlined />} type="link">
            点击上传
          </Button>
        )}
      </Upload>
      {promptInfo && (
        <div
          style={{ marginTop: 5, position: 'absolute', left: 100 }}
          dangerouslySetInnerHTML={{ __html: promptInfo }}
        />
      )}
    </div>
  );
}

export default UploadField;
