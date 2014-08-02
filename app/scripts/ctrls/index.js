angular.module('ionicApp')
    .controller('profileDetailCtrl', function($scope, $rootScope, apiHelper, $state) {
        if (!$rootScope.availableList) {
            apiHelper('getAvailableList').then(function(resp) {
                $rootScope.availableList = resp;
                init();
            });
        } else {
            init();
        }

        $scope.goArgueDetail = function(who) {
            $rootScope._arguePeople = who;
            $state.go('tabs.argue-detail');
        };

        function findFromOrder(id) {
            return _.filter($rootScope.availableList, function(item) {
                if (item.deviceId === id) {
                    return true
                }
                return false;
            })[0];
        }

        function init() {
            $scope.unreadChats = _.map($rootScope._unreadChats, function(i) {
                return {
                    from: findFromOrder(i.fromDeviceId),
                    timestamp: i.timestamp,
                    msg: i.msg
                };
            });
        }
    })
    .controller('manageListCtrl', function($scope, $ionicActionSheet, $state, $rootScope, apiHelper) {
        console.log('manageListCtrl');

        $rootScope.getResturant();

        apiHelper('getAvailableList', {
            params: {
                type: 'all'
            }
        }).then(function(resp) {
            $scope.allOrder = resp;
        });
        $scope.showActions = function(targetCustomer) {
            $rootScope._targetCustomer = $rootScope.targetCustomer
            $ionicActionSheet.show({
                // titleText: 'ActionSheet Example',
                buttons: [{
                    text: '已上桌'
                }, {
                    text: '修改'
                }, ],
                destructiveText: '取消排号',
                cancelText: 'Cancel',

                cancel: function() {
                    console.log('取消');
                },

                buttonClicked: function(index) {
                    if (index === 0) {
                        // 上桌
                        apiHelper('updateOrder', {
                            params: {
                                status: 2,
                                deviceId: _deviceId
                            }
                        }).then(function() {
                            // to where?! - clean item
                            $state.reload();
                        });
                    }
                    if (index === 1) {
                        window._stateParam = $rootScope._targetCustomer;
                        $state.go("tabs.order-form");
                    }
                    return true;
                },

                destructiveButtonClicked: function() {
                    console.log('DESTRUCT');
                    // 上桌
                    apiHelper('updateOrder', {
                        params: {
                            status: 1,
                            deviceId: _deviceId
                        }
                    }).then(function() {
                        // to where?! - clean item
                        $state.reload();
                    });
                    // $http
                    return true;
                }
            });
        };
    });

angular.bootstrap(document, ['ionicApp']);