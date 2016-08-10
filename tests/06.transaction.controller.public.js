describe('Transactions.Control', function () {

  beforeEach( module('cashPointApp') );

  var $controller, httpBackend;


  beforeEach( inject( function(_$controller_){
    $controller = _$controller_;
  }));

  describe('public methods', function () {
    var $scope;

    beforeEach(inject(function(){
      // var controller;

      $scope = {};
      // $controller('cashPointController', { $scope: $scope });
      $controller('transactions', { $scope: $scope });


    }));

    it('showHistoricalTransaction() should change the value of the current active transaction to the expected index', function() {

      $scope.$parent = { transationtoshow: 0 };
      // change to 3rd item in index
      $scope.showHistoricalTransaction(1);
      expect( $scope.$parent.transationtoshow ).toBe(2);

      // change to 10th item in index
      $scope.showHistoricalTransaction(9);
      expect( $scope.$parent.transationtoshow ).toBe(10);

    });


  });
});
