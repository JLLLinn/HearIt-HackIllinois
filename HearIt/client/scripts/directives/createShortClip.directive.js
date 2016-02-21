angular.module('HearIt')
    .directive('createShortClip', createShortClip);

function createShortClip(){
    return {
      restrict: 'EA',
      replace: true,
      scope: true,
      controllerAs: 'shortClip',
      controller: function ($scope) {
          $scope.labels =["Reviews", "Useful Votes", "Funny Votes", "Average Rating"];

          $scope.data = [
            [68, 52, 19, 52.19952],//68/5 = 13.6 scale factor
            [12, 6, 0, 53.26576], //12/5 = 2.4 scale factor
          ];

          $scope.onClick = function (points, evt) {
              console.log(points, evt);
          };
      },
      link: function ($scope, $element, $attrs) {

      },
      //meteor uses absolute path from route
      templateUrl   : 'client/templates/shortClipCard.html',
    };
}
