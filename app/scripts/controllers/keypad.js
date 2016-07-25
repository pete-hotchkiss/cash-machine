/* global angular, keypad, $parent */
'use strict';

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
    // console.log('reset aaa');
    // console.log("amount", $scope.amount);
    // $scope.$parent.displayvalue = $scope.$parent.formatAsCurrency( 0 );
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
      console.log('a');
      // This should never happen, but better to be safe
      throw ( new Error('Sorry - only numbers can be withdrawn'));
    }

    if( !$scope.checkAvailableBalance( a ) ) {
      console.log('b');
      // Requested amount is more than the avilable balance.
      throw ( new Error('Sorry - Insuficent funds') );
    } else if ( a < 1 ) {
      console.log('c');
      // Cant dispense fresh air so ensure that at least something have been requested
      throw ( new Error('Sorry - you need to request an ammount of at least £0.01'));
    } else {
      console.log('dss');
      // there's enough money avilable so get a withdrawl
      var wd = $scope.$parent.getRequestedWithdrawl(a);
      var cn = $scope.$parent.getWithdrawlCountsTypeCounts( a );

      console.log('wd', 'cn');

      // update the float so it relfects the withdrawl
      $scope.$parent.updateFloat( wd );

      /// ...and return a cash data object with the details we need
      var t = {
        timestamp: Date.now(),
        amount: a,
        balance: $scope.$parent.currentbalance,
        totalcount: wd.length,
        withdrawldetail: $scope.$parent.getRequestedWithdrawlCounts( wd ),
        breakdown: cn, simple: wd
      }; // singleOrDefault

      // dump the latest transaction into the transaction history
      $scope.$parent.transactions.unshift(t);
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
    console.log('submit', $scope.amount, $scope.withdraw);
    try {
      $scope.withdraw( $scope.amount );
    } catch ( e ) {
      console.log("it's failed");
      // if it doesn't work then deal with it
      $scope.$parent.message = { type: 'warning', message: e.message };
    }
  };

}
