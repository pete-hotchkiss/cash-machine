/* global angular, keypad, $parent, numeral, version, withdrawlpriortiy, currency, prioritydenomination, jslinq */
'use strict';

// Chart.defaults.global.elements.line.fill = false;
Chart.defaults.global.elements.point.radius = 5;
Chart.defaults.global.elements.point.borderWidth = 2;
Chart.defaults.global.defaultFontFamily = 'Fira Mono';
// Chart.defaults.global.defaultFontFamily


(function (ChartJsProvider) {
  ChartJsProvider.setOptions({ colors: [ '#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'] });
});

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
    };

    $scope.getHistoricalAmounts = function() {
      return jslinq( $scope.transactions )
      .select( function(e) { return e.amount; })
      .toList().reverse();
    };

    $scope.getHistoricalTimeStamps = function() {
      return jslinq( $scope.transactions )
      .select( function(e) { return e.timestamp; })
      .toList().reverse();
      // return ['January', 'Bebruary', 'March', 'April', 'May', 'June', 'July'];
    };

    $scope.getFirstTimeStamp = function() {
      return $scope.getHistoricalTimeStamps()[0];
    };

    $scope.getLastTimeStamp = function() {
      return $scope.getHistoricalTimeStamps()[ $scope.getHistoricalTimeStamps().length - 1];
    };

    $scope.$watch( function() { return Global.transactions; }, function( nv, ov ) {
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
    };

    $scope.labels = $scope.getHistoricalTimeStamps();

    $scope.data = [
      $scope.getHistoricalBalances(),
      $scope.getHistoricalAmounts()
    ];
    $scope.series = [ 'Balance', 'Withdrawal Amount' ];
    $scope.colots = ['#F7464A', '#FDB45C'];
    // $scope.colors = [
    //   { // grey
    //     // backgroundColor: 'rgba(148,159,177,0.2)',
    //     pointBackgroundColor: 'rgba(148,159,177,1)',
    //     pointHoverBackgroundColor: 'rgba(148,159,177,1)',
    //     borderColor: 'rgba(148,159,177,1)',
    //     pointBorderColor: '#fff',
    //     pointHoverBorderColor: 'rgba(148,159,177,0.8)',
    //     borderDash: [5,10]
    //   },
    //   { // dark grey
    //     backgroundColor: 'rgba(77,83,96,0.2)',
    //     pointBackgroundColor: 'rgba(77,83,96,1)',
    //     pointHoverBackgroundColor: 'rgba(77,83,96,1)',
    //     borderColor: 'rgba(77,83,96,1)',
    //     pointBorderColor: '#fff',
    //     pointHoverBorderColor: 'rgba(77,83,96,0.8)',
    //     borderDash: [5,10],
    //     radius: 10
    //   }
    // ];
    $scope.options = { legend: { display: true },
    showXLabels: 5,
    animation: false,
    scales: {
      xAxes: [{
          display: true,
          gridLines: {
            display: true
          },
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
          gridLines: {
            display: false
          },
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
    },
    tooltips: {
      callbacks: {
        label: function (t,e){
          var fn = window['currency'];
          var a=e.datasets[t.datasetIndex].label||"";
          return a + ": " + fn()( t.yLabel );
          }
      }
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
