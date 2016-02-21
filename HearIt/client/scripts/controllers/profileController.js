angular.module('HearIt')
.controller('ProfileCtrl', ProfileCtrl);

function ProfileCtrl ($scope, $reactive, $state, $ionicPopup, $log, $ionicLoading) {
  $reactive(this).attach($scope);
  $scope.searchedFriends = []
  console.log("in controller");
  if(Meteor.user() != null){
    //$scope.mySoundFeeds = SoundPosts.find({user_id: Meteor.userId()}, {sort: {createdAt: -1}}).fetch();
    if(typeof(Meteor.user().profile) == 'undefined'){
      Meteor.users.update( { _id: Meteor.userId() }, { $set: { 'profile.private': false }} );
    }
    $scope.privateCheck = Meteor.user().profile.private;
    if(typeof(Meteor.user().profile.following) != 'undefined'){
      $scope.friends=Meteor.users.find({"_id" : {$in : Meteor.user().profile.following}}, {sort: {createdAt: -1}}).fetch();
    }else{
      $scope.friends=[];
    }

    $scope.searching = false;
    var init_privateCheck = true;
    $scope.$watch('privateCheck', function(){
      console.log("changed");
      if(init_privateCheck){
        init_privateCheck = false;
      } else {
        Meteor.users.update( { _id: Meteor.userId() }, { $set: { 'profile.private': $scope.privateCheck }} );
      }
    });

    $scope.$watch('searchFriendTxt', function(){
      let searchFriendTxt = $scope.searchFriendTxt;
      console.log(searchFriendTxt);
      if(searchFriendTxt == "" || typeof(searchFriendTxt) == 'undefined'){
        $scope.searching = false;
        if(typeof(Meteor.user().profile.following) != 'undefined'){
          $scope.friends=Meteor.users.find({"_id" : {$in : Meteor.user().profile.following}}, {sort: {createdAt: -1}}).fetch();
        }else{
          $scope.friends=[];
        }
      }else{
        $scope.searching = true;
        $scope.searchedFriends = Meteor.users.find({$and:[
          {"username" : {$regex : searchFriendTxt+".*"}},
          {"_id" : {$ne : Meteor.userId()}},
        ]}, {sort: {createdAt: -1}}).fetch();
        $scope.searchedFriends_following = [];
        $scope.searchedFriends.forEach(function(user_2){
          if(curuser_is_following(user_2)){
            $scope.searchedFriends_following.push(true);
          }else{
            $scope.searchedFriends_following.push(false);
          }
        });
      }
    });

    let curuser_is_following = function(user_2){
      let curuser = Meteor.user();
      if(typeof(curuser.profile.following) != 'undefined' && curuser.profile.following.indexOf(user_2._id) != -1 ){
        return true;
      }else{
        return false;
      }
    }

    $scope.toggle_follow = function(index){
      console.log("toggle followed");
      console.log($scope.searchedFriends_following);
      let user_id = $scope.searchedFriends[index]._id;
      if($scope.searchedFriends_following[index]){

        Meteor.users.update( { _id: Meteor.userId() }, { "$push":{'profile.following': user_id} } );
      }else{
        Meteor.users.update( { _id: Meteor.userId() }, {"$pull":{"profile.following":user_id} } );
      }
    }
  }

}
