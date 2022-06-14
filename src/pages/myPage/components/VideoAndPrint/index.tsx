import { Button, message, Modal } from 'antd';
import { useState } from 'react';

const VideoAndPrint = () => {
  const [imgList, setImgList] = useState<Array<string>>([]);
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [previewImg, setPreviewImg] = useState<string>();

  const print = () => {
    if (!imgList || imgList.length === 0) {
      message.error(`请截屏之后再打印`);
      return;
    }
    var headstr = '<html><head><title></title></head></html><body>';
    var footstr = '</body>';
    var newstr = document.getElementById('printHtml').innerHTML;
    var myWindow = window.open(
      '',
      'newwindow',
      'fullscreen=yes,location=no,menubar=no,status=no,titlebar=no,toolbar=no',
    );
    myWindow.document.body.innerHTML = headstr + newstr + footstr;
    myWindow.print();
    setTimeout(function () {
      myWindow.close();
    }, 300);
    return false;
  };

  const captureVideo = () => {
    const video = document.getElementById('myVideo');
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const base64Str = canvas.toDataURL('image/png'); // 一定要同源的视频地址，不然toDataURL会报错
    const list = [...imgList];
    list.push(base64Str);
    setImgList(list);
    console.log(dataURLtoFile(base64Str, '图片1.png'));
  };

  const dataURLtoFile = (dataurl, filename) => {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  return (
    <>
      <video
        id="myVideo"
        class="myVideo video-js vjs-default-skin vjs-big-play-centered"
        controls
        preload="auto"
        width="640"
        height="264"
        data-setup="{}"
        webkit-playsinline="true"
        playsinline="true"
        x-webkit-airplay="true"
        x5-video-player-type="h5"
        x5-video-player-fullscreen="true"
        x5-video-ignore-metadata="true"
      >
        <source src="/beixuan.mp4" type="video/mp4" />
      </video>

      <Button
        type="primary"
        onClick={() => {
          captureVideo();
        }}
      >
        截屏
      </Button>

      <Button type="primary" onClick={() => print()}>
        打印
      </Button>

      <Button
        onClick={() => {
          setImgList([]);
        }}
      >
        清空截屏
      </Button>

      <div className="print-content" id="printHtml">
        {(imgList || []).map((item) => (
          <div
            style={{
              pageBreakBefore: 'always',
              width: '300px',
              height: '300px',
              cursor: 'pointer',
            }}
            onClick={() => {
              setPreviewVisible(true);
              setPreviewImg(item);
            }}
          >
            <img src={item} style={{ width: '300px', height: '300px' }} />
          </div>
        ))}
      </div>

      <Modal
        visible={previewVisible}
        title="预览"
        footer={null}
        onCancel={() => {
          setPreviewVisible(false);
        }}
        width={1000}
      >
        <img alt="example" style={{ width: '100%' }} src={previewImg} />
      </Modal>
    </>
  );
};

export default VideoAndPrint;
