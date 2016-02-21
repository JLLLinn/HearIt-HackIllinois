angular.module('HearIt')
.controller('ProfileCtrl', ProfileCtrl);

function ProfileCtrl ($scope, $reactive, $state, $ionicPopup, $log, $ionicLoading,$cordovaCamera) {
  $reactive(this).attach($scope);

  // let user = Meteor.user();
  // let name = user && user.profile ? user.profile.name : '';
  //
  // this.name = name;
  // this.updateName = updateName
  $scope.try = "hey";
  $scope.updatePicture = updatePicture;

  ////////////
  $scope.getPhoto = function(){

    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit: false,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 500,
      targetHeight: 500,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
      correctOrientation:true
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {
      var image = document.getElementById('myImage');
      image.src = "data:image/jpeg;base64," + imageData;
      $scope.newPost.imageData=image.src;

    }, function(err) {
      // error
    });

  };


  function updatePicture () {
    console.log("clicked");
    MeteorCameraUI.getPicture({ width: 60, height: 60 }, function (err, data) {
      if (err && err.error == 'cancel') {
        return;
      }

      if (err) {
        return handleError(err);
      }

      $ionicLoading.show({
        template: 'Updating picture...'
      });

      Meteor.call('updatePicture', data, (err) => {
        $ionicLoading.hide();
        handleError(err);
      });
    });
  }

  // function updateName () {
  //   if (_.isEmpty(this.name)) return;
  //
  //   Meteor.call('updateName', this.name, (err) => {
  //     if (err) return handleError(err);
  //     $state.go('tab.chats');
  //   });
  // }
  //
  // function handleError (err) {
  //   $log.error('profile save error ', err);
  //
  //   $ionicPopup.alert({
  //     title: err.reason || 'Save failed',
  //     template: 'Please try again',
  //     okType: 'button-positive button-clear'
  //   });
  // }
}
