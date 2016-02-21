if (Meteor.isClient) {

angular.module('HearIt')
    .controller('recordCtrl', ['$scope', '$meteor', '$ionicModal', RecordController]);

function RecordController($scope, $meteor, $ionicModal){
    var self = this;
    this.hello = "Hello World"; //in html we have to use {{instance.hello}}, where instance = name of controllerAs part

    this.toggleRecording = function($event){
        //e = $("#record");
        //e = document.getElementById("record");
        e = $event.target;
        if (e.classList.contains("recording")) {
            // stop recording
            audioRecorder.stop();
            e.classList.remove("recording");
            //audioRecorder.getBuffers( gotBuffs );
            getBuffers();
        } else {
            // start recording
            if (!audioRecorder)
                return;
            e.classList.add("recording");
            audioRecorder.clear();
            audioRecorder.record();
        }
    }

}

}
