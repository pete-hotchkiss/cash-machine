function ngAlias($compile) {
    return {
        restrict: "A",
        link: function(scope, element, attrs) {
            console.log('arrts', attrs);
            var splits = attrs['ngAlias'].trim().split(/\s+as\s+/);
            scope.$watch(splits[0], function(val) {
                scope.$eval(splits[1]+'=('+splits[0]+')');
            });
        }
    };
  }
