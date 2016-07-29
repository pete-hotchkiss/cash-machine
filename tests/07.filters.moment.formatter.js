var myApp = angular.module('myApp', []);
myApp.filter('formateddate', formateddate);
/**
 * A filter used to transfer value to Boolean.
 * If the input value is equal to 'f' / 0 / '0' / 'false' / 'no'/ 'n' or an empty array it returns false, otherwise it returns true.
 */
// myApp.filter('bool', function () {
// 	return function (value) {
//         if (value && value.length !== 0) {
//             var v = angular.lowercase('' + value);
//             value = !(v === 'f' || v === '0' || v === 'false' || v === 'no' || v === 'n' || v === '[]');
//         } else {
//             value = false;
//         }
//         return value;
// 	};
// });
//
// function formateddate(numberFilter) {
//   function isNumeric(value)
//   {
//     return (!isNaN(parseFloat(value)) && isFinite(value));
//   }
//   return function (v) {
//     return !isNumeric(v) ? numeral(0).divide(100).format( '$0,0.00' ) : numeral(v).divide(100).format( '$0,0.00' );
//   };
// }

// ---SPECS-------------------------

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
