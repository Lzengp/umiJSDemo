// @ts-noCheck
import { getDictionaryTextByValue } from '@/utils/utils';
import { Button, message } from 'antd';
import { useEffect, useState } from 'react';

interface SerialPortPageProps {
    onChange: (value: string) => void;
    name?: string; // 按钮名称
}

type SerialPortNameProps = {
    displayName: string;
    path: string;
};

type SerialPortResponse = {
    result: string;
    error: string;
};

let connectionId = '';

/**
 * 连接串口必须条件：
 * 1.安装了Chrome App: Serial Port App
 * 2.代码中写死extensionId（Chrome App Id）【注：如果前端写死，那么这套代码只适配一台电脑】
 * 3.Chrome App中的manifest.json的matches要匹配当前访问地址，注意需要二级域名匹配
 * 获取串口数据-地磅数据
 * @returns 
 */
const SerialPortPage = (props: SerialPortPageProps) => {
    const { onChange, name } = props;

    let extensionId = '';

    // 串口列表
    const [serialPortList, setSerialPortList] = useState<Array<SerialPortNameProps>>([]);
    const [receiveData, setReceiveData] = useState<any>(''); // 接收到串口的数据
    const [loading, setLoading] = useState<boolean>(false); // 顿挫感

    useEffect(() => {
        extensionId = localStorage.getItem('chromeAppId');  // Chrome App Id, 请在安装电脑的localStorage写上id
    }, []);

    useEffect(() => {
        let port: any;
        if (extensionId && chrome.runtime && chrome.runtime.connect) {
            // 使用app的ID与app建立外部连接，连接一旦建立，web端和app都想获得一个port对象
            port = chrome.runtime?.connect(extensionId);
            isAppInstalled(() => { });
            port?.onMessage.addListener(onMessageListenerFn);
        }
        return () => {
            // 页面销毁，关闭串口，不然下次连接不上
            closePort(connectionId, () => { });
            port?.onMessage.removeListener(onMessageListenerFn); // 关闭监听
        }
    }, [extensionId]);

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
    const openPort = (portGUID, portInfo, callBack) => {
        chrome.runtime?.sendMessage(
            extensionId,
            {
                cmd: 'open',
                portGUID: portGUID,
                info: portInfo,
            },
            function (response) {
                if (response.result === 'ok') {
                    connectionId = response.connectionInfo.connectionId;
                }
                callBack(response);
            },
        );
    };

    // 关闭一个串口
    const closePort = (serialConnectionId, callBack) => {
        chrome.runtime?.sendMessage(
            extensionId,
            {
                cmd: 'close',
                connectionId: serialConnectionId,
            },
            function (response) {
                if (response.result === 'ok') {
                    // 串口关闭
                }
                callBack(response);
            },
        );
    };

    // 当有新数据到来时就数据加到页面控件上显示(每个串口返回的信息可能不一样，特殊处理)
    const onNewData = (data) => {
        var str = '';
        var dv = new DataView(data);
        for (var i = 0; i < dv.byteLength; i++) {
            str = str.concat(String.fromCharCode(dv.getUint8(i, true)));
        }
        const reg = /\d/g;
        str.replace(' ', '')
        if (reg.test(str)) {
            if (str.indexOf('+') >= 0) {
                str = str.substring(1);
            }
            setReceiveData(str);
        }
    }

    /**
    * 监听并处理来自app的消息
    * 可以处理的消息有（可自行添加）:
    * - guid -> 当与app连接成功时app发送给web的，用于表示当前页面与app 的连接
    * - serialdata -> 当串口有新数据接收时由app发送给web
    * - serialerror -> 当串口发生错误时由app发送给web
    */
    const onMessageListenerFn = (msg) => {
        if (msg.header === 'guid') {
            getDevicesList((value) => { openSelectedPort(msg.guid, value) })
        } else if (msg.header === 'serialdata') {
            onNewData(new Uint8Array(msg.data).buffer);
        } else if (msg.header === 'serialerror') {
            message.error(msg.error + ' 请联系管理员处理！');
        }
    }

    /**
     *  获取所有连接在本地PC上的串口设备列表。
     *  如果没有错误则返回以下内容:
     * - path: 物理路径
     * - vendorId (optional): 制造商ID
     * - productId (optional): 产品ID
     * - displayName (optional): 显示名称
     * Callback 用以处理app返回结果
     */
    const getDevicesList = (callBack) => {
        chrome.runtime?.sendMessage(
            extensionId,
            {
                cmd: 'list',
            },
            (response: { result: string; ports: Array<SerialPortNameProps>; error: string }) => {
                if (response.result === 'ok') {
                    setSerialPortList([...response.ports]); // 拿到串口信息
                    callBack(response.ports[0].path)
                } else {
                    message.error(response.error + ' 请联系管理员处理！');
                }
            },
        );
    }

    // 检查app是否安装在浏览器中
    const isAppInstalled = (callback) => {
        chrome.runtime?.sendMessage(
            extensionId,
            {
                cmd: 'installed',
            },
            function (response) {
                if (response) {
                    callback(true);
                } else {
                    callback(false);
                }
            },
        );
    }

    // 连接串口
    const openSelectedPort = (portGUID: any, portName: any) => {
        openPort(
            portGUID,
            {
                portName: portName,
                bitrate: 9600,
                dataBits: 'eight',
                parityBit: 'no',
                stopBits: 'one',
            },
            function (response: SerialPortResponse) {
                if (response.result === 'ok') {
                    // 连接成功
                } else {
                    message.error(response.error + ' 串口连接失败，请联系管理员处理！');
                }
            },
        );
    }

    return (
        <>
            <Button
                loading={loading}
                onClick={() => {
                    setLoading(true);
                    setTimeout(() => {
                        setLoading(false);
                        if (!chrome.runtime) {
                            message.error(`检测未安装Chrome App，请联系管理员处理！`);
                            return;
                        }
                        if (!serialPortList || serialPortList.length == 0) {
                            message.error(`检测未连接到串口，请联系管理员处理！`);
                            return;
                        }
                        onChange && onChange(receiveData)
                    }, 1000)
                }}
            >
                {name || '获取串口信息'}
            </Button>
        </>
    );
};

export default SerialPortPage;