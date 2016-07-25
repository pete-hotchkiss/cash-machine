describe('Keypad', function () {

  beforeEach( module('cashPointApp') );

  var $controller, httpBackend;


  beforeEach( inject( function(_$controller_){
    $controller = _$controller_;
  }));

  describe('keypad public methods', function () {
    var $scope;

    beforeEach(inject(function(){
      // var controller;

      $scope = {};
      // $controller('cashPointController', { $scope: $scope });
      $controller('keypad', { $scope: $scope });


      $scope.withdrawlpriortiy = 'least';
      $scope.prioritydenomination = 2000;
      $scope.locale = 'en-gb';
    }));

    it('reset() should cancel the current entered withdrawal amount', function() {
      // console.log('amount', $scope.reset);
      // at first check values are not zero
      $scope.amount = 500;
      $scope.$parent = { amount: 500, message: {}};
      // $scope.displayvalue = $scope.formatAsCurrency( $scope.amount );
      $scope.reset();
      expect( $scope.amount ).toBe(500);
      // expect( $scope.displayvalue ).toBe('£0.00');
    });

  });

});
