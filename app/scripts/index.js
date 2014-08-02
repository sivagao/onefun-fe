angular.module('ionicApp', ['ionic', 'angular-websocket'])
    .config(function(WebSocketProvider) {
        WebSocketProvider
            .uri('ws://localhost:9902');
        // .uri('ws://172.16.121.65:9092/recv');
    })
    .run(function($rootScope, WebSocket) {
        window._APIHOST = 'http://172.16.121.65:9091';
        // window._deviceId = 'acb' + new Date().getTime();
        window._deviceId = localStorage.getItem('deviceId') || 'acb1406978998599';
        $rootScope._deviceId = window._deviceId;

        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            console.log(arguments);
            if (toState.name === 'tabs.argue-detail') {
                $('.tabs').hide();
            } else {
                $('.tabs').show();
            }
        });

        WebSocket.onopen(function() {
            console.log('connection');
        });

        WebSocket.onerror = function(evt) {
            console.log('connection closed');
            console.log(evt)
        };

        WebSocket.onclose = function(evt) {
            console.log('connection closed');
            console.log(evt)
        };

        WebSocket.onmessage(function(evt) {
            console.log('message: ', evt.data);
            var msg = JSON.parse(evt.data);
            if (msg.type === 'chat') {
                $rootScope.$broadcast('chat.new', msg.data);
            } else {
                if (!msg.type) return;
                $rootScope.$broadcast(msg.type, msg.data);
            }
        });
    });