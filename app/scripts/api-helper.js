angular.module('ionicApp')
    .factory('apiHelper', ['$http',
        function apiHelper($http) {
            var _maps = {},
                _urlPrfix = '/api';

            function _buildUrl(toUrl, params) {
                if (!params) return toUrl;

                _.each(params, function(val) {
                    if (toUrl.indexOf(':') > -1) {
                        toUrl = toUrl.replace(/:[^/]+/, val);
                    } else {
                        toUrl = toUrl + '/' + val;
                    }
                });
                return toUrl;
            }

            // endpont[, url part arr][,data/params][,opt]
            function helper(endpoint, opt) {
                arguments = _.toArray(arguments);
                var apiStr = _maps[arguments.shift()];
                var method = apiStr.split(' ')[0];
                if (_.isObject(_.last(arguments))) {
                    opt = arguments.pop();
                } else {
                    opt = {};
                }
                if (_.isObject(_.last(arguments))) {
                    if (/(DELETE)|(GET)/.test(method)) {
                        opt.params = arguments.pop();
                    } else {
                        opt.data = arguments.pop();
                    }
                }
                if (!apiStr) throw new Error('Endpint ' + endpoint + 'Does Not Exist!');

                return $http(_.extend({
                    method: method,
                    url: _urlPrfix + _buildUrl(apiStr.split(' ')[1], arguments),
                }, opt));
            }

            helper.config = function(maps) {
                _maps = _.extend(_maps, maps);
            };

            helper.configByType = function(maps, opt) {
                // maps = _.extend({}, maps); // no need for ensure key-value exist
                var processMaps = {};
                var opt = opt || {
                    prefix: ''
                };
                // need template to build?
                _.each(maps.add, function(endpoint) {
                    processMaps['add' + _.slugify(endpoint)] = 'POST ' + opt.prefix + endpoint;
                });
                _.each(maps.del, function(endpoint) {
                    processMaps['del' + _.slugify(endpoint)] = 'DELETE ' + opt.prefix + endpoint;
                });
                _.each(maps.list, function(endpoint) {
                    processMaps['get' + _.slugify(endpoint) + 'List'] = 'GET ' + opt.prefix + endpoint + 's';
                });
                _.each(maps.item, function(endpoint) {
                    processMaps['get' + _.slugify(endpoint)] = 'GET ' + opt.prefix + endpoint;
                });
                this.config(processMaps);
            };

            return helper;
        }
    ])
    .factory('apiHelperInterceptor', function($q) {
        $notice = console;
        $notice.success = console.log;
        return {
            request: function(config) {
                config.originUrl = config.url;
                if (config.url.indexOf('api') > -1) {
                    config.url = window._APIHOST + config.url;
                }
                return config;
            },
            responseError: function(response) {
                // if (response.config.url.indexOf('/api/') > -1) {
                $notice.error('error-' + response.status + ': ' +
                    (response.config.url || '') + (response.data.msg || ', 接口出问题啦!'));
                // }
                return $q.reject(response);
            },

            response: function(response) {
                // config be closed
                if (response.config.url.indexOf('/api/') > -1) {
                    if (response.config.method === 'POST') {
                        $notice.success('操作成功！');
                    }
                    // return response.data.data;
                    return response.data;
                }
                return response;
            }
        };
    })
    .config(function($httpProvider) {
        $httpProvider.interceptors.push('apiHelperInterceptor');
    });