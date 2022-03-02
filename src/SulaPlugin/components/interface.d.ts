export interface FileType {
  uid: string;
  name: string;
  size: number;
  type: string;
  [key: string]: any;
}

export interface UploadFieldProps {
  maxSize?: number; // 上传文件大小限制
  promptInfo?: string;
  disabled?: boolean;
  maxCount?: number; // 上传的最大数量限制
  fileType?: string; // 限制的上传类型，字符串类型，例如： 'png,jpg,doc'
  ctx?: any;
  value: any;
}
