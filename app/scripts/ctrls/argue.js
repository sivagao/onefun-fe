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
    .controller('argueDetailCtrl', function($scope, $rootScope, WebSocket) {
        // chat mode
        // isMaster -> showAgrueBtn
        // interval -getMsgList(myself, hisDevice)
        // postMsgList
        // beArgued - popUp, agreeArgue - popUp
        $('.tabs').hide();
        $('.chat-input').css('position', 'fixed');

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
                    msg: $scope.chatText || 'fda'
                }
            }));
        };

        $scope.$on('chat.new', function(data) {
            console.log(data);
            // append to msgList
            $scope.msgList.push(data);
        });

        $scope.getMsgClass = function(msg) {
            if (msg.deviceId === window._deviceId) {
                return 'self';
            } else {
                return 'other';
            }
        };
    })
    .controller('argueFinishCtrl', function($scope, $rootScope) {

    })