angular.module('ionicApp')
    .controller('argueListCtrl', function($scope, $rootScope, $state, apiHelper, WebSocket, $ionicPopup, $timeout, $interval) {

        // refresh, goOrderForm, goArgueDetail
        // getAvaibleList[with my special item]
        // todo: cancelArgue

        $scope.goArgueDetail = function(who) {
            if (!$scope.myselfOrder) {
                $ionicPopup.alert({
                    title: '出错啦',
                    template: '请您先预约单号'
                });
            }
            var _x = _.min([who.preOrderNum, $scope.myselfOrder.preOrderNum]);
            var _cap = _.filter([who, $scope.myselfOrder], function(i) {
                return (i.preOrderNum === _x);
            })[0];

            var _count = who.customerNum + $scope.myselfOrder.customerNum;
            if (_count <= _cap.tableCapacity) {
                $rootScope._arguePeople = who;
                $state.go('tabs.argue-detail');
            } else {
                // error handler
                $ionicPopup.alert({
                    title: '出错啦',
                    template: '您不满足拼桌条件'
                });
            }
        };

        $scope.goSelfSetting = function() {
            window._myselfOrder = $scope.myselfOrder;
            $state.go('tabs.order-form');
        };

        $scope.askJumpQueue = function(other) {
            var myPopup = $ionicPopup.show({
                template: '<input type="number" ng-model="$parent.queueMoney">',
                title: '申请换号',
                subTitle: '您可以输入报酬以申请靠前队伍喔',
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

        function init() {
            apiHelper('getAvailableList').then(function(resp) {
                if (_.isArray(resp)) {
                    $scope.availableList = resp || [];
                } else {
                    $scope.availableList = [];
                }
                $rootScope.availableList = resp;
                $scope.myselfOrder = _.filter(resp, function(i) {
                    if (i.deviceId === window._deviceId) {
                        return true;
                    }
                    return false;
                })[0];

                $scope.canJumpQueeu = function(other) {
                    if (!$scope.myselfOrder) {
                        return false;
                    }
                    if ($scope.myselfOrder.preOrderNum > other.preOrderNum) {
                        if ($scope.myselfOrder.tableCapacity === other.tableCapacity) {
                            return true;
                        }
                    }
                    return false;
                };
            });
        }

        // $interval(function() {
        //     init();
        // }, 2000);

        init();
    })
    .controller('argueDetailCtrl', function($scope, $rootScope, WebSocket, $timeout, $ionicPopup, apiHelper, $state) {
        $timeout(function() {
            $('.tabs').hide();
            $('.chatpanel').removeClass('has-tabs').find('.scroll').css('min-height', '100%');
            $('.chat-input').css('position', 'fixed');
            $('.chatpanel .chat-list').css({
                'overflow': 'scroll',
                'height': $('.chatpanel .scroll').height() - $('.chat-status').height() - $('.chat-input').height()
            });
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
                    msg: $scope.$$childTail.chatText || '聊聊，我们来拼餐？'
                }
            }));
            $scope.$$childTail.chatText = '';
        };

        $scope.$on('chat.new', function(xx, data) {
            console.log(data);
            // append to msgList
            $scope.msgList.push(data);
            $('.chatpanel .chat-list')[0].scrollTop = 1200000000;
        });


        $scope.agree = {};
        $scope.$on('agree', function(xx, data) {
            $scope.agree.other = true;
        });

        $scope.agreeTojoin = function() {
            WebSocket.send(JSON.stringify({
                type: 'agree',
                data: {
                    toDeviceId: $rootScope._arguePeople.deviceId
                }
            }));
            $scope.agree.self = true;
        };

        $scope.$watch('agree', function(all) {
            if (!all) return;
            if (all.other && all.self) {
                $scope.mergeOrder();
            }
        }, true);

        $scope.mergeOrder = function() {
            apiHelper('mergeOrder', {
                params: {
                    fromDeviceId: window._deviceId,
                    toDeviceId: $rootScope._arguePeople.deviceId
                }
            }).then(function(resp) {
                $rootScope._mergeOrderInfo = {
                    preOrderNum: resp.preOrderNum,
                    other: $rootScope._arguePeople
                };
                $state.go('tabs.argue-finish');
            }, function() {
                // error handler
                $ionicPopup.alert({
                    title: '合并订单失败',
                    template: '你们可以接着聊天！'
                });
            });
        };

        $scope.getMsgClass = function(msg) {
            if (msg.fromDeviceId === window._deviceId) {
                return 'self';
            } else {
                return 'other';
            }
        };
    })
    .controller('argueFinishCtrl', function($scope, $rootScope) {
        $scope.i = $rootScope._mergeOrderInfo;
    });