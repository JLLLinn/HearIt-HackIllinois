if (Meteor.isClient) {

angular.module('HearIt')
    .controller('SoundFeedCtrl', ['$scope', '$meteor', '$ionicModal', SoundFeedController]);

function SoundFeedController($scope, $meteor, $ionicModal){
    var self = this;
    this.hello = "Hello World"; //in html we have to use {{instance.hello}}, where instance = name of controllerAs part
    $scope.date = "November 05, 1955"; //in html we can use use {{date}}

    this.feed = [
        {"title": "Hello World", "date": "Novemebr 05, 1955"},
         {"title": "My Journey to the Alps", "date": "December 21, 1990"}
     ];
     this.addShortClip = function(){
         alert("hi");
     }

     $ionicModal.fromTemplateUrl('client/templates/shortClipCard.html', {
         scope: $scope
        // animation: 'slide-in-down'
       }).then(function(modal) {
         $scope.modal = modal;
       });
       $scope.openModal = function() {
         $scope.modal.show();
       };
       $scope.closeModal = function() {
         $scope.modal.hide();
       };
       //Cleanup the modal when we're done with it!
       $scope.$on('$destroy', function() {
         $scope.modal.remove();
       });
       // Execute action on hide modal
       $scope.$on('modal.hidden', function() {
         // Execute action
       });
       // Execute action on remove modal
       $scope.$on('modal.removed', function() {
         // Execute action
       });

    $scope.$watch('completed', function() {
        alert("hi");
        if ($scope.completed)
            $scope.checkText = "checked";
        else
            $scope.checkText = "non checked";
    });
}
}
