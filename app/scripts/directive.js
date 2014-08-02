angular.module('ionicApp')
    .directive('randomAvatar', function() {
        var cacheData = 'http://wilee.me/image/portrait/portrait_' + Math.ceil(Math.random() * 9) + '.jpg';
        return {
            restrict: 'EAC',
            template: '<img ng-src="{{imgSrc}}" />',
            link: function($scope) {
                $scope.imgSrc = cacheData;
            }
        }
    });