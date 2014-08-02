angular.module('ionicApp')
    .controller('orderLocationCtrl', function($scope, $rootScope, $ionicLoading, apiHelper, $timeout, $state) {

        $rootScope.loading = $ionicLoading.show({
            content: '正在定位请稍后...',
            showBackdrop: false
        });

        $timeout(function() {
            $state.go('tabs.order-locationed');
            $rootScope.loading.hide();
        }, 1500);

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
    })
    .controller('orderLocationedCtrl', function($rootScope) {
        $rootScope.getResturant();
    })
    .controller('orderFormCtrl', function($scope, $rootScope, $ionicPopup, $state, apiHelper, WebSocket) {

        // prefill data
        if (window._stateParam) {
            $scope.info = window._stateParam;
        } else {
            $scope.info = localStorage.getItem('orederInfo') || {};
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
            $scope.info.deviceId = window._deviceId;
            if (!$scope.info.tableCapacity) {
                return;
            }

            if ($scope.info.tableCapacity === $scope.info.customerNum) {
                $scope.info.isAccept = 0;
            } else {
                $scope.info.isAccept = $scope.info.isAccept ? 1 : 0;
            }

            apiHelper('postPreOrderInfo', {
                data: $scope.info
            }).then(function(resp) {
                showAlert();
                $rootScope.preOrderInfo = resp;
                localStorage.setItem('orederInfo',
                    _.pick($scope.info, 'nickName', 'isAccept', 'introText')
                );
            });
        };

        function showAlert() {
            var alertPopup = $ionicPopup.alert({
                title: '预约成功！',
                template: '您可以到拼桌页面，查找附近的人，一起来.'
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
                return item >= val;
            }));
        }
    })
    .controller('orderInfoCtrl', function($scope, $rootScope) {
        if (window._myselfOrder) {
            $rootScope.preOrderInfo = _myselfOrder;
        }

        if (!$rootScope.resturantInfo) {
            $rootScope.getResturant();
        }
        // todo: $state.go('tabs.order-info');

        $scope.cancelOrder = function() {
            // ajax cleanup
        };

        $scope.reSetting = function() {

        };
    })