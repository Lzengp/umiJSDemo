import { Button, Input, message, Select } from 'antd';
import { useEffect, useState } from 'react';

var extensionId = 'fjobfeohefddfmmodljikjipljgogbjj'; // Chrome App id

type SerialPortNameProps = {
  displayName: string;
  path: string;
};

type SerialPortResponse = {
  result: string;
  error: string;
};

const SerialPortPage = () => {
  // 串口列表
  const [serialPortList, setSerialPortList] = useState<Array<SerialPortNameProps>>([]);
  const [serialPortValue, setSerialPortValue] = useState<any>();
  const [portGUID, setPortGUID] = useState<any>(); // Chrome App 分配的GUID
  const [sendValue, setSendValue] = useState<string>(''); // 需要发送给串口的信息
  const [serialConnectionId, setSerialConnectionId] = useState<any>(); // 唯一的串口连接ID
  const [onDataReceivedValue, setonDataReceivedValue] = useState<any>(); // 接收到串口的数据
  const [isLinkSerialPort, setIsLinkSerialPort] = useState<boolean>(false); // 是否连接串口

  let port = null;

  useEffect(() => {
    // 使用app的ID与app建立外部连接，连接一旦建立，web端和app都想获得一个port对象
    port = chrome.runtime?.connect(extensionId);
    if (port) {
      isAppInstalled((value) => {
        value ? message.success(`已安装串口Chrome App`) : message.error(`未安装Chrome App`);
      });
      portOnMessage();
      getDevicesList();
    }
  }, []);

  // let extensionId = '';

  // useEffect(() => {
  //   extensionId = localStorage.getItem('chromeAppId'); // Chrome App Id, 请在安装电脑的localStorage写上id
  // }, []);

  // useEffect(() => {
  //   let port: any;
  //   if (extensionId && chrome.runtime && chrome.runtime.connect) {
  //     // 使用app的ID与app建立外部连接，连接一旦建立，web端和app都想获得一个port对象
  //     port = chrome.runtime?.connect(extensionId);
  //     isAppInstalled(() => {});
  //     port?.onMessage.addListener(onMessageListenerFn);
  //   }
  //   return () => {
  //     // 页面销毁，关闭串口，不然下次连接不上
  //     closePort(connectionId, () => {});
  //     port?.onMessage.removeListener(onMessageListenerFn); // 关闭监听
  //   };
  // }, [extensionId]);

  /**
   * 尝试打开一个串口
   * portInfo 必须包含以下:
   * portName  -> 串口地址
   * bitrate   -> 串口波特率
   * dataBits  -> 数据位 ("eight" or "seven")
   * parityBit -> 校验位 ("no", "odd" or "even")
   * stopBits  -> 停止位 ("one" or "two")
   * Callback用来处理app返回的结果，由于sendMessage是异步执行的函数
   */
  const openPort = function (portInfo, callBack) {
    chrome.runtime.sendMessage(
      extensionId,
      {
        cmd: 'open',
        portGUID: portGUID,
        info: portInfo,
      },
      function (response) {
        console.log(response);
        if (response.result === 'ok') {
          setSerialConnectionId(response.connectionInfo.connectionId);
        }
        callBack(response);
      },
    );
  };

  // 关闭一个串口
  const closePort = function (callBack) {
    chrome.runtime.sendMessage(
      extensionId,
      {
        cmd: 'close',
        connectionId: serialConnectionId,
      },
      function (response) {
        console.log(response);
        if (response.result === 'ok') {
          setIsLinkSerialPort(false);
          message.success(`串口${serialPortValue}已关闭`);
        }
        callBack(response);
      },
    );
  };

  /**
   * 向串口写入数据
   * request 必须包含以下:
   * connectionId -> 串口连接ID
   * data         -> 要发送的字节流数组
   */
  const write = function (data, callBack) {
    chrome.runtime.sendMessage(
      extensionId,
      {
        cmd: 'write',
        connectionId: serialConnectionId,
        data: Array.prototype.slice.call(new Uint8Array(data)),
      },
      function (response) {
        console.log(response);
        if (response.result === 'ok') {
          message.success(`信息  ${response.sendInfo.bytesSent}  发送成功`);
          if (response.sendInfo.error !== undefined) {
            if (
              response.sendInfo.error === 'disconnected' ||
              response.sendInfo.error === 'system_error'
            ) {
              closePort(function () {});
            }
          }
        } else {
          message.error(response.error);
        }
        callBack(response);
      },
    );
  };

  // 当有新数据到来时就数据加到页面控件上显示
  function onNewData(data) {
    var str = '';
    var dv = new DataView(data);
    for (var i = 0; i < dv.byteLength; i++) {
      str = str.concat(String.fromCharCode(dv.getUint8(i, true)));
    }
    setonDataReceivedValue(str);
  }

  /**
   * 监听并处理来自app的消息
   * 可以处理的消息有（可自行添加）:
   * - guid -> 当与app连接成功时app发送给web的，用于表示当前页面与app 的连接
   * - serialdata -> 当串口有新数据接收时由app发送给web
   * - serialerror -> 当串口发生错误时由app发送给web
   */
  const portOnMessage = () => {
    port.onMessage.addListener(function (msg) {
      if (msg.header === 'guid') {
        setPortGUID(msg.guid);
      } else if (msg.header === 'serialdata') {
        onNewData(new Uint8Array(msg.data).buffer);
      } else if (msg.header === 'serialerror') {
        console.log(msg);
        message.error(msg.error);
      }
    });
  };

  /**
   *  获取所有连接在本地PC上的串口设备列表。
   *  如果没有错误则返回以下内容:
   * - path: 物理路径
   * - vendorId (optional): 制造商ID
   * - productId (optional): 产品ID
   * - displayName (optional): 显示名称
   * Callback 用以处理app返回结果
   */
  function getDevicesList() {
    chrome.runtime.sendMessage(
      extensionId,
      {
        cmd: 'list',
      },
      (response: { result: string; ports: Array<SerialPortNameProps>; error: string }) => {
        if (response.result === 'ok') {
          setSerialPortList([...response.ports]);
        } else {
          message.error(response.error);
        }
      },
    );
  }

  // 检查app是否安装在浏览器中
  function isAppInstalled(callback) {
    console.log(extensionId, chrome);
    chrome.runtime.sendMessage(
      extensionId,
      {
        cmd: 'installed',
      },
      function (response) {
        console.log(response);
        if (response) {
          callback(true);
        } else {
          callback(false);
        }
      },
    );
  }

  // 连接串口
  function openSelectedPort() {
    openPort(
      {
        portName: serialPortValue,
        bitrate: 9600,
        dataBits: 'eight',
        parityBit: 'no',
        stopBits: 'one',
      },
      function (response: SerialPortResponse) {
        console.log(response);
        if (response.result === 'ok') {
          setIsLinkSerialPort(true);
        } else {
          message.error(response.error);
        }
      },
    );
  }

  // 手动获取串口信息
  const getSerialInfo = () => {
    chrome.runtime.sendMessage(
      extensionId,
      {
        cmd: 'getInfo',
      },
      function (response) {
        console.log(response);
        if (response) {
          onNewData(new Uint8Array(response.data).buffer);
        } else {
          message.error(response.error);
        }
      },
    );
  };

  return (
    <>
      <Select
        style={{ width: '300px', marginRight: '20px' }}
        onChange={setSerialPortValue}
        placeholder="请选择串口"
        value={serialPortValue}
      >
        {serialPortList.map((item) => (
          <Select.Option value={item.path} title={`${item.displayName}(${item.path})`}>
            {item.displayName}({item.path})
          </Select.Option>
        ))}
      </Select>
      <Button
        type="primary"
        onClick={() => {
          if (!serialPortValue) {
            message.error(`请先选择串口`);
            return;
          }
          openSelectedPort();
        }}
        style={{ marginRight: '20px' }}
      >
        连接串口
      </Button>
      <Button
        type="primary"
        onClick={() => {
          if (!serialPortValue) {
            message.error(`请先选择串口`);
            return;
          }
          if (!isLinkSerialPort) {
            message.error(`请先连接串口`);
            return;
          }
          setSerialPortValue('');
          closePort(() => {});
        }}
        style={{ marginRight: '20px' }}
      >
        关闭串口
      </Button>

      <Button
        type="primary"
        onClick={() => {
          if (!serialPortValue) {
            message.error(`请先选择串口`);
            return;
          }
          getSerialInfo();
        }}
        style={{ marginRight: '20px' }}
      >
        获取串口信息
      </Button>
      <Input.TextArea
        value={onDataReceivedValue}
        disabled
        rows={6}
        style={{ width: '400px', display: 'block', margin: '20px 0' }}
      />
      <Input
        onChange={(e) => {
          setSendValue(e.target.value);
        }}
        style={{ width: '200px', marginRight: '20px' }}
        placeholder="请输入发送给串口的信息"
        value={sendValue}
      />
      <Button
        type="primary"
        onClick={() => {
          if (!serialPortValue) {
            message.error(`请先选择串口`);
            return;
          }
          if (!sendValue) {
            message.error(`请输入需要发送的信息`);
            return;
          }
          write(sendValue, () => {});
        }}
      >
        发送
      </Button>
    </>
  );
};

export default SerialPortPage;
