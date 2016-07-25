/* global angular, jslinq, numeral, ngAlias, asCurrency, keypad, cashPointController */
'use strict';

angular.module('cashPointApp', ['cfp.hotkeys'])
  .value('version', 'v1.0.1')
  .controller('cashPointController', ['$scope', '$http', cashPointController])
  .controller('keypad', ['$scope', 'hotkeys', keypad ])
  .directive('ngAlias', ngAlias )
  .directive('asCurrency', asCurrency )
  .directive('transactionSummary', function() {
    return {
      templateUrl: 'templates/transaction-summary.html'
    };
  })
  .filter('currency', currency );
