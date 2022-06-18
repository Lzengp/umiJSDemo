/**
* 当Web端的一个SerialPort实例生成的时候，Web同时就能得到一个chrome.runtime.Port 对象，该对象就是Web连接至本app的句柄。
* 如果连接成功，就把该Port对象以一个独一无二的GUID保存在SerialPort列表中。
* 该GUID 用于指示哪个的SerialPort实例与哪个页面关联。
*/
var serialPort = [];

/**
* 当某个串口打开的时候就把打开该串口的页面的GUID保存到serialConnections 列表中。
* 每个GUID索引就是由chrome.serial API提供的一个特有的连接。
*/
var serialConnections = [];

/**
 * 存储串口信息
 */
var receiveData;

/**
 * 生成一个随机的GUID用于与chrome.runtime.Port 关联。
 */
function getGUID() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

/**
 * 当一个新的SerialPort 创建时就会触发一个外部连接事件
 * 1. 生成一个GUID，并以该GUID作为索引将连接port对象保存在serialPort列表中
*  2. 将该GUID发回连接的Web page
 */
chrome.runtime.onConnectExternal.addListener(
    function (port) {
        var portIndex = getGUID();
        serialPort[portIndex] = port;
        port.postMessage({
            header: "guid",
            guid: portIndex
        });
        port.onDisconnect.addListener(
            function () {
                serialPort.splice(portIndex, 1);
                console.log("Web page closed guid " + portIndex);
            }
        );

        console.log("New web page with guid " + portIndex);
    }
);

/**
 * 监听并处理Web page来请求。
 * Commands:
 *  - open -> 请求打开一个串口
 * - close -> 请求关闭一个串口
 * - list -> 请求获取串口列表
 * - write -> 请求向串口发送数据
 * - installed -> 请求检查本app是否已安装在浏览器中
 */
 chrome.runtime.onMessageExternal.addListener(
    function (request, sender, sendResponse) {
        console.log(request);

        if (request.cmd === "open") {
            openPort(request, sender, sendResponse);
        } else if (request.cmd === "close") {
            closePort(request, sender, sendResponse);
        } else if (request.cmd === "list") {
            getPortList(request, sender, sendResponse);
        } else if (request.cmd === "write") {
            writeOnPort(request, sender, sendResponse);
        } else if (request.cmd === "installed") {
            checkInstalled(request, sender, sendResponse);
        } else if (request.cmd === "getInfo") {
            sendResponse({
                result: "ok",
                data: receiveData,
            });
        }

        return true;
    });

/**
 *  监听并处理串口收到数据事件
 * 1. 使用 connectionId 检索serialConnections列表获得页面的GUID
 * 2. 将与Web page关联的串口数据直接发送给Web page
 */
 chrome.serial.onReceive.addListener(
    function (info) {
        console.log(info);
        var portGUID = serialConnections[info.connectionId];
        receiveData = Array.prototype.slice.call(new Uint8Array(info.data));
        serialPort[portGUID].postMessage({
            header: "serialdata",
            data: Array.prototype.slice.call(new Uint8Array(info.data))
        });
    }
);

/**
 *  监听并处理串口错误
  * 1. 使用 connectionId 检索serialConnections列表获得页面的GUID
 * 2. 将与Web page关联的串口错误直接发送给Web page
 */
 chrome.serial.onReceiveError.addListener(
    function (errorInfo) {
        console.error("Connection " + errorInfo.connectionId + " has error " + errorInfo.error);
        var portGUID = serialConnections[errorInfo.connectionId];
        serialPort[portGUID].postMessage({
            header: "serialerror",
            error: errorInfo.error
        });
    }
);

/**
 * 用于检查本app是否一个被安装在Chrome浏览器中。
 * 如果已经安装则返回 "ok" 和当前版本信息。
 */
 function checkInstalled(request, sender, sendResponse) {
    var manifest = chrome.runtime.getManifest();
    sendResponse({
        result: "ok",
        version: manifest.version
    });
}

/**
 *  获取所有连接在本地PC上的串口设备列表。
 *  如果没有错误则返回以下内容:
 * - path: 物理路径
 * - vendorId (optional): 制造商ID
 * - productId (optional): 产品ID
 * - displayName (optional): 显示名称
 */
 function getPortList(request, sender, sendResponse) {
    chrome.serial.getDevices(
        function (ports) {
            if (chrome.runtime.lastError) {
                sendResponse({
                    result: "error",
                    error: chrome.runtime.lastError.message
                });
            } else {
                sendResponse({
                    result: "ok",
                    ports: ports
                });
            }
        }
    );
}

/**
 * 尝试打开一个串口
 * request 必须包含以下:
 * info.portName  -> 要打开的串口地址
 * info.bitrate   -> 串口波特率
 * info.dataBits  -> 串口数据位数 ("eight" or "seven")
 * info.parityBit -> 期偶校验位 ("no", "odd" or "even")
 * info.stopBits  -> 停止位 ("one" or "two")
 *
 * 如果与串口建立了连接将向web page 返回结果: "ok" 和 connection info, 
 * 否则返回结果: "error" 和 error: error message
 */
 function openPort(request, sender, sendResponse) {
    chrome.serial.connect(request.info.portName, {
            bitrate: request.info.bitrate,
            dataBits: request.info.dataBits,
            parityBit: request.info.parityBit,
            stopBits: request.info.stopBits
        },
        function (connectionInfo) {
            if (chrome.runtime.lastError) {
                sendResponse({
                    result: "error",
                    error: chrome.runtime.lastError.message
                });
            } else {
                serialConnections[connectionInfo.connectionId] = request.portGUID;
                sendResponse({
                    result: "ok",
                    connectionInfo: connectionInfo
                });
            }
        }
    );
}

/**
 * 尝试关闭一个串口
 * request 必须包含以下:
 * connectionId -> 当串口被打开时的连接ID
 *
 * 如果当前连接被成功关闭将向web page返回结果: "ok" 和 connection info, 
 * 否则返回结果: "error" 和 error: error message
 */
 function closePort(request, sender, sendResponse) {
    chrome.serial.disconnect(request.connectionId,
        function (connectionInfo) {
            if (chrome.runtime.lastError) {
                sendResponse({
                    result: "error",
                    error: chrome.runtime.lastError.message
                });
            } else {
                serialConnections.slice(connectionInfo.connectionId, 1);
                sendResponse({
                    result: "ok",
                    connectionInfo: connectionInfo
                });
            }
        }
    );
}

/**
 * 向串口写入数据
 * request 必须包含以下:
 * connectionId -> 当串口被打开时的连接ID
 * data         -> 要发送的字节流数组
*
 * 如果发送成功关闭将向web page返回结果: "ok" 和 串口响应结果, 
 * 否则返回结果: "error" 和 error: error message
 */
function writeOnPort(request, sender, sendResponse) {
    chrome.serial.send(request.connectionId, new Uint8Array(request.data).buffer,
        function (response) {
            if (chrome.runtime.lastError) {
                sendResponse({
                    result: "error",
                    error: chrome.runtime.lastError.message
                });
            } else {
                sendResponse({
                    result: "ok",
                    sendInfo: response
                });
            }
        }
    );
}