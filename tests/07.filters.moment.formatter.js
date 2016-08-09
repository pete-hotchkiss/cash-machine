var myApp = angular.module('myApp', []);
myApp.filter('formateddate', formateddate);


describe('Filters', function () {
    beforeEach(function () {
        module('myApp');
    });

    describe('Date & Time formatting...', function () {
      it('has a bool filter', inject(function($filter) {
          expect($filter('formateddate')).not.toBeNull();
      }));

      it("Should return a verbose date-time readable format", inject(function (formateddateFilter) {
          expect(formateddateFilter(123456, 'L LTS')).toBe('01/01/1970 12:02:03 AM');
      }));

      it("Should return just time with am/pm", inject(function (formateddateFilter) {
          expect(formateddateFilter(123456, 'LTS')).toBe('12:02:03 AM');
      }));
    });
});
