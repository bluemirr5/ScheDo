'use strict';

var partialPath = "static/partials";

Date.prototype.format = function(f) {
    if (!this.valueOf()) return " ";
    var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    var d = this;
    return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
        switch ($1) {
            case "yyyy": return d.getFullYear();
            case "yy": return (d.getFullYear() % 1000).zf(2);
            case "MM": return (d.getMonth() + 1).zf(2);
            case "dd": return d.getDate().zf(2);
            case "E": return weekName[d.getDay()];
            case "HH": return d.getHours().zf(2);
            case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
            case "mm": return d.getMinutes().zf(2);
            case "ss": return d.getSeconds().zf(2);
            case "a/p": return d.getHours() < 12 ? "오전" : "오후";
            default: return $1;
        }
    });
};

Date.prototype.getWeek = function() {
	var onejan = new Date(this.getFullYear(),0,1);
	return Math.ceil((((this - onejan) / 86400000) + onejan.getDay()+1)/7);
}

String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
String.prototype.zf = function(len){return "0".string(len - this.length) + this;};
Number.prototype.zf = function(len){return this.toString().zf(len);};

function clone(destination, source) {
    for (var property in source) {
        if (typeof source[property] === "object" && source[property] !== null && destination[property]) { 
            clone(destination[property], source[property]);
        } else {
            destination[property] = source[property];
        }
    }
};

var Include = {
    JS: function (fileName){
        var JS  = document.createElement('script');
        JS.type = 'text/javascript';  
        JS.src  = '/static/js/' + fileName + '.js';   //Path of your Javascript files
        document.getElementsByTagName('head')[0].appendChild(JS);
    },
    CSS: function (fileName){
        var CSS   = document.createElement('link');
        CSS.rel   = 'stylesheet';
        CSS.type  = 'text/css';
        CSS.href  = '/static/css/' + fileName + '.css'; //Path of your Stylesheet files
        CSS.media = 'screen';
        document.getElementsByTagName('head')[0].appendChild(CSS);        
    }
};

angular.module('schedo', [
	'ngRoute',
	'schedo.services',
	'schedo.controllers',
	'schedo.directives',
	'ui.bootstrap'
	//  'myApp.filters',
]).
config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/', {templateUrl: partialPath+'/calendar.html', controller: 'scheduleCtrl'});
	$routeProvider.when('/calendar', {templateUrl: partialPath+'/calendar.html', controller: 'scheduleCtrl'});
	$routeProvider.when('/statistics', {templateUrl: partialPath+'/statistics.html', controller: 'statisticsCtrl'});
	$routeProvider.when('/project', {templateUrl: partialPath+'/project.html', controller: 'projectCtrl'});
	$routeProvider.otherwise({redirectTo: '/'});
}]);
