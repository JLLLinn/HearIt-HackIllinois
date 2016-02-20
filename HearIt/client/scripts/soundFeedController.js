angular.module('HearIt')
.controller('SoundFeedCtrl', ['$scope', '$meteor', SoundFeedController]);

function SoundFeedController($scope, $meteor){
    var self = this;
    this.hello = "Hello World";
}
