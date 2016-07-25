describe('Keypad.Control', function () {

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
      $controller('cashPointController', { $scope: $scope });
      $controller('keypad', { $scope: $scope });

      $scope.withdrawlpriortiy = 'least';
      $scope.prioritydenomination = 2000;
      $scope.locale = 'en-gb';

      $scope.checkAvailableBalance = function(a) {
        return $scope.currentbalance >= a;
      };

      $scope.$parent = $scope;
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

    it('withdraw(): should throw an exception if anthing other than a number is passed', function() {

      expect( function() { $scope.withdraw('foo'); }).toThrow( new Error('Sorry - only numbers can be withdrawn'));
    });

    it('withdraw(): should throw an exception if there is insufficent funds to cover the amount being withdrawn', function () {



      // try and withdraw 1000 from a balance of 500
      $scope.currentbalance = 500;
      expect(function() { $scope.withdraw(1005); }).toThrow(new Error('Sorry - Insuficent funds'));

      // try and withdraw 57 from a balance of 7934
      $scope.currentbalance = 4000;
      expect(function() { $scope.withdraw(1000); }).not.toThrow(new Error('Sorry - Insuficent funds'));
    });

    it('withdraw(): throws error if withdrawl amount cant be made up from available float', function() {

      $scope.currentbalance = 465;
      $scope.float = [ {'denomination': 1, 'amount': 5}, {'denomination': 20, 'amount': 3}, { 'denomination': 100, 'amount': 4} ];


      expect(function() { $scope.withdraw(446); }).toThrow(new Error('Sorry - we cant provide that withdrawl amount. The float is 1 short'));

    });

    it('withdraw(): returns expected balance from a withdrawal', function() {
      $scope.currentbalance = 465;
      $scope.float = [ {'denomination': 1, 'amount': 5}, {'denomination': 20, 'amount': 3}, { 'denomination': 100, 'amount': 4}];

      // console.log($scope.withdraw(64).balance);
      var f = $scope.withdraw(64);
      // console.log(f);
      expect(f.balance).toBe(401);
      expect(f.totalcount).toBe(7);

    });

    it('withdraw(): returns an object with expected structure', function() {
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

    it('withdraw(): when requested returns an object using the most possible priorty denomination units', function() {


      // withdrawing 68 from a balance of 468 returns the epxected amount
      $scope.currentbalance = 84468;
      $scope.float = [ {'denomination': 1, 'amount': 8, 'type': 'coin'}, {'denomination': 20, 'amount': 3, 'type': 'coin'}, { 'denomination': 100, 'amount': 4, 'type': 'coin'}, { 'denomination': 1000, 'amount': 4, 'type': 'note'}, { 'denomination': 2000, 'amount': 40, 'type': 'note'}];
      // change the withdrawl algorothm
      $scope.changeWithdrawlPriority('d');
      var nw = $scope.withdraw(10268);
      expect(nw.withdrawldetail[0].count).toEqual( Math.floor( 10268 / $scope.prioritydenomination));

    });

  });
});
