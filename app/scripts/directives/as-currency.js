'use strict';

function asCurrency (){
  return{
    require:'ngModel',
    link: function(scope, elem, attrs, ctrl){
      ctrl.$parsers.unshift(checkForEven);

      function checkForEven(v){
        // if (parseInt(viewValue)%2 === 0) {
        //   ctrl.$setValidity('evenNumber',true);
        // }
        // else{
        //   ctrl.$setValidity('evenNumber', false);
        // }

        numeral.language('en-gb');

        return ctrl.$isEmpty(v) ? numeral(0).divide(100).format( '$0,0.00' ) : numeral(v).divide(100).format( '$0,0.00' );

        // return viewValue;
      }

      ctrl.$formatters.unshift(checkForEven);
    }
  };
};
