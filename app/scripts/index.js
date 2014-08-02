angular.module('ionicApp', ['ionic']).run(function($rootScope) {
    window._APIHOST = 'http://172.16.121.65:9091';
    window._deviceId = 'acb' + new Date().getTime();
});