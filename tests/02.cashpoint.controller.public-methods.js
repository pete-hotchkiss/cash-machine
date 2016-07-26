/* global inject */
'use strict';

describe('Cashpoint.Controller', function () {

  beforeEach(module('cashPointApp'));

  var $controller;


  beforeEach(inject(function(_$controller_){
    $controller = _$controller_;
  }));

  describe('Controller public methods:', function () {

    var $scope;

    beforeEach(inject(function(){
      var controller;

      $scope = {};
      controller = $controller('cashPointController', { $scope: $scope });

      $scope.withdrawlpriortiy = 'least';
      $scope.prioritydenomination = 2000;
      $scope.locale = 'en-gb';
    }));



    it('deposit() loads the float.json file again resetting the balance of available funds', inject(function ($http, $httpBackend) {

      // console.dir(controller);


      $scope.depostFunds = function() {
        $http.get('/data/float.json')
        .success( function( data ) {
          $scope.float = data.float;

        })
        .error( function() {
          $scope.valid = false;
        });
      };
      $httpBackend.expectGET('templates/current-float.html').respond('a');
      $httpBackend.when('GET', '/data/float.json')
      .respond(200, { float: [ {'denomination': 1, 'amount': 100},
                    {'denomination': 2, 'amount': 100} ] });

      $httpBackend.flush();

      expect($scope.float).toBeDefined();
      expect($scope.float.length).toBe(2);
      expect($scope.currentbalance).toBe(300);
    }));



  });

});
