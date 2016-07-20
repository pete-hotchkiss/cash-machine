describe('CaashPoint', function () {

  beforeEach(module('cashPointApp'));

  var $controller, httpBackend;


  beforeEach(inject(function(_$controller_){
    $controller = _$controller_;
  }));

  describe('Instantiation Checks', function () {

    it('should provide a version number', inject(function(version) {
      expect(version).toEqual('v1.0.1');
    }));

    it('float value object should loaded from external source', inject(function ($http, $httpBackend) {


      var $scope = {};
      var controller = $controller('cashPointController', { $scope: $scope });

      // console.dir(controller);

      $http.get('/data/float.json')
      .success( function( data, status, headers, config ) {
        $scope.float = data.float;

      })
      .error( function( data, status, headers, config ) {
        $scope.valid = false;
      })

      $httpBackend.when('GET', '/data/float.json')
      .respond(200, { float: [ {"denomination": 1, "amount": 100},
                    {"denomination": 2, "amount": 100} ] });

      $httpBackend.flush();

      expect($scope.float).toBeDefined();
      expect($scope.float.length).toBe(2);

    }));
  });
});
