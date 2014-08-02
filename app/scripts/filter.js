angular.module('ionicApp')
    .filter('hostImg', function() {
        return function(val) {
            return window._APIHOST + '/' + val;
        }
    }).filter('inferLeftCount', function() {
        return function(i) {
            return i.tableCapacity - i.customerNum;
        }
    }).filter('inferLeftStr', function() {
        return function(i) {
            var count = i.tableCapacity - i.customerNum;
            if (count === 1) {
                return '可接受1人'
            } else {
                return '可接受1-' + count + '人';
            }
        }
    });