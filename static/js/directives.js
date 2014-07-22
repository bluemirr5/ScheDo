'use strict';

/* Directives */


angular.module('schedo.directives', []).
  directive('menu', function() {
    return  {
      	templateUrl:partialPath+"/menu.html",
		restrict:"AE",
		transclude:true,
		scope:true//,
		//controller:function link($scope, $elements, $attrs, $transclude){console.log("link");}
    };
  });
