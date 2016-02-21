Sounds = new FS.Collection("sounds", {
  stores: [new FS.Store.FileSystem("sounds", {path: "/public"})]
});

if (Meteor.isClient) {

angular.module('HearIt')
    .controller('SoundFeedCtrl', ['$scope', '$meteor', '$ionicModal', SoundFeedController]);

function SoundFeedController($scope, $meteor, $ionicModal){
    var self = this;

    //client subscribes to all the data from that publication
    $scope.$meteorSubscribe('soundPosts');
    //$scope.$meteorSubscribe('users');
    $scope.query = {};

    $scope.feed = $meteor.collection(function() {
        return SoundPosts.find($scope.getReactively('query'), {sort: {createdAt: -1}})
     }); //using $meteor service to bind collection into our scope
     //console.log($scope.feed);
    self.hello = "Hello World"; //in html we have to use {{instance.hello}}, where instance = name of controllerAs part
    $scope.date = "November 05, 1955"; //in html we can use use {{date}}
    $scope.vizData = null;
    $scope.soundFileLoc = "";
    // this.feed = [
    //     {"title": "Hello World", "date": "Novemebr 05, 1955"},
    //      {"title": "My Journey to the Alps", "date": "December 21, 1990"}
    //  ];
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
         $scope.showResult = false;
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

    // $scope.$watch('completed', function() {
    //     alert("hi");
    //     if ($scope.completed)
    //         $scope.checkText = "checked";
    //     else
    //         $scope.checkText = "non checked";
    // });

    // For Sound Post Collection methods
    $scope.addPost = function (title, soundFileLoc, vizData) {
        $meteor.call('addSoundPost', title, soundFileLoc, vizData);
    };
    $scope.deleteSoundPost = function (post) {
      $meteor.call('deleteSoundPost', post._id);
    };
    // For Sound recording and vizualization
    $scope.showResult = true;

    $scope.submitForm = function(title){

        $scope.addPost(title, $scope.soundFileLoc, $scope.vizData);
    }
    $scope.toggleRecording = function($event){
        //e = $("#record");
        //e = document.getElementById("record");
        e = $event.target;
        if (e.classList.contains("recording")) {
            // stop recording
            audioRecorder.stop();
            e.classList.remove("recording");
            //audioRecorder.getBuffers( gotBuffs );
            $scope.getBuffers();
            $scope.showResult = true;
        } else {
            // start recording
            if (!audioRecorder)
                return;
            e.classList.add("recording");
            audioRecorder.clear();
            $scope.showResult = false;
            audioRecorder.record();
        }
    }
    $scope.getBuffers = function(){
        audioRecorder.getBuffer( $scope.gotBuffers ); //gotBuffers is callback
    }
    $scope.gotBuffers = function( buffers ) {

        var canvas = document.getElementById( "wavedisplay" );

        drawBufferGlobal( canvas.width, canvas.height, canvas.getContext('2d'), buffers[0] );
        $scope.vizData = buffers[0];
        // the ONLY time gotBuffers is called is right after a new recording is completed -
        // so here's where we should set up the download.
        audioRecorder.exportWAV( $scope.doneEncoding );
    }
    $scope.doneEncoding = function( blob ) {
        $scope.setupDownload( blob, "myRecording" + ((recIndex<10)?"0":"") + recIndex + ".wav" );
        recIndex++;
    }
     $scope.setupDownload = function(blob, filename){
        var url = (window.URL || window.webkitURL).createObjectURL(blob);
        var link = document.getElementById("save");
        link.href = url;
        link.download = filename || 'output.wav';
        Sounds.insert(blob, function (err, fileObj)  {
        // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
      });
      }
}
}
if (Meteor.isServer) {
    Sounds.allow({
        'insert': function () {
        // add custom authentication code here
        return true;
        }
    });
    //registers a publication named "tasks"
    Meteor.publish('soundPosts', function () {
        return soundPosts.find({});
    });
    Meteor.startup(function () {
        // code to run on server at startup
    });
}
