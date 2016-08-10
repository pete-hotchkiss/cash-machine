/* global angular */

(function (angular) {
    var app = angular.module('app', []);
    app.directive("asCurrency", asCurrency.map );

})(angular);



describe('CashPointDirective', function () {
    var directiveDefinitionObject;

    beforeEach(function () {
        module('app', function ($provide) {
            $provide.decorator('asCurrencyDirective', function ($delegate) {
                directiveDefinitionObject = $delegate[0];
                return $delegate;
            });
        });
    });

    describe('Currency Formatter...', function () {
        var element, compile, scope, m;

        beforeEach(inject(function ($compile, $rootScope) {
            scope   = $rootScope.$new();
            m = {};
            element = $compile('<as-currency ng-model="m"></as-currency>')(scope);
            scope.$digest();
        }));

        it('compiles', function () {
            expect(element[0]).toEqual(jasmine.any(Object));
        });
        //
        it('passed numerical values are formatted as expected currency', function() {
          // console.log( "function", scope.formatAsCurrency );
          expect( scope.formatAsCurrency(0)).toBe('£0.00');
          expect( scope.formatAsCurrency(1100)).toBe('£11.00');
          expect( scope.formatAsCurrency(1234567)).toBe('£12,345.67');
          expect( scope.formatAsCurrency(12345679)).toBe('£123,456.79');
          expect( scope.formatAsCurrency(123456790)).toBe('£1,234,567.90');
          // expect( scope.hello()).toBe('hello');
        });


    });
});
