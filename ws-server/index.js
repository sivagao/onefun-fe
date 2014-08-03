var WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({
        port: 9902
    });

var wssMap = {};

function decorateWs(ws) {
    ws._send = ws.send;
    ws.send = function(msg) {
        ws._send(JSON.stringify(msg));
    };
}

wss.on('connection', function(ws) {
    decorateWs(ws);
    console.log('connection');
    ws.on('message', function(message) {
        console.log('received: %s', message);

        // error: send socket closed(客户端关掉了)
        try {
            var msg = JSON.parse(message);
            console.log(msg)
            if (msg.type === 'registry') {
                // map it
                wssMap[msg.data.fromDeviceId] = ws;
                // console.log(wssMap);
            }

            if (msg.type === 'chat') {
                var msgData = msg.data;
                console.log(msgData);
                wssMap[msgData.fromDeviceId].send(msg);
                wssMap[msgData.toDeviceId] && wssMap[msgData.toDeviceId].send(msg);
                console.log('llll');
            } else {
                if (!msg.type) return;
                var msgData = msg.data;
                console.log(msgData);
                wssMap[msgData.toDeviceId] && wssMap[msgData.toDeviceId].send(msg);
                console.log('ddddd');
            }
            ws.send(message);
        } catch (e) {
            console.log(e);
        }
    });

    // 定时广播
    setTimeout(function() {
        try {
            ws.send({
                type: 'biz',
                data: {
                    msg: '非常抱歉，让您久等了，上桌后，我们将送上一份免费的精品菜'
                }
            });
        } catch (e) {
            console.log(e);
        }
    }, 4000);
});