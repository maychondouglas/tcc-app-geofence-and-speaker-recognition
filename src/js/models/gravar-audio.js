function onRecorderSuccess(stream, callback, secondsOfAudio) {
  audio_context = audio_context || new window.AudioContext;
  var input = audio_context.createMediaStreamSource(stream);
  recorder = new Recorder(input);
  recorder.record();
  
  setTimeout(() => { 
    StopListening(callback); 
  }, secondsOfAudio*1000);
}
/*
function onRecorderError(e) {
  console.error('media error', e);
}*/

function StopListening(callback){
  console.log('...working...');
    recorder && recorder.stop();
    recorder.exportWAV(function(blob) {
        callback(blob);
    });
    recorder.clear();
}