describe('Cashpoint.Controller', function () {

  beforeEach(
    module('cashPointApp')
  );

  var $controller, httpBackend;

  beforeEach(inject(function(_$controller_){
    $controller = _$controller_;
  }));

  describe('Controller private methods:', function () {

    var $scope, controller

    beforeEach(inject(function(){
      $scope = {};
      controller = $controller('cashPointController', { $scope: $scope });
    }));

    it('balance() should return expected balance', function() {
      // var $scope = {};
      // var controller = $controller('cashPointController', { $scope: $scope });

      // create temporary float of total value 300
      $scope.currentbalance = 300;
      $scope.float = [ {"denomination": 1, "amount": 100}, {"denomination": 2, "amount": 100} ];
      expect($scope.balance()).toBe(300);

      // create temporary float of total value 468
      $scope.currentbalance = 468;
      $scope.float = [ {"denomination": 1, "amount": 8}, {"denomination": 20, "amount": 3} , { "denomination": 100, "amount": 4}];
      expect($scope.balance()).toBe(468);
    });

    it('checkAvailable() should return true or false for sufficent balance to cover withdrawl request', function() {
      // var $scope = {};
      // var controller = $controller('cashPointController', { $scope: $scope });

      // check if balance of 300 will cover withdrawl of 50
      $scope.currentbalance = 300;
      $scope.float = [ {"denomination": 1, "amount": 100}, {"denomination": 2, "amount": 100} ];
      expect($scope.checkAvailableBalance(50)).toBeTruthy();

      // check if balance of 468 will cover withdrawl of 500
      $scope.currentbalance = 468;
      $scope.float = [ {"denomination": 1, "amount": 8}, {"denomination": 20, "amount": 3} , { "denomination": 100, "amount": 4}];
      expect($scope.checkAvailableBalance(500)).not.toBeTruthy();
    })

    it('getPriorityIndex() should return an expected index for a given denomination', function() {

      $scope.float = [ {"denomination": 1, "amount": 100}, {"denomination": 2, "amount": 100}, {"denomination": 5, "amount": 100}, {"denomination": 10, "amount": 100}, {"denomination": 20, "amount": 100}, {"denomination": 50, "amount": 100}, {"denomination": 100, "amount": 100} ];

      // priority to 50 should be at index 5
      expect($scope.getPriorityIndex(50)).toEqual(5);

      // priority to 50 should be at index 5
      expect($scope.getPriorityIndex(2)).toEqual(1);
    })

    it('getAviailableDenominations() should returns an array of numbers', function() {
      // var $scope = {};
      // var controller = $controller('cashPointController', { $scope: $scope });

      $scope.float = [ {"denomination": 1, "amount": 100, type:"coin"}, {"denomination": 2, "amount": 100, type:"coin"} ];
      expect($scope.getAviailableDenominations()).toBeArrayOfNumbers();
    })

    it('getAviailableDenominations() returns expected array values', function() {
      // var $scope = {};
      // var controller = $controller('cashPointController', { $scope: $scope });

      $scope.float = [ {"denomination": 1, "amount": 100}, {"denomination": 2, "amount": 100} ];
      expect($scope.getAviailableDenominations()).toEqual([1,2]);
      expect($scope.getAviailableDenominations()).not.toEqual([1,2,3]);
    })

    it('getRequestedWithdrawl() returns expected cash strucure', function() {
      // var $scope = {};
      // var controller = $controller('cashPointController', { $scope: $scope });
      $scope.withdrawlpriortiy = 'least';
      $scope.float = [ {"denomination": 1, "amount": 100}, {"denomination": 2, "amount": 100}, {"denomination": 5, "amount": 100}, {"denomination": 10, "amount": 100}, {"denomination": 20, "amount": 100}, {"denomination": 50, "amount": 100}, {"denomination": 100, "amount": 100} ];

      expect($scope.getRequestedWithdrawl(238)).toEqual([100, 100, 20, 10, 5, 2, 1]);

    })

    it('getRequestedWithdrawlCounts() returns expected counts of denominations', function() {
      // var $scope = {};
      // var controller = $controller('cashPointController', { $scope: $scope });
      $scope.withdrawlpriortiy = 'least';
      $scope.float = [ {"denomination": 1, "amount": 100}, {"denomination": 2, "amount": 100}, {"denomination": 5, "amount": 100}, {"denomination": 10, "amount": 100}, {"denomination": 20, "amount": 100}, {"denomination": 50, "amount": 100}, {"denomination": 100, "amount": 100} ];

      expect($scope.getRequestedWithdrawlCounts( $scope.getRequestedWithdrawl(238))).toEqual([{ key: 100, count: 2, elements: [ 100, 100 ] }, { key: 20, count: 1, elements: [ 20 ] }, { key: 10, count: 1, elements: [ 10 ] }, { key: 5, count: 1, elements: [ 5 ] }, { key: 2, count: 1, elements: [ 2 ] }, { key: 1, count: 1, elements: [ 1 ] }]);

    })
    //
    it('getWithdrawlCountsTypeCounts() returns expected counts of coins and notes', function() {
      // var $scope = {};
      // var controller = $controller('cashPointController', { $scope: $scope });
      $scope.withdrawlpriortiy = 'least';
      $scope.float = [ {"denomination": 1, "amount": 100, type:"coin"}, {"denomination": 2, "amount": 100, type:"coin"}, {"denomination": 5, "amount": 100, type:"coin"}, {"denomination": 10, "amount": 100, type:"coin"}, {"denomination": 20, "amount": 100, type:"coin"}, {"denomination": 50, "amount": 100, type:"coin"}, {"denomination": 1000, "amount": 100, type:"note"} ];

      expect($scope.getWithdrawlCountsTypeCounts(2238)).toEqual(
        { coins: 9, cointotal: 238, notes: 2, notetotal: 2000 }
      );

    })
    //
    //
    //
    it('updateFloat() correctly reduces the number of demoninations items in the float ', function() {
      // var $scope = {};
      // var controller = $controller('cashPointController', { $scope: $scope });
      $scope.withdrawlpriortiy = 'least';
      $scope.float = [ {"denomination": 1, "amount": 100, "type":"coin"}, {"denomination": 2, "amount": 100, "type":"coin"} ];

      expect($scope.updateFloat( [2,2,2,2,1] )).toEqual([ {"denomination": 1, "amount": 99, "type":"coin"}, {"denomination": 2, "amount": 96, "type":"coin"} ]);

    })
    //
    it('changeWithdrawlPriority() ensure switching priority of withdrawl types sets expected values', function() {
      // var $scope = {};
      // var controller = $controller('cashPointController', { $scope: $scope });

      $scope.withdrawlpriortiy = 'least';

      // if called with argument d format is changed to denomination priority
      expect($scope.changeWithdrawlPriority('d')).toEqual('denomination')

      // if called with argument s format is changed to least number of items priority
      expect($scope.changeWithdrawlPriority('s')).toEqual('least')

    });
    //
    it('changeWithdrawlPriority() ensure switching priority of withdrawl can only be set to valid types', function() {
      // var $scope = {};
      // var controller = $controller('cashPointController', { $scope: $scope });
      // $scope.withdrawlpriortiy = 'smallest';

      // if called with an invalid argument type then an error should have been thrown
      expect( function() { $scope.changeWithdrawlPriority('p'); }).toThrow( new Error('Invalid priority type requested' ));
    });




  });

});
