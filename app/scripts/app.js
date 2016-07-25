/* global angular, jslinq, numeral, ngAlias, asCurrency, keypad */
'use strict';

angular.module('cashPointApp', ['cfp.hotkeys'])
  .value('version', 'v1.0.1')
  .controller('cashPointController', ['$scope', '$http', 'hotkeys', function cashPointController($scope, $http, hotkeys) {

    $http.get('/data/float.json').then( function(result) {
        $scope.float = result.data.float;
        $scope.updateblance();
    });

    // hotkeys.add({ combo: '1', callback: function() { $scope.buildvalue(1); } });
    // hotkeys.add({ combo: '2', callback: function() { $scope.buildvalue(2); } });
    // hotkeys.add({ combo: '3', callback: function() { $scope.buildvalue(3); } });
    // hotkeys.add({ combo: '4', callback: function() { $scope.buildvalue(4); } });
    // hotkeys.add({ combo: '5', callback: function() { $scope.buildvalue(5); } });
    // hotkeys.add({ combo: '6', callback: function() { $scope.buildvalue(6); } });
    // hotkeys.add({ combo: '7', callback: function() { $scope.buildvalue(7); } });
    // hotkeys.add({ combo: '8', callback: function() { $scope.buildvalue(8); } });
    // hotkeys.add({ combo: '9', callback: function() { $scope.buildvalue(9); } });
    // hotkeys.add({ combo: '0', callback: function() { $scope.buildvalue(0); } });
    // hotkeys.add({ combo: 'enter', callback: function() { $scope.submit(); } });
    // hotkeys.add({ combo: 'backspace', callback: function() { $scope.deleteValue(); } });

    $scope.locale = 'en-gb';
    $scope.withdrawlpriortiy = '##buildtype##';
    $scope.prioritydenomination = Number('##priority-value##');
    $scope.currentbalance = -1;
    $scope.transactions = []; // to hold transactional history
    $scope.displayvalue = 0;
    $scope.amount = 0;
    $scope.message = {};
    $scope.transationtoshow = 0;

    // $scope.reset = function() {
    //   $scope.displayvalue = $scope.formatAsCurrency( 0 );
    //   $scope.amount = 0;
    //   // $scope.message = {};
    // };

    $scope.buildvalue = function( a ) {
      // console.log("bv", a, $scope.amount);
      $scope.amount = ($scope.amount === 0 ) ? a : $scope.amount.toString() + a;
      // $scope.displayvalue = $scope.formatAsCurrency( $scope.amount );
    };

    /**
    Deletes the last digit entered on the key pad

    @method deleteValue
    */
    $scope.deleteValue = function() {
      // current amount is a string so as long as it has some length lob that last character off the end.
      $scope.amount = ($scope.amount.length === 1) ? '0' : $scope.amount.substr(0, $scope.amount.length - 1);
      // $scope.displayvalue = $scope.formatAsCurrency( $scope.amount );
    };

    /**
    Sets the transaction to show the detail for to an appropriate index

    @method showHistoricalTransaction;
    */
    $scope.showHistoricalTransaction = function(i) {
      $scope.transationtoshow = i + 1;
    };

    // /**
    // ng-submit wrapper to the withdraw function
    // */
    // $scope.submit = function() {
    //   try {
    //     $scope.withdraw( $scope.amount );
    //   } catch ( e ) {
    //     // if it doesn't work then deal with it
    //     $scope.message = { type: 'warning', message: e.message };
    //   }
    // };

    /**
    Change the format of the withdrawl type - swaps between smallest number of denominations or weighting to a particualr denomination
    */
    $scope.changeWithdrawlPriority = function( f ) {
      switch(f) {
        case 'd':
        case 's':
          $scope.withdrawlpriortiy = ( f === 'd' ) ? 'denomination' : 'least';
          break;
        default:
          throw ( new Error('Invalid priority type requested') );
          // break;
      }
      return $scope.withdrawlpriortiy;
    };

    /**
  	Returns the current balance of the float

    @method balance
    @param s { string } - currency format to return in
  	*/
    $scope.balance = function() {
      return $scope.currentbalance;
    };

    /***
    Returns boolean value to determine in requested withdrawl amount is available. No free overdrafts at this bank

    @method checkAvailable
    @param a { number } - withdrawl amount requested
    */
    $scope.checkAvailableBalance = function( a ) {
      return $scope.currentbalance >= a;
    };

    /**
    Returns an array of available denominations

    @param t - include types ?
    */
    $scope.getAviailableDenominations = function(t) {
      return jslinq($scope.float)
        .select( function(e) {
          return (t) ? { denomination: e.denomination, type: e.type, amount: e.amount } : e.denomination;
        })
        .toList();
    };





    /***
    Returns a simple array detailing the structure of the returned withdrawl. Values are returned as their raw values with the largest denomination first i.e. [100,50,20,20,10,5,2,1]

    @param getRequestedWithdrawl
    @param a { numer } - the amount to withdraw
    @param ty = withdrawl return type. Either "denomination" or "type" - i.e. do you want a list of values of types
    */
    $scope.getRequestedWithdrawl = function( a, ty ) {

      // grab an array of the currently available denominations
      var bills = $scope.getAviailableDenominations(true);
      var steppedback = false;
      // the withdrawl algorithm impacts whether a given denomination whould be prioritised or just the fewest possible notes/coins. If we're running in least mode then use the entire float available. If we're in denomination priority mode then only allow the loop to count back from the index where the desired denomination exists
      var index = ($scope.withdrawlpriortiy === 'least') ? bills.length - 1 : $scope.getPriorityIndex($scope.prioritydenomination);

      var splits = [];

      var cp = 1;

      // start building the transaction
      while (a >= bills[0].denomination){

        // The float is made up of currency in a caononical system, meaning we can use a greedy method of finding the resulting transaction strcutre, so starting with the largest possible denomination, keep adding instances of the denomination untill such a point it's more than required so step down to next smallest denomination
        if (a >= bills[index].denomination && $scope.float[index].amount >= cp){

          // build value object to be returned to the callig method dependent on what the callee requires. Sometimes it's just the denomination value - and othertimes it's more verbose and the type of denomination the value is ( i.e. coin or note ) is also required.
          a -= bills[index].denomination;

          splits.push( (ty !== 'type') ? bills[index].denomination : { type: bills[index].type, value: bills[index].denomination } );
          cp++;
        } else {

            // deal with instances where there is available balance but requested withdrawl cant be made
            if( bills[index].denomination === 1 && a !== 0 ) {
              throw ( new Error('Sorry - we cant provide that withdrawl amount. The float is ' + a + ' short' ) );
            } else {
              // Should the app be running in denomination priority mode double check a larger denomination cant be used once all the available priority notes have been used
              if( $scope.withdrawlpriortiy !== 'least'
                && a >= bills[index].denomination && !steppedback) {
                // step back up to the start of the float by setting the index back to the float length
                index = bills.length - 1;
                cp = 1;
                steppedback = true;
              } else {
                cp = 1;
                index--;
              }
            }
        }
      }
      return ( $scope.withdrawlpriortiy === 'least' ) ? splits : splits.sort().reverse();
    };

    /***
    Returns a breakdown of the different denomination types in a withdrawl object detailing how many there are of each type - i.e. { key: 100, count: 2, elements: [ 100, 100 ] }

    @param a { array } - amount being withdrawn

    */
    $scope.getRequestedWithdrawlCounts = function( a ) {
      return jslinq( a )
      .groupBy( function(e) {
        return e;
      })
      .toList();
    };

    /**
    Return a detail object with a total count of the number of notes and coins in a withdrawl.
    */
    $scope.getWithdrawlCountsTypeCounts = function( a ) {
      var cn = jslinq( $scope.getRequestedWithdrawl( a, 'type' ) )
      .groupBy( function(e) {
        return e.type;
      })
      .toList();

      return {
        coins: Number(jslinq(cn).where( function(e) { return e.key === 'coin'; }).select( function(e) { return e.count; }).singleOrDefault()),
        cointotal: $scope.getDenominationTypeSubTotal( cn, 'coin'),
        notes: Number(jslinq(cn).where( function(e) { return e.key === 'note'; }).select( function(e) { return e.count; }).singleOrDefault()),
        notetotal: $scope.getDenominationTypeSubTotal( cn, 'note')
      };
    };

    $scope.getDenominationTypeSubTotal = function( a, t ) {
      return jslinq(a).where( function(e) { return e.key === t; })
              .select( function(e) {
                return jslinq(e.elements)
              .sum( function(f) {
                return f.value;
              });
            }).singleOrDefault();
    };

    /**
    update the float reducing denomination counts according to passed withdrawl structure
    */
    $scope.updateFloat = function( w ) {

      for( var d in w ) {
        var foo = jslinq($scope.float)
          .where(
            function(e) { return e.denomination === w[d]; }
          )
          .toList()[0];

        foo.amount --;
      }
      $scope.updateblance();
      return $scope.float;
    };

    $scope.updateblance = function() {
      $scope.currentbalance = jslinq($scope.float)
          .sum( function(el){ return el.amount * el.denomination; });
    };

    $scope.testfunction = function( a ) {
      return 100 * a;
    };

    /**
    Return a passed value in single units into decimal format - i.e. 100 units = £1
    */
    // $scope.formatAsCurrency = function( a ) {
    //   numeral.language($scope.locale);
    //   return numeral(a).divide(100).format( '$0,0.00' );
    // };

    /**
    returns the index of the priority denomination to be used if applicable
    */
    $scope.getPriorityIndex = function( d ) {
      // loops through the float, finding the position of the denomination that should be given priority
      var ind = $scope.getAviailableDenominations(false).indexOf(d);

      // as long as there is stock of the priority denomination keep using it
      return ( $scope.float[ind].amount > 1 ) ? ind : $scope.float.length - 1;
    };

    /**
    Loads the float json object again to depost new funds
    */
    $scope.depositFunds = function() {
      $http.get('/data/float.json').then( function(result) {
          $scope.float = result.data.float;
          $scope.updateblance();
          return $scope.float;
      });
    };

  }])
  .controller('keypad', ['$scope', 'hotkeys', keypad ])
  .directive('ngAlias', ngAlias )
  .directive('asCurrency', asCurrency )
  .directive('transactionSummary', function() {
    return {
      templateUrl: 'templates/transaction-summary.html'
    };
  })
  .filter('currency', currency);
