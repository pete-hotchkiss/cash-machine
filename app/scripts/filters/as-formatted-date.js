/* global numeral */
'use strict';

function formateddate(numberFilter) {
  function isNumeric(value)
  {
    return (!isNaN(parseFloat(value)) && isFinite(value));
  }
  return function (v) {
    return !isNumeric(v) ? v : moment(v).format(arguments[1]);
  };
}
