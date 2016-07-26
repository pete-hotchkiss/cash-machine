/* global angular, jslinq, numeral, ngAlias, asCurrency, currency, transactions, keypad, cashPointController */
'use strict';

numeral.language('en-gb');

angular.module('cashPointApp', ['cfp.hotkeys', 'toggle-switch', 'ui.router'])
  .config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider.state('home', {
      url: '/',
      templateUrl: 'templates/current-float.html'
    });

    $stateProvider.state('transaction-history', {
      url: '/transaction-history',
      templateUrl: 'templates/transaction-history.html',
      controller: 'transactions'
    });
  })
  .value('version', 'v1.0.0')
  .value('withdrawlpriortiy', '##buildtype##')
  .value('prioritydenomination', Number('##priority-value##'))
  .controller('cashPointController', ['$scope', '$http', 'version', 'withdrawlpriortiy', 'prioritydenomination', cashPointController])
  .controller('keypad', ['$scope', 'hotkeys', keypad ])
  .controller('transactions', ['$scope', transactions])
  .directive('ngAlias', ngAlias )
  .directive('asCurrency', asCurrency )
  .directive('transactionSummary', function() {
    return {
      templateUrl: 'templates/transaction-summary.html'
    };
  })
  .filter('currency', currency );
