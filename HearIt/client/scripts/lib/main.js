/* Copyright 2013 Chris Wilson

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

window.AudioContext = window.AudioContext || window.webkitAudioContext;
//global variable in Meteor = don't write var
audioContext = new AudioContext();
audioInput = null;
    realAudioInput = null;
    inputPoint = null;
    audioRecorder = null;
rafID = null;
rafID1 = null;
analyserContext = null;
analyserContext1 = null;
canvasWidth=100;
canvasHeight=100;
canvasWidth1 = 100;
canvasHeight1 = 100;
recIndex = 0;

vizData = null;

/* TODO:

- offer mono option
- "Monitor input" switch
*/

function saveAudio() {
    audioRecorder.exportWAV( doneEncoding );
    // could get mono instead by saying
    // audioRecorder.exportMonoWAV( doneEncoding );
}
//gotBuffs = gotBuffers; //gotBuffs is global
function gotBuffers( buffers ) {
    var canvas = document.getElementById( "wavedisplay" );

    drawBufferGlobal( canvas.width, canvas.height, canvas.getContext('2d'), buffers[0] );
    vizData = buffers[0];
    // the ONLY time gotBuffers is called is right after a new recording is completed -
    // so here's where we should set up the download.
    audioRecorder.exportWAV( doneEncoding );
}

drawBufferGlobalPart = function(data, title){
    var canvas = document.getElementById("wavedisplay "+title);
    drawBufferGlobal( canvas.width, canvas.height, canvas.getContext('2d'), vizData );
}

doneEncoding = function( blob ) {
    setupDownload( blob, "myRecording" + ((recIndex<10)?"0":"") + recIndex + ".wav" );
    recIndex++;
}

function setupDownload(blob, filename){
    var url = (window.URL || window.webkitURL).createObjectURL(blob);
    var link = document.getElementById("save");
    link.href = url;
    link.download = filename || 'output.wav';
  }
getBuffers = function(){
    audioRecorder.getBuffer( gotBuffers ); //gotBuffers is callback
}
toggleRecording = function( e ) { //so now this function is global in Meteor
    if (e.classList.contains("recording")) {
        // stop recording
        audioRecorder.stop();
        e.classList.remove("recording");
        audioRecorder.getBuffer( gotBuffers ); //gotBuffers is callback
    } else {
        // start recording
        if (!audioRecorder)
            return;
        e.classList.add("recording");
        audioRecorder.clear();
        audioRecorder.record();
    }
}

function convertToMono( input ) {
    var splitter = audioContext.createChannelSplitter(2);
    var merger = audioContext.createChannelMerger(2);

    input.connect( splitter );
    splitter.connect( merger, 0, 0 );
    splitter.connect( merger, 0, 1 );
    return merger;
}

function cancelAnalyserUpdates() {
    window.cancelAnimationFrame( rafID );
    rafID = null;
}

updateAnalyserContext = function(analyserID){
    alert(analyserID)
    var canvas = document.getElementById(analyserID);
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;
    analyserContext = canvas.getContext('2d');
}



function updateAnalysers(time) {
    if (!analyserContext) {
        var canvas = document.getElementById("analyser");
        if(canvas != null){
            canvasWidth = canvas.width;
            canvasHeight = canvas.height;
            analyserContext = canvas.getContext('2d');
        }
        else{
            rafID = window.requestAnimationFrame( updateAnalysers );
            return; //wait till canvas is defined
        }

    }

    // analyzer draw code here
    {
        var SPACING = 2;
        var BAR_WIDTH = 1;
        var numBars = Math.round(canvasWidth / SPACING);
        var freqByteData = new Uint8Array(analyserNode.frequencyBinCount);

        analyserNode.getByteFrequencyData(freqByteData);

        analyserContext.clearRect(0, 0, canvasWidth, canvasHeight);
        analyserContext.fillStyle = '#F6D565';
        analyserContext.lineCap = 'round';
        var multiplier = analyserNode.frequencyBinCount / numBars;

        // Draw rectangle for each frequency bin.
        for (var i = 0; i < numBars; ++i) {
            var magnitude = 0;
            var offset = Math.floor( i * multiplier );
            // gotta sum/average the block, or we miss narrow-bandwidth spikes
            for (var j = 0; j< multiplier; j++)
                magnitude += freqByteData[offset + j];
            magnitude = magnitude / multiplier;
            var magnitude2 = freqByteData[i * multiplier];
            analyserContext.fillStyle = "hsl( " + Math.round((i*360)/numBars) + ", 100%, 50%)";
            analyserContext.fillRect(i * SPACING, canvasHeight, BAR_WIDTH, -magnitude);
        }
    }

    rafID = window.requestAnimationFrame( updateAnalysers );
}


function updateAnalysers1(time) {
    if (!analyserContext1) {
        var canvas = document.getElementById("analyser-recorder");
        if(canvas != null){
            canvasWidth1 = canvas.width;
            canvasHeight1 = canvas.height;
            analyserContext1 = canvas.getContext('2d');
        }
        else{
            rafID1 = window.requestAnimationFrame( updateAnalysers1 );
            return; //wait till canvas is defined
        }

    }

    // analyzer draw code here
    {
        var SPACING = 2;
        var BAR_WIDTH = 1;
        var numBars = Math.round(canvasWidth1 / SPACING);
        var freqByteData = new Uint8Array(analyserNode1.frequencyBinCount);

        analyserNode1.getByteFrequencyData(freqByteData);

        analyserContext1.clearRect(0, 0, canvasWidth1, canvasHeight1);
        analyserContext1.fillStyle = '#F6D565';
        analyserContext1.lineCap = 'round';
        var multiplier = analyserNode1.frequencyBinCount / numBars;

        // Draw rectangle for each frequency bin.
        for (var i = 0; i < numBars; ++i) {
            var magnitude = 0;
            var offset = Math.floor( i * multiplier );
            // gotta sum/average the block, or we miss narrow-bandwidth spikes
            for (var j = 0; j< multiplier; j++)
                magnitude += freqByteData[offset + j];
            magnitude = magnitude / multiplier;
            var magnitude2 = freqByteData[i * multiplier];
            analyserContext1.fillStyle = "hsl( " + Math.round((i*360)/numBars) + ", 100%, 50%)";
            analyserContext1.fillRect(i * SPACING, canvasHeight1, BAR_WIDTH, -magnitude);
        }
    }

    rafID1 = window.requestAnimationFrame( updateAnalysers1 );
}

function toggleMono() {
    if (audioInput != realAudioInput) {
        audioInput.disconnect();
        realAudioInput.disconnect();
        audioInput = realAudioInput;
    } else {
        realAudioInput.disconnect();
        audioInput = convertToMono( realAudioInput );
    }

    audioInput.connect(inputPoint);
}

function gotStream(stream) {
    inputPoint = audioContext.createGain();

    // Create an AudioNode from the stream.
    realAudioInput = audioContext.createMediaStreamSource(stream);
    audioInput = realAudioInput;
    audioInput.connect(inputPoint);

//    audioInput = convertToMono( input );

    analyserNode = audioContext.createAnalyser();
    analyserNode.fftSize = 2048;
    inputPoint.connect( analyserNode );

    analyserNode1 = audioContext.createAnalyser();
    analyserNode1.fftSize = 2048;
    inputPoint.connect( analyserNode1 );

    audioRecorder = new Recorder( inputPoint );

    zeroGain = audioContext.createGain();
    zeroGain.gain.value = 0.0;
    inputPoint.connect( zeroGain );
    zeroGain.connect( audioContext.destination );
    updateAnalysers();
    updateAnalysers1();
}

function initAudio() {
        if (!navigator.getUserMedia)
            navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        if (!navigator.cancelAnimationFrame)
            navigator.cancelAnimationFrame = navigator.webkitCancelAnimationFrame || navigator.mozCancelAnimationFrame;
        if (!navigator.requestAnimationFrame)
            navigator.requestAnimationFrame = navigator.webkitRequestAnimationFrame || navigator.mozRequestAnimationFrame;

    navigator.getUserMedia(
        {
            "audio": {
                "mandatory": {
                    "googEchoCancellation": "false",
                    "googAutoGainControl": "false",
                    "googNoiseSuppression": "false",
                    "googHighpassFilter": "false"
                },
                "optional": []
            },
        }, gotStream, function(e) {
            alert('Error getting audio');
            console.log(e);
        });
}
//$("#record").click(toggleRecording(window));
window.addEventListener('load', initAudio );
