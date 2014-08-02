angular.module('ionicApp')
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