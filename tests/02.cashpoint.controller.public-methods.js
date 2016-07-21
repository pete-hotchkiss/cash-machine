/* global inject */
'use strict';

describe('CaashPoint', function () {

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

    it('withdraw() should throw an exception if anthing other than a number is passed', function() {

      expect( function() { $scope.withdraw('foo'); }).toThrow( new Error('Sorry - only numbers can be withdrawn'));
    });

    //
    it('withdraw() should throw an exception if there is insufficent funds to cover withdrawl', function () {
      // var $scope = {};
      // var controller = $controller('cashPointController', { $scope: $scope });

      // try and withdraw 1000 from a balance of 468
      $scope.currentbalance = 500;
      expect(function() { $scope.withdraw(1005); }).toThrow(new Error('Sorry - Insuficent funds'));

      // try and withdraw 57 from a balance of 7934
      $scope.currentbalance = 4000;
      expect(function() { $scope.withdraw(1000); }).not.toThrow(new Error('Sorry - Insuficent funds'));
    });

    it('withdraw() throws error if withdrawl amount cant be made up from available float', function() {

      $scope.currentbalance = 465;
      $scope.float = [ {'denomination': 1, 'amount': 5}, {'denomination': 20, 'amount': 3}, { 'denomination': 100, 'amount': 4} ];

      expect(function() { $scope.withdraw(446); }).toThrow(new Error('Sorry - we cant provide that withdrawl amount. The float is £0.01 short'));

    });
    //
    //
    it('withdraw() can withdraw be made up', function() {
      $scope.currentbalance = 465;
      $scope.float = [ {'denomination': 1, 'amount': 5}, {'denomination': 20, 'amount': 3}, { 'denomination': 100, 'amount': 4}];

      expect($scope.withdraw(64).balance).toBe('£4.01');

    });

    // //
    it('withdraw() returns an expected float balance', function() {

      // withdrawing 68 from a balance of 468 returns the epxected amount
      $scope.currentbalance = 468;
      $scope.float = [ {'denomination': 1, 'amount': 8, 'type': 'coin'}, {'denomination': 20, 'amount': 3, 'type': 'coin'}, { 'denomination': 100, 'amount': 4, 'type': 'coin'}];


      expect($scope.withdraw(68).balance).toBe('£4.00');
    });
    // //
    it('withdraw() returns an object with expected structure', function() {
      // var $scope = {};
      // var controller = $controller('cashPointController', { $scope: $scope });

      // withdrawing 68 from a balance of 468 returns the epxected amount
      $scope.currentbalance = 4468;
      $scope.float = [ {'denomination': 1, 'amount': 8, 'type': 'coin'}, {'denomination': 20, 'amount': 3, 'type': 'coin'}, { 'denomination': 100, 'amount': 4, 'type': 'coin'}, { 'denomination': 1000, 'amount': 4, 'type': 'note'}];
      var nw = $scope.withdraw(1268);
      expect(nw).toHaveMember('balance');
      expect(nw).toHaveMember('totalcount');
      expect(nw).toHaveMember('withdrawldetail');
      expect(nw).toHaveMember('breakdown');
      // expect(nw.breakdown).toEqual({coins: 13, notes: 1});
      // console.log("detail: ", nw.withdrawldetail);
    });
    // //
    it('withdraw() when requested returns an object using the most possible priorty denomination units', function() {


      // withdrawing 68 from a balance of 468 returns the epxected amount
      $scope.currentbalance = 84468;
      $scope.float = [ {'denomination': 1, 'amount': 8, 'type': 'coin'}, {'denomination': 20, 'amount': 3, 'type': 'coin'}, { 'denomination': 100, 'amount': 4, 'type': 'coin'}, { 'denomination': 1000, 'amount': 4, 'type': 'note'}, { 'denomination': 2000, 'amount': 40, 'type': 'note'}];
      // change the withdrawl algorothm
      $scope.changeWithdrawlPriority('d');
      var nw = $scope.withdraw(10268);

      expect(nw.withdrawldetail[3].count).toEqual( Math.floor( 10268 / $scope.prioritydenomination));

    });

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
