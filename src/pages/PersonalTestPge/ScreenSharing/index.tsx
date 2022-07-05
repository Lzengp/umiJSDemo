import { Button, message } from 'antd';
import { useState } from 'react';

// 屏幕共享
const ScreenSharing = () => {
  const [disabled, setDisabled] = useState<boolean>(false);

  const start = () => {
    navigator.mediaDevices.getDisplayMedia({ video: true }).then(handleSuccess, handleError);
  };

  const handleSuccess = (stream: any) => {
    setDisabled(true);
    const video = document.querySelector('video');
    video[`srcObject`] = stream;
    stream.getVideoTracks()[0].addEventListener('ended', () => {
    //   message.error(`错误`);
      video[`srcObject`] = null;
      setDisabled(false);
    });
  };

  const handleError = (error) => {
    message.error(`错误：${error.name}`, error);
  };

  return (
    <>
      <Button
        onClick={() => {
          start();
        }}
        type="primary"
        disabled={disabled}
      >
        开始共享屏幕
      </Button>
      <br />
      <video autoPlay playsInline muted></video>
    </>
  );
};

export default ScreenSharing;
