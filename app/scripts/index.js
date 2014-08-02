angular.module('ionicApp', ['ionic', 'angular-websocket'])
    .config(function(WebSocketProvider) {
        WebSocketProvider
            .uri('ws://localhost:9902');
        // .uri('ws://172.16.121.65:9092/recv');
    })
    .run(function($rootScope, WebSocket, apiHelper, $ionicPopup, $timeout, $state) {
        window._APIHOST = 'http://172.16.121.65:9091';
        // window._deviceId = 'acb' + new Date().getTime();
        window._deviceId = localStorage.getItem('deviceId') || 'acb1406978998599';
        $rootScope._deviceId = window._deviceId;


        $rootScope.getResturant = function() {
            apiHelper('getResturant', {
                slug: 'chekucoffee'
            }, {}).then(function(resp) {
                console.log(resp);
                $rootScope.loading && $rootScope.loading.hide();
                $rootScope.resturantInfo = resp;
                window._availableTableTypes = _.uniq(_.pluck(resp.tables, 'capacity'));
            });
        };

        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            if (fromState.name === 'tabs.profile-detail') {
                // 从我的消息页切换走，空白消息
                $rootScope._hasRead = true;
            }

            if (toState.name === 'tabs.argue-detail') {
                $('.tabs').hide();
            } else {
                $('.tabs').show();
            }
        });

        $rootScope.$on('chat.new', function(xx, data) {
            // 未读消息
            if (!$state.is('tabs.argue-detail')) {
                $rootScope._hasRead = false;
                data.timestamp = new Date();
                $rootScope._unreadChats = $rootScope._unreadChats ? $rootScope._unreadChats : [];
                $rootScope._unreadChats.push(data);
            }
        });

        $rootScope.$on('biz', function(xx, data) {
            $rootScope._hasRead = false;
            data.type = 'biz';
            data.timestamp = new Date();
            $rootScope._unreadChats = $rootScope._unreadChats ? $rootScope._unreadChats : [];
            $rootScope._unreadChats.push(data);
        });

        $rootScope.$on('jump.response', function(xx, data) {
            var alertPopup = $ionicPopup.alert({
                title: '恭喜',
                template: '您的换位请求已经被答应'
            });
            $timeout(function() {
                $state.reload();
            }, 1000);
        });

        $rootScope.$on('jump.request', function(xx, data) {
            var confirmPopup = $ionicPopup.confirm({
                title: '换位请求',
                template: _.template('<%= nickName %>(排位号：<%= preOrderNum %>)，花<%= money %>元，请求和您换位置，你同意吗？', data)
            });
            confirmPopup.then(function(res) {
                if (res) {
                    WebSocket.send(JSON.stringify({
                        type: 'jump.response',
                        data: {
                            toDeviceId: data.fromDeviceId
                        }
                    }));
                    apiHelper('changeOrder', {
                        params: {
                            fromDeviceId: datafromDeviceId,
                            toDeviceId: data.toDeviceId
                        }
                    }).then(function() {
                        // refresh?!
                        // confirmPopup close
                        $timeout(function() {
                            $state.reload();
                        }, 1000);
                    });
                    console.log('You are sure');
                } else {
                    console.log('You are not sure');
                }
            });
        });

        WebSocket.onopen(function() {
            console.log('connection');

            // registry them with deviceId
            WebSocket.send(JSON.stringify({
                type: 'registry',
                data: {
                    fromDeviceId: window._deviceId
                }
            }));
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