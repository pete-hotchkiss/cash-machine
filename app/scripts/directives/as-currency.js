'use strict';

function asCurrency (){
  return{
    require:'ngModel',
    link: function(scope, elem, attrs, ctrl){


      scope.formatAsCurrency = function (v){
        numeral.language('en-gb');

        return (v == 0) ? numeral(0).divide(100).format( '$0,0.00' ) : numeral(v).divide(100).format( '$0,0.00' );

      }

      // ctrl.$parsers.unshift(formatAsCurrency);
      ctrl.$formatters.unshift(scope.formatAsCurrency);
    }
  };
};

// function asCurrency(){
//   return {
//     require: 'ngModel',
//     link: function(scope, ctrl){
//       ctrl.$parsers.unshift(scope.formatAsCurrency);
//
//       scope.hello = function(){
//         return "hello";
//       };
//       scope.formatAsCurrency = function(v){
//         numeral.language('en-gb');
//
//         return (v == 0) ? numeral(0).divide(100).format( '$0,0.00' ) : numeral(v).divide(100).format( '$0,0.00' );
//       };
//
//       ctrl.$formatters.unshift(scope.formatAsCurrency);
//     }
//   };
// };
