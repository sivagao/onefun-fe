angular.module('ionicApp')
    .controller('orderLocationCtrl', function($scope, $rootScope, $ionicPopup) {

    })
    .controller('orderFormCtrl', function($scope, $rootScope, $ionicPopup) {

    })
    .controller('orderInfoCtrl', function($scope, $rootScope, $ionicPopup) {

    })
    .controller('argueListCtrl', function($scope, $state) {

    })
    .controller('argueDetailCtrl', function($scope, $rootScope, $ionicPopup) {

    })
    .controller('argueFinishCtrl', function($scope, $rootScope, $ionicPopup) {

    })
    .controller('profileDetailCtrl', function($scope, $rootScope) {

    })
    .controller('dashCtrl', function($scope, $stateParams) {
        console.log('dashCtrl');
        $scope.dash = {
            name: $stateParams.name
        };
        // 评论和详情 - baidu it?! commentList
    })
    .controller('profileCtrl', function($scope) {
        console.log('restaurantCtrl');
    });