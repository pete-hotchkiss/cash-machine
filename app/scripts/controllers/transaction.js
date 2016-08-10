/* global angular, keypad, $parent, transactions */
(function() {
  'use strict';

  function transactions( $scope ) {
    /**
      Sets the transaction to show the detail for to an appropriate index

      @method showHistoricalTransaction;
    */
    $scope.showHistoricalTransaction = function(i) {
      $scope.$parent.transationtoshow = i + 1;
    };
  }

  angular.module('cashPointApp')
    .controller('transactions', ['$scope', transactions])
})();
