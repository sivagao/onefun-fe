angular.module('ionicApp')
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('tabs', {
                url: "/tab",
                abstract: true,
                templateUrl: "tabs.html"
            })
            .state('tabs.order', {
                url: "/order",
                views: {
                    'order-tab': {
                        templateUrl: "order-location.html",
                        controller: 'orderLocationCtrl'
                    }
                }
            })
            .state('tabs.order-locationed', {
                url: "/order-locationed",
                views: {
                    'order-tab': {
                        templateUrl: "order-locationed.html",
                        controller: 'orderLocationCtrl'
                    }
                }
            })
            .state('tabs.order-form', {
                url: "/order-form",
                views: {
                    'order-tab': {
                        templateUrl: "order-form.html",
                        controller: 'orderFormCtrl'
                    }
                }
            })
            .state('tabs.order-info', {
                url: "/order-info",
                views: {
                    'order-tab': {
                        templateUrl: "order-info.html",
                        controllder: 'orderInfoCtrl'
                    }
                }
            })
            .state('tabs.argue', {
                url: "/argue",
                views: {
                    'argue-tab': {
                        templateUrl: "argue-list.html",
                        controllder: 'argueListCtrl'
                    }
                }
            })
            .state('tabs.argue-detail', {
                url: "/argue-detail",
                views: {
                    'argue-tab': {
                        templateUrl: "argue-detail.html",
                        controllder: 'argueDetailCtrl'
                    }
                }
            })
            .state('tabs.argue-finish', {
                url: "/argue-finish",
                views: {
                    'argue-tab': {
                        templateUrl: "argue-finish.html",
                        controllder: 'argueFinishCtrl'
                    }
                }
            })
            .state('tabs.profile', {
                url: "/profile",
                views: {
                    'profile-tab': {
                        templateUrl: "profile-detail.html",
                        controllder: 'profileDetailCtrl'
                    }
                }
            })
            .state('tabs.manage-list', {
                url: "/manage-list",
                views: {
                    'argue-tab': {
                        templateUrl: "manage-list.html",
                        controllder: 'manageListCtrl'
                    }
                }
            })
            .state('tabs.manage-item', {
                url: "/manage-item",
                views: {
                    'argue-tab': {
                        templateUrl: "manage-item.html",
                        controllder: 'manageItemCtrl'
                    }
                }
            });


        $urlRouterProvider.otherwise("/tab/order");
    });