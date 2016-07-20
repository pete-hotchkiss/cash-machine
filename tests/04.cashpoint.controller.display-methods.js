describe('CaashPoint', function () {

  beforeEach(module('cashPointApp'));

  var $controller, httpBackend;

  beforeEach(inject(function(_$controller_){
    $controller = _$controller_;
  }));

  describe('Display type methods:', function () {

    it('formatAsCurrency() should correctly change display format of passed values', function() {
      var $scope = {};
      var controller = $controller('cashPointController', { $scope: $scope });

      // format the value 300 to the app default currency format
      $scope.locale = "en-gb";
      expect($scope.formatAsCurrency(300)).toBe("£3.00");
      expect($scope.formatAsCurrency(3000)).toBe("£30.00");
      expect($scope.formatAsCurrency(765434)).toBe("£7,654.34");
    });

  });

});
