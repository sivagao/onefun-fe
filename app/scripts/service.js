angular.module('ionicApp')
    .run(function(apiHelper) {
        // http://172.16.121.65:9091/api/restaurant?slug=chekucoffee
        apiHelper.config({
            'getRestaurantList': 'GET /restaurant/list',
            'getResturant': 'GET /restaurant',

            'postPreOrderInfo': 'POST /preorder',

            'getAvailableList': 'GET /preorder/list',

            'mergeOrder': 'POST /mergeorder',
            'changeOrder': 'POST /changeorder'
        });
    });