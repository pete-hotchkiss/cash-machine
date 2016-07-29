/* global angular, keypad, $parent, numeral, version, withdrawlpriortiy, currency, prioritydenomination, jslinq */
'use strict';
// console.log('charts.types.line', Chart.types.Line);
// Chart.types.Line.extend({
//     name: "LineAlt",
//     initialize: function (data) {
//         console.log("iit");
//         Chart.types.Line.prototype.initialize.apply(this, arguments);
//         var xLabels = this.scale.xLabels
//         xLabels.forEach(function (label, i) {
//             if (i % 2 == 1)
//                 xLabels[i] = '';
//         })
//     }
// });


function charting ($scope, Global ) {
    // console.log("transactions: ", $scope.$parent.transactions);
    $scope.transactions = Global.transactions;
    // console.log($scope.getHistoricalTimeStamps);
    // $scope.labels = $scope.getHistoricalTimeStamps();


    /**
        Returns array of rolling balances
    */
    $scope.getHistoricalBalances = function() {
      return jslinq( $scope.transactions )
      .select( function(e) { return e.balance; })
      .toList().reverse();
    }

    $scope.getHistoricalAmounts = function() {
      return jslinq( $scope.transactions )
      .select( function(e) { return e.amount; })
      .toList().reverse();
    }

    $scope.getHistoricalTimeStamps = function() {
      return jslinq( $scope.transactions )
      .select( function(e) { return e.timestamp; })
      .toList().reverse();
      // return ['January', 'Bebruary', 'March', 'April', 'May', 'June', 'July'];
    }

    $scope.getFirstTimeStamp = function() {
      return $scope.getHistoricalTimeStamps()[0];
    }

    $scope.getLastTimeStamp = function() {
      return $scope.getHistoricalTimeStamps()[ $scope.getHistoricalTimeStamps().length - 1];
    }

    $scope.$watch( function() { return Global.transactions}, function(nv, ov) {
        if( nv !== ov ) {
          $scope.transactions = Global.transactions;
          $scope.bubbleUpdates();
        }
    }, true);

    $scope.bubbleUpdates = function() {
      $scope.labels = $scope.getHistoricalTimeStamps();
      $scope.data = [
        $scope.getHistoricalBalances(),
        $scope.getHistoricalAmounts()
      ];
    }

    $scope.labels = $scope.getHistoricalTimeStamps();

    $scope.data = [
      $scope.getHistoricalBalances(),
      $scope.getHistoricalAmounts()
    ];
    $scope.series = [ 'Balance', 'Withdrawal Amount' ];
    $scope.colors = [
      { // grey
        backgroundColor: 'rgba(148,159,177,0.2)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointHoverBackgroundColor: 'rgba(148,159,177,1)',
        borderColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)'
      },
      { // dark grey
        backgroundColor: 'rgba(77,83,96,0.2)',
        pointBackgroundColor: 'rgba(77,83,96,1)',
        pointHoverBackgroundColor: 'rgba(77,83,96,1)',
        borderColor: 'rgba(77,83,96,1)',
        pointBorderColor: '#fff',
        pointHoverBorderColor: 'rgba(77,83,96,0.8)'
      }
    ];
    $scope.options = { legend: { display: true }
    ,
    showXLabels: 5,
    scales: {
      xAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Time & Date'
          },
          ticks: {
            maxRotation: 0,
            max: $scope.getLastTimeStamp(),
            min: $scope.getFirstTimeStamp(),
            // stepSize: 5000,
            maxTicksLimit: 5,
            callback: function(label, index, labels) {
              var fn = window['formateddate'];
              if(typeof fn === 'function') { return fn()(label, 'LTS'); }
            }
          }
      }],
      yAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Amount'
          },
          ticks: {
            callback: function(label, index, labels) {
              var fn = window['currency'];
              if(typeof fn === 'function') { return fn()(label, false); }
            }
          }
      }]
    }
   };

  $scope.randomize = function () {
      $scope.data = $scope.data.map(function (data) {
        return data.map(function (y) {
          y = y + Math.random() * 10 - 5;
          return parseInt(y < 0 ? 0 : y > 100 ? 100 : y);
        });
      });
      $scope.foo = $scope.foo + " bar";
    };
  }
