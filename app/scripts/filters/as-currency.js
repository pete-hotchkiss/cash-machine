/* global numeral */
'use strict';

function currency(numberFilter) {
  function isNumeric(value)
  {
    return (!isNaN(parseFloat(value)) && isFinite(value));
  }
  return function (v) {
    return !isNumeric(v) ? numeral(0).divide(100).format( '$0,0.00' ) : numeral(v).divide(100).format( (arguments[1]===false) ? '$0,0' : '$0,0.00' );
  };
}
