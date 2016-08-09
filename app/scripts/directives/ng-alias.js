/* global angular */
(function() {

  'use strict';

  function ngAlias($compile) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var splits = attrs.ngAlias.trim().split(/\s+as\s+/);
            scope.$watch(splits[0], function() {
                scope.$eval(splits[1] + '=(' + splits[0] + ')');
            });
        }
    };
  }

  angular.module('cashPointApp')
    .directive('ngAlias', ngAlias );
})();
