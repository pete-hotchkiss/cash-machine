/* global moment, angular */

var formateddate = (function() {
  'use strict';

  function formateddate( numberFilter ) {

    function isNumeric(value)
    {
      return (!isNaN(parseFloat(value)) && isFinite(value));
    }

    return function (v) {
      return !isNumeric(v) ? v : moment(v).format( arguments[1] );
    };

  }

  // console.log('formateddate', formateddate);

  angular.module('cashPointApp')
    .filter('formateddate', formateddate );
  //
  var api = { map: formateddate };
  return api;
})();
