angular.module('ionicApp')
    .controller('orderLocationCtrl', function($scope, $rootScope, $ionicLoading, apiHelper, $timeout, $state) {

        $rootScope.loading = $ionicLoading.show({
            content: '正在定位请稍后...',
            showBackdrop: false
        });

        $timeout(function() {
            $state.go('tabs.order-locationed');
        }, 1000);

        // Todo with show not in location page

        // getLocation();
        function getLocation() {
            navigator.geolocation.getCurrentPosition(function(pos) {
                console.log(pos);
                // with backend
                $rootScope.loading.hide();
            }, function(error) {
                alert('Unable to get location: ' + error.message);
            });
        }

        function getRestInfo() {
            // ws
        }
    })
    .controller('orderLocationedCtrl', function($scope, $rootScope, $ionicLoading, apiHelper, $timeout, $state) {
        apiHelper('getResturant', {
            slug: 'chekucoffee'
        }, {}).then(function(resp) {
            console.log(resp);
            $rootScope.loading && $rootScope.loading.hide();
            $rootScope.resturantInfo = resp;
            window._availableTableTypes = _.uniq(_.pluck(resp.tables, 'capacity'));
        });
    })
    .controller('orderFormCtrl', function($scope, $rootScope, $ionicPopup, $state, apiHelper) {

        // prefill data
        if (window._stateParam) {
            $scope.info = window._stateParam;
        } else {
            $scope.info = {};
        }

        $scope.$watch('info.customerNum', function(val) {
            var _tableType = findTableType(val);
            if (_tableType !== Infinity) {
                $scope.info.tableCapacity = _tableType;
            } else {
                $scope.info.tableCapacity = null;
            }
        });

        $scope.submitOrder = function() {
            // form validator
            // mock
            $scope.info = {
                "isAccept": 1,
                "nickName": "siva",
                "customerNum": 5,
                "phoneNum": "18600024232",
                "introText": "hello xixixi",
                "deviceId": "acb1406973507008"
            };
            // end mock

            $scope.info.deviceId = window._deviceId;
            $scope.info.isAccept = $scope.info.isAccept ? 1 : 0;
            apiHelper('postPreOrderInfo', {
                data: $scope.info
            })['finally'](function(resp) {
                showAlert();
                $rootScope.preOrderInfo = $scope.info;
            });
        };

        function showAlert() {
            var alertPopup = $ionicPopup.alert({
                title: '预约成功！',
                template: '您可以到拼桌页面，查找附件的人，一起来.'
            });
            alertPopup.then(function(res) {
                $state.go('tabs.order-info');
            });
        }

        function findTableType(val) {
            if (!window._availableTableTypes) {
                window._availableTableTypes = [4, 6, 8];
            }
            return _.min(_.filter(window._availableTableTypes, function(item) {
                return item > val;
            }));
        }
    })
    .controller('orderInfoCtrl', function($scope, $rootScope) {
        console.log('orderInfoCtrl');

        // todo: $state.go('tabs.order-info');

        $scope.cancelOrder = function() {
            // ajax cleanup
        };

        $scope.reSetting = function() {

        };
    })
    .controller('argueListCtrl', function($scope, $state) {

        // refresh, goOrderForm, goArgueDetail
        // getAvaibleList[with my special item]
        // todo: cancelArgue

    })
    .controller('argueDetailCtrl', function($scope, $rootScope) {
        // chat mode
        // isMaster -> showAgrueBtn
        // interval -getMsgList(myself, hisDevice)
        // postMsgList
        // beArgued - popUp, agreeArgue - popUp
        $scope.isShowFooter = false;
        $('.tabs').hide();

        $scope.postMsg = function() {
            return;
            mySocket.emit('', {
                type: 'chat',
                data: {
                    fromDeviceId: window._deviceId,
                    toDeviceId: 'abc-321',
                    msg: $scope.chatText
                }
            });
        };
    })
    .controller('argueFinishCtrl', function($scope, $rootScope) {

    })
    .controller('profileDetailCtrl', function($scope, $rootScope) {
        // todo
    })
    .controller('manageListCtrl', function($scope, $ionicActionSheet, $state) {
        console.log('manageListCtrl');
        $scope.showActions = function() {
            $ionicActionSheet.show({
                titleText: 'ActionSheet Example',
                buttons: [{
                    text: '已上桌 <i class="icon ion-share"></i>'
                }, {
                    text: '修改 <i class="icon ion-arrow-move"></i>'
                }, ],
                destructiveText: '取消排号',
                cancelText: 'Cancel',

                cancel: function() {
                    console.log('取消');
                },

                buttonClicked: function(index) {
                    console.log('BUTTON CLICKED', index);
                    if (index === 0) {
                        // 上桌
                    }
                    if (index === 1) {
                        // go customize page
                        window._stateParam = {
                            nickName: 'siva',
                            customerNum: 21
                        };
                        $state.go("tabs.order-form");
                    }
                    return true;
                },

                destructiveButtonClicked: function() {
                    console.log('DESTRUCT');
                    // $http
                    return true;
                }
            });
        };
        // 评论和详情 - baidu it?! commentList
    });

angular.bootstrap(document, ['ionicApp']);