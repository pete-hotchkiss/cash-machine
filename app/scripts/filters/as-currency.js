'use strict';

function asCurrency(v) {
  function isNumeric(value)
  {
    return (!isNaN(parseFloat(value)) && isFinite(value));
  }

  return function (v) {
    numeral.language('en-gb');

    return isNumeric(!v) ? numeral(0).divide(100).format( '$0,0.00' ) : numeral(v).divide(100).format( '$0,0.00' );
  };
}

// .filter("asCurrency", function (numberFilter)
// {
//   function isNumeric(value)
//   {
//     return (!isNaN(parseFloat(value)) && isFinite(value));
//   }
//
//
// });
