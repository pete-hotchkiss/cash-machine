/* global angular, keypad, $parent */
'use strict';

angular.module('cashPointApp')
  .controller('keypad', ['$scope', 'hotkeys', keypad ]);

function keypad( $scope, hotkeys ) {

  // Set up the numeric keys as listeners
  hotkeys.add({ combo: '1', callback: function() { $scope.buildvalue(1); } });
  hotkeys.add({ combo: '2', callback: function() { $scope.buildvalue(2); } });
  hotkeys.add({ combo: '3', callback: function() { $scope.buildvalue(3); } });
  hotkeys.add({ combo: '4', callback: function() { $scope.buildvalue(4); } });
  hotkeys.add({ combo: '5', callback: function() { $scope.buildvalue(5); } });
  hotkeys.add({ combo: '6', callback: function() { $scope.buildvalue(6); } });
  hotkeys.add({ combo: '7', callback: function() { $scope.buildvalue(7); } });
  hotkeys.add({ combo: '8', callback: function() { $scope.buildvalue(8); } });
  hotkeys.add({ combo: '9', callback: function() { $scope.buildvalue(9); } });
  hotkeys.add({ combo: '0', callback: function() { $scope.buildvalue(0); } });
  hotkeys.add({ combo: 'enter', callback: function() { $scope.submit(); } });
  hotkeys.add({ combo: 'backspace', callback: function() { $scope.deleteValue(); } });

  $scope.reset = function() {
    console.log('reset');
    $scope.$parent.displayvalue = $scope.formatAsCurrency( 0 );
    $scope.$parent.amount = 0;
    $scope.$parent.message = {};
  };

  /***
  Withdraw a passed amount. Returns a results object with details of how the cash withdrawl is structured, and the remaining balance in the float.

  @method withdraw
  @param a { number } amount to withdraw
  */
  $scope.withdraw = function( a ) {
    if( isNaN(a) ) {
      // This should never happen, but better to be safe
      throw ( new Error('Sorry - only numbers can be withdrawn'));
    }

    if( !$scope.checkAvailableBalance( a ) ) {
      // Requested amount is more than the avilable balance.
      console.log('withdrawn');
      throw ( new Error('Sorry - Insuficent funds') );
    } else if ( a < 1 ) {
      // Cant dispense fresh air so ensure that at least something have been requested
      throw ( new Error('Sorry - you need to request an ammount of at least £0.01'));
    } else {
      // there's enough money avilable so get a withdrawl
      var wd = $scope.getRequestedWithdrawl(a);
      var cn = $scope.getWithdrawlCountsTypeCounts( a );

      // update the float so it relfects the withdrawl
      $scope.updateFloat( wd );

      /// ...and return a cash data object with the details we need
      var t = { timestamp: Date.now(), amount: $scope.formatAsCurrency(a), balance: $scope.formatAsCurrency($scope.currentbalance), totalcount: wd.length, withdrawldetail: $scope.getRequestedWithdrawlCounts( wd ),
      breakdown: cn, simple: wd }; // singleOrDefault

      // dump the latest transaction into the transaction history
      $scope.transactions.unshift(t);
      // reset everything
      $scope.reset();

      // push a message to the UI
      $scope.$parent.message = { type: 'sucsess', message: 'Sucsessful Transaction' };

      return t;
    }
  };

  /**
  ng-submit wrapper to the withdraw function
  */
  $scope.submit = function() {
    console.log('submit', $scope.amount);
    try {
      $scope.withdraw( $scope.amount );
    } catch ( e ) {
      // if it doesn't work then deal with it
      $scope.$parent.message = { type: 'warning', message: e.message };
    }
  };

}
