angular.module('ionicApp')
    .filter('hostImg', function() {
        return function(val) {
            return window._APIHOST + '/' + val;
        }
    });