import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, message, Modal, Upload } from 'antd';
import { useState } from 'react';
import styles from './index.less';

const VideoAndPrint = () => {
  const [imgList, setImgList] = useState<Array<string>>([]);
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [previewImg, setPreviewImg] = useState<string>();

  // 新开一个窗口进行打印，不太美观
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
    if (Array.isArray(imgList) && imgList.length >= 12) {
      message.info('最多截屏12次');
      return;
    }
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
    const file = dataURLtoFile(base64Str, '图片1.png');
    const formData = new FormData();
    formData.append('file', file);
    console.log(formData, file);
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

  // 推荐使用iframe打印
  function doPrint3() {
    //判断iframe是否存在，不存在则创建iframe
    var iframe = document.getElementById('print-iframe');
    if (!iframe) {
      var el = document.getElementById('printHtml');
      iframe = document.createElement('IFRAME');
      var doc = null;
      iframe.setAttribute('id', 'print-iframe');
      iframe.setAttribute(
        'style',
        'position:absolute;width:0px;height:0px;left:-500px;top:-500px;',
      );
      document.body.appendChild(iframe);
      doc = iframe.contentWindow.document;
      //这里可以自定义样式
      //doc.write("<LINK rel="stylesheet" type="text/css" href="css/print.css">");
      doc.write('<div>' + el.innerHTML + '</div>');
      doc.close();
      iframe.contentWindow.focus();
    }
    iframe.contentWindow.print();
    if (navigator.userAgent.indexOf('MSIE') > 0) {
      document.body.removeChild(iframe);
    }
  }

  return (
    <div className={styles.videoAndPrintWrap}>
      <video
        id="myVideo"
        // class="myVideo video-js vjs-default-skin vjs-big-play-centered"
        controls // 如果出现该属性，则向用户显示控件，比如播放按钮
        preload="auto" // 视频在页面加载时进行加载，并预备播放。如果使用 "autoplay"，则忽略该属性。
        muted // 视频的音频输出为静音
        width="640"
        height="264"
        // autoplay="autoplay" // 视频在就绪后马上播放
        // loop="loop" // 当媒介文件完成播放后再次开始播放
        // data-setup="{}"
        // webkit-playsinline="true"
        // playsinline="true"
        // x-webkit-airplay="true"
        // x5-video-player-type="h5"
        // x5-video-player-fullscreen="true"
        // x5-video-ignore-metadata="true"
        src="/beixuan.mp4"
        type="video/mp4"
      >
        {/* <source src="/beixuan.mp4" type="video/mp4" /> */}
      </video>

      <Button
        type="primary"
        onClick={() => {
          captureVideo();
        }}
        style={{ marginLeft: '20px' }}
      >
        截屏
      </Button>

      <Button type="primary" style={{ margin: '0 20px' }} onClick={() => doPrint3()}>
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
        {(imgList || []).map((item, index) => (
          <div
            style={{
              pageBreakBefore: 'always',
              width: '300px',
              height: '300px',
              marginRight: '20px',
              position: 'relative',
              // display: 'inline-block',
            }}
          >
            <pre>
              <span className={styles.imgActionIcon} id="imgActionIcon">
                <EyeOutlined
                  onClick={() => {
                    setPreviewVisible(true);
                    setPreviewImg(item);
                  }}
                />
                <DeleteOutlined
                  onClick={() => {
                    const list = [...imgList];
                    list.splice(index, 1);
                    setImgList(list);
                  }}
                />
              </span>
            </pre>

            <img
              className={styles.itemImgInfo}
              src={item}
              style={{
                width: '300px',
                height: '300px',
                border: '1px solid #c9c9c9',
                marginTop: '10px',
              }}
            />
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
    </div>
  );
};

export default VideoAndPrint;
