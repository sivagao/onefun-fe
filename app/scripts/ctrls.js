angular.module('ionicApp')
    .controller('orderLocationCtrl', function($scope, $rootScope, $http, $ionicLoading, apiHelper) {

        $scope.loading = $ionicLoading.show({
            content: '正在定位请稍后...',
            showBackdrop: false
        });

        apiHelper('getRestaurantList').then(function(resp) {
            console.log(resp);
        });

        // Todo with show not in location page

        getLocation();

        function getLocation() {
            navigator.geolocation.getCurrentPosition(function(pos) {
                console.log(pos);
                // $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
                // with backend
                $scope.loading.hide();
            }, function(error) {
                alert('Unable to get location: ' + error.message);
            });
        }

        function getRestInfo() {
            // ws

        }
    })
    .controller('orderFormCtrl', function($scope, $rootScope, $http) {

        $scope.submitOrder = function() {
            $http.post('', {

            }).then(function() {

            });
        }
    })
    .controller('orderInfoCtrl', function($scope, $rootScope) {
        console.log('orderInfoCtrl');
        $scope.cancelOrder = function() {

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
                        $state.go("tabs.manage-item", {});
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
    })
    .controller('manageItemCtrl', function($scope) {

    });

angular.bootstrap(document, ['ionicApp']);