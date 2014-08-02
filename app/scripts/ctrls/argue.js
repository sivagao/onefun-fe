angular.module('ionicApp')
    .controller('argueListCtrl', function($scope, $rootScope, $state, apiHelper) {

        // refresh, goOrderForm, goArgueDetail
        // getAvaibleList[with my special item]
        // todo: cancelArgue

        $scope.goArgueDetail = function(who) {
            $rootScope._arguePeople = who;
            $state.go('tabs.argue-detail');
        };

        $scope.goSelfSetting = function() {
            $state.go('tabs.order-info');
        };

        apiHelper('getAvailableList').then(function(resp) {
            $scope.availableList = resp;
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
            if (msg.deviceId === window._deviceId) {
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