Tasks = new Mongo.Collection('tasks');

if (Meteor.isClient) {

    Accounts.ui.config({
       passwordSignupFields: "USERNAME_ONLY"
     });

  // This code only runs on the client
  angular.module('simple-todos',['angular-meteor', 'accounts.ui']);

  angular.module('simple-todos').controller('TodosListCtrl', ['$scope', '$meteor',
    function ($scope, $meteor) {

        $scope.tasks = $meteor.collection(function() {
            return Tasks.find($scope.getReactively('query'), {sort: {createdAt: -1}})
         }); //using $meteor service to bind collection into our scope

      $scope.addTask = function (newTask) {
          $scope.tasks.push( {
              text: newTask,
              createdAt: new Date(),             // current time
              owner: Meteor.userId(),            // _id of logged in user
              username: Meteor.user().username }  // username of logged in user
          );
      };

      $scope.$watch('hideCompleted', function() {
        if ($scope.hideCompleted)
          $scope.query = {checked: {$ne: true}};
        else
          $scope.query = {};
      });

      $scope.incompleteCount = function () {
        return Tasks.find({ checked: {$ne: true} }).count();
      };

    }]);
}
