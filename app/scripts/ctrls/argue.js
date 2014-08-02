angular.module('ionicApp')
    .controller('argueListCtrl', function($scope, $rootScope, $state, apiHelper, WebSocket, $ionicPopup, $timeout) {

        // refresh, goOrderForm, goArgueDetail
        // getAvaibleList[with my special item]
        // todo: cancelArgue

        $scope.goArgueDetail = function(who) {
            $rootScope._arguePeople = who;
            $state.go('tabs.argue-detail');
        };

        $scope.goSelfSetting = function() {
            window._myselfOrder = $scope.myselfOrder;
            $state.go('tabs.order-info');
        };

        $scope.askJumpQueue = function(other) {
            var myPopup = $ionicPopup.show({
                template: '<input type="number" ng-model="$parent.queueMoney">',
                title: '申请换号',
                subTitle: 'Please use normal things',
                scope: $scope,
                buttons: [{
                    text: 'Cancel'
                }, {
                    text: '<b>确定</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        if (!$scope.queueMoney) {
                            //don't allow the user to close unless he enters wifi password
                            e.preventDefault();
                        } else {
                            return $scope.sendJumpCmd($scope.queueMoney, other.deviceId);
                        }
                    }
                }, ]
            });
        };

        $scope.sendJumpCmd = function(money, deviceId) {
            WebSocket.send(JSON.stringify({
                type: 'jump.request',
                data: {
                    money: money,
                    nickName: $scope.myselfOrder.nickName,
                    preOrderNum: $scope.myselfOrder.preOrderNum,
                    fromDeviceId: window._deviceId,
                    toDeviceId: deviceId
                }
            }))
        };

        $scope.canJumpQueeu = function(other) {
            if ($scope.myselfOrder.preOrderNum > other.preOrderNum) {
                if ($scope.myselfOrder.tableCapacity === other.tableCapacity) {
                    return true;
                }
            }
            return false;
        };

        apiHelper('getAvailableList').then(function(resp) {
            $scope.availableList = resp;
            $scope.myselfOrder = _.filter(resp, function(i) {
                if (i.deviceId === window._deviceId) {
                    return true;
                }
                return false;
            })[0];
        });

        $scope.$on('jump.response', function(xx, data) {
            var alertPopup = $ionicPopup.alert({
                title: '恭喜',
                template: '您的换位请求已经被答应'
            });
            $timeout(function() {
                $state.reload();
            }, 1000);
        });

        $scope.$on('jump.request', function(xx, data) {
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
    })
    .controller('argueDetailCtrl', function($scope, $rootScope, WebSocket, $timeout, $ionicPopup, apiHelper) {
        // chat mode
        // isMaster -> showAgrueBtn
        // interval -getMsgList(myself, hisDevice)
        // postMsgList
        // beArgued - popUp, agreeArgue - popUp
        $timeout(function() {
            $('.tabs').hide();
            $('.chatpanel').removeClass('has-tabs').find('.scroll').css('min-height', '100%');
            $('.chat-input').css('position', 'fixed');
        });

        $scope.msgList = [];

        function getMsgList() {
            apiHelper('getMsgList', {
                from: '',
                to: ''
            }).then(function(resp) {
                $scope.msgList = resp;
            });
        }

        $scope.postMsg = function() {
            WebSocket.send(JSON.stringify({
                type: 'chat',
                data: {
                    fromDeviceId: window._deviceId,
                    toDeviceId: $rootScope._arguePeople.deviceId,
                    msg: $scope.$$childTail.chatText || 'fda'
                }
            }));
            $scope.$$childTail.chatText = '';
        };

        $scope.$on('chat.new', function(xx, data) {
            console.log(data);
            // append to msgList
            $scope.msgList.push(data);
        });

        $scope.$on('agree.other', function(xx, data) {
            console.log(data);
            // append to msgList
            $scope.msgList.push(data);
            $scope.agree.other = true;
        });

        $scope.getMsgClass = function(msg) {
            if (msg.fromDeviceId === window._deviceId) {
                return 'self';
            } else {
                return 'other';
            }
        };

        $scope.mergeOrder = function() {
            apiHelper('mergeOrder', {
                params: {
                    fromDeviceId: window._deviceId,
                    toDeviceId: $rootScope._arguePeople.deviceId
                }
            }).then(function() {
                // popup and then continue chat?!
                $scope.agree = {
                    other: true,
                    done: true
                };
                var alertPopup = $ionicPopup.alert({
                    title: '合并订单成功',
                    template: '你们可以接着聊天！'
                });
            });
        };

        $scope.agreeTojoin = function() {
            $scope.mergeOrder();
            return;
            WebSocket.send(JSON.stringify({
                type: 'agree',
                data: {
                    order: $rootScope._arguePeople.deviceId,
                    self: window._deviceId
                }
            }));

            // toggle self
        };
    })
    .controller('argueFinishCtrl', function($scope, $rootScope) {

    })