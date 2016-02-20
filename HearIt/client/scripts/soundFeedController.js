angular.module('HearIt')
.controller('SoundFeedCtrl', ['$scope', '$meteor', SoundFeedController]);

function SoundFeedController($scope, $meteor){
    var self = this;
    this.hello = "Hello World"; //in html we have to use {{instance.hello}}, where instance = name of controllerAs part
    $scope.date = "November 05, 1955"; //in html we can use use {{date}}
}
