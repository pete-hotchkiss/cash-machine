/* global angular, jslinq, numeral, ngAlias, asCurrency, currency, transactions, keypad, cashPointController, charting */
// 'use strict';

// Chart.defaults.scale.ticks.callback = function(label, name){
//   // console.log('formatting' + ' >> ' + name);
//   console.log(arguments);
//   // return "£"+label.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
//   // callback: function(label, index, labels) {
//     return '£' + label ;
//   // }
//
// };


numeral.language('en-gb');

(function() {
    'use strict';


angular.module('cashPointApp', ['cfp.hotkeys', 'toggle-switch', 'ui.router', 'chart.js'])
  .factory('Global', function(){
    return { transactions: [] };
  })
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

    $stateProvider.state('transaction-charting', {
      url: '/transaction-charting',
      templateUrl: 'templates/transaction-charting.html',
      controller: 'charting'
    });
  })
  .value('version', 'v1.0.0')
  .value('withdrawlpriortiy', '##buildtype##')
  .value('prioritydenomination', Number('##priority-value##'))
  .directive('transactionSummary', function() {
    return {
      templateUrl: 'templates/transaction-summary.html'
    };
  });
})();
