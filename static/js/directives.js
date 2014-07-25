'use strict';

/* Directives */


angular.module('schedo.directives', []).
directive('menu', [function($rootScope) {
    return  {
		templateUrl : partialPath+"/directive/menu.html",
		restrict : "AE",
		transclude : true,
		scope : true,
		link : function link(scope) {
		}
	};
}]);
