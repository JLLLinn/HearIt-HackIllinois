if (Meteor.isClient) {

angular.module('HearIt')
    .controller('recordCtrl', ['$scope', '$meteor', '$ionicModal', RecordController]);

function RecordController($scope, $meteor, $ionicModal){
    var self = this;
    this.hello = "Hello World"; //in html we have to use {{instance.hello}}, where instance = name of controllerAs part
    this.showResult = false;

    this.toggleRecording = function($event){
        //e = $("#record");
        //e = document.getElementById("record");
        e = $event.target;
        if (e.classList.contains("recording")) {
            // stop recording
            audioRecorder.stop();
            e.classList.remove("recording");
            //audioRecorder.getBuffers( gotBuffs );
            this.getBuffers();
        } else {
            // start recording
            if (!audioRecorder)
                return;
            e.classList.add("recording");
            audioRecorder.clear();
            this.showResult = false;
            audioRecorder.record();
        }
    }
    this.getBuffers = function(){
        audioRecorder.getBuffer( this.gotBuffers ); //gotBuffers is callback
    }
    this.gotBuffers = function( buffers ) {
        var canvas = document.getElementById( "wavedisplay" );

        drawBufferGlobal( canvas.width, canvas.height, canvas.getContext('2d'), buffers[0] );
        this.showResult = true;
        vizData = buffers[0];
        // the ONLY time gotBuffers is called is right after a new recording is completed -
        // so here's where we should set up the download.
        audioRecorder.exportWAV( doneEncoding );
    }

}

}
