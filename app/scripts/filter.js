angular.module('ionicApp')
    .filter('hostImg', function() {
        return function(val) {
            if (!val) {
                return 'logo.png';
            }
            return window._APIHOST + '/' + val;
        }
    }).filter('inferLeftCount', function() {
        return function(i) {
            return i.tableCapacity - i.customerNum;
        }
    }).filter('inferLeftStr', function() {
        return function(i) {
            var count = i.tableCapacity - i.customerNum;
            if (count === 0) {
                return '已满'
            }
            if (count === 1) {
                return '可接受1人'
            } else {
                return '可接受1-' + count + '人';
            }
        }
    }).filter("timeago", function() {
        //time: the time
        //local: compared to what time? default: now
        //raw: wheter you want in a format of "5 minutes ago", or "5 minutes"
        return function(time, local, raw) {
            if (!time) return "never";

            if (!local) {
                (local = Date.now())
            }

            if (angular.isDate(time)) {
                time = time.getTime();
            } else if (typeof time === "string") {
                time = new Date(time).getTime();
            }

            if (angular.isDate(local)) {
                local = local.getTime();
            } else if (typeof local === "string") {
                local = new Date(local).getTime();
            }

            if (typeof time !== 'number' || typeof local !== 'number') {
                return;
            }

            var
            offset = Math.abs((local - time) / 1000),
                span = [],
                MINUTE = 60,
                HOUR = 3600,
                DAY = 86400,
                WEEK = 604800,
                MONTH = 2629744,
                YEAR = 31556926,
                DECADE = 315569260;

            if (offset <= MINUTE) span = ['', raw ? '刚刚' : '1分钟'];
            else if (offset < (MINUTE * 60)) span = [Math.round(Math.abs(offset / MINUTE)), '分钟'];
            else if (offset < (HOUR * 24)) span = [Math.round(Math.abs(offset / HOUR)), '小时'];
            else if (offset < (DAY * 7)) span = [Math.round(Math.abs(offset / DAY)), 'day'];
            else if (offset < (WEEK * 52)) span = [Math.round(Math.abs(offset / WEEK)), 'week'];
            else if (offset < (YEAR * 10)) span = [Math.round(Math.abs(offset / YEAR)), 'year'];
            else if (offset < (DECADE * 100)) span = [Math.round(Math.abs(offset / DECADE)), 'decade'];
            else span = ['', '很久之前'];

            span[1] += (span[0] === 0 || span[0] > 1) ? 's' : '';
            span = span.join(' ');

            if (raw === true) {
                return span;
            }
            return (time <= local) ? span + '前' : 'in ' + span;
        }
    })


;