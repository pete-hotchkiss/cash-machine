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
      $scope.amount = '500';
      $scope.$parent = { amount: '500', message: {}};
      // $scope.displayvalue = $scope.formatAsCurrency( $scope.amount );
      $scope.reset();
      expect( $scope.amount ).toBe('500');
      // expect( $scope.displayvalue ).toBe('£0.00');
    });

    it('deleteValue() method should remove the last entered value entered on the keypad', function() {

      $scope.$parent = { amount: '1234567890', message: {}};
      // $scope.$parent.amount = '1234567890';
      // lop a value of the end and check the amount changes
      $scope.deleteValue();
      expect( $scope.$parent.amount ).toEqual('123456789');
      // and repeat
      $scope.deleteValue();
      expect( $scope.$parent.amount ).toEqual('12345678');

      $scope.deleteValue();
      $scope.deleteValue();
      $scope.deleteValue();
      $scope.deleteValue();
      $scope.deleteValue();
      $scope.deleteValue();
      $scope.deleteValue();
      $scope.deleteValue();
      expect( $scope.$parent.amount ).toEqual('0');
    });

    it("buildvalue() should construct a value as expected", function() {
      $scope.$parent = { amount: '' };
      $scope.buildvalue(1);
      expect( $scope.$parent.amount ).toBe('1');

      $scope.buildvalue(2);
      $scope.buildvalue(3);
      $scope.buildvalue(4);
      $scope.buildvalue(5);
      expect( $scope.$parent.amount ).toBe('12345');
    });

  });
});
