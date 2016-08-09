/* global angular, $parent */
var asCurrency = (function() {
  'use strict';

  function asCurrency (){
    return {
      require: 'ngModel',
      link: function(scope, elem, attrs, ctrl){


        scope.formatAsCurrency = function (v){


          return (v === 0) ? numeral(0).divide(100).format( '$0,0.00' ) : numeral(v).divide(100).format( '$0,0.00' );

        }

        // ctrl.$parsers.unshift(formatAsCurrency);
        ctrl.$formatters.unshift(scope.formatAsCurrency);
      }
    };
  }

  angular.module('cashPointApp')
    .directive('asCurrency', asCurrency );

  console.log('asCurrency', asCurrency);

  var api = { map: asCurrency };
  return api;

})();
