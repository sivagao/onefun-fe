angular.module('ionicApp', ['ionic', 'angular-websocket'])
    .config(function(WebSocketProvider) {
        WebSocketProvider
            .uri('ws://172.16.121.65:9092/recv');
    })
    .run(function($rootScope, WebSocket) {
        window._APIHOST = 'http://172.16.121.65:9091';
        // window._deviceId = 'acb' + new Date().getTime();
        window._deviceId = 'acb1406978998599';
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

        WebSocket.onmessage(function(event) {
            console.log('message: ', event.data);
        });
    });