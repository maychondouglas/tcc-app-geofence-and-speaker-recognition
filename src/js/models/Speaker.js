import VerificationProfile from './VerificationProfile';
import Profile from './Profile';

  
let  recorder;
let audio_context;
let id = "";


const key = "8e962cfc24a445dbbed5cd6b9f922df1";
const baseApi = "https://westus2.api.cognitive.microsoft.com/";
var profileIds = [];


(function () {
	// Cross browser sound recording using the web audio API
	navigator.getUserMedia = ( navigator.getUserMedia ||
							navigator.webkitGetUserMedia ||
							navigator.mozGetUserMedia ||
							navigator.msGetUserMedia);

})();


const createIdentificationProfileEndpoint = `${baseApi}/speaker/identification/v2.0/text-independent/profiles`;
const enrollIdentificationProfileEndpoint = (profileId) => `${baseApi}/speaker/identification/v2.0/text-independent/profiles/${profileId}/enrollments?ignoreMinLength=true`;
const enrollIdentificationProfileStatusEndpoint = (profileId) => `${baseApi}/speaker/identification/v2.0/text-independent/profiles/${profileId}`;
const identifyProfileEndpoint = (Ids) => `${baseApi}/speaker/identification/v2.0/text-independent/profiles/identifySingleSpeaker?profileIds=${Ids}&ignoreMinLength=true`;


export default class Speaker {
  constructor(){
    this.resultadoDaVerificação = {};
    this.id="";
    this.verificationProfile = new VerificationProfile();
  }

  //-- Speaker Identification methods
  // 1. Start the browser listening, listen for 15 seconds, pass the audio stream to "createProfile"
  enrollNewProfile(){
    navigator.getUserMedia({audio: true}, function(stream){
      console.log('I\'m listening... just start talking for a few seconds...');
      console.log('Maybe read this: \n' + thingsToRead[Math.floor(Math.random() * thingsToRead.length)]);
      onMediaSuccess(stream, createProfile, 15);
    }, onMediaError);
  }

  createProfile(blob){
    //addAudioPlayer(blob);
  
    return new Promise((resolve, reject) => {
        
      let request = new XMLHttpRequest();
      request.open("POST", createIdentificationProfileEndpoint, true);
    
      request.setRequestHeader('Content-Type','application/json');
      request.setRequestHeader('Ocp-Apim-Subscription-Key', key);
    
      request.onload = function () {
        console.log('creating profile');
        let json = JSON.parse(request.responseText);
        console.log(json);
    
        let profileId = json.profileId;
    
      
        resolve(profileId);
      };
    
      request.send(JSON.stringify({ 'locale' :'en-us'}));
    });
  }

  
  // enrollProfileAudio enrolls the recorded audio with the new profile Id, polling the status
  enrollProfileAudio(blob, profileId){

    return new Promise((resolve, reject) => {
      let request = new XMLHttpRequest();
      request.open("POST", enrollIdentificationProfileEndpoint(profileId), true);
      request.setRequestHeader('Ocp-Apim-Subscription-Key', key);
      request.onload = function () {
        console.log('enrolling');
      
      if (request.status==200 || request.status==201) {
        let json = JSON.parse(request.responseText);
        console.log(json);
  
        //const location = enrollIdentificationProfileStatusEndpoint(profileId);
        //resolve(pollForEnrollment(location, profileId));
        resolve(profileId);


      } else {
        console.log(`Failed to submit for enrollment: got a ${request.status} response code.`);
        var json = JSON.parse(request.responseText);
        console.log(`${json.error.code}: ${json.error.message}`);

        reject(`${json.error.code}: ${json.error.message}`);



      }
      };  
      request.send(blob);
    });
  
  }

  //tirei essa parte para ver como vai se comportar
  // Ping the status endpoint to see if the enrollment for identification has completed
  pollForEnrollment(location, profileId){
    var enrolledInterval;

    // hit the endpoint every few seconds 
    enrolledInterval = setInterval(function()
    {
      let request = new XMLHttpRequest();
      request.open("GET", location, true);
      request.setRequestHeader('Ocp-Apim-Subscription-Key', key);
      request.onload = function()
      {
        console.log('getting status');
        var json = JSON.parse(request.responseText);
        console.log(json);

        if (json.enrollmentStatus == 'Enrolled')
        {
          // Woohoo! The audio was enrolled successfully! 

          // stop polling
          clearInterval(enrolledInterval);
          console.log('enrollment complete!');

          // ask for a name to associated with the ID to make the identification nicer
          var name = window.prompt('Who was that talking?');
          profileIds.push(new Profile(name, profileId));
          console.log(profileId + ' is now mapped to ' + name);
        }
        else 
        {
          // keep polling
          console.log('Not done yet..');
        }
      };

      request.send();
    }, 1000);
  }

  checkAudio(blob) {

    return new Promise((resolve, reject) => {

      let request = new XMLHttpRequest();
      request.open("POST", identifyProfileEndpoint(id), true);
      request.setRequestHeader('Ocp-Apim-Subscription-Key', key);
      request.onload = function () {

        if(request.status >= 200 &&  request.status <300){

          this.resultadoDaVerificação = JSON.parse(request.responseText).identifiedProfile;

          resolve(request.responseText);

        }else{
          reject(request.statusText);
        }
        
      };
      
      request.send(blob);

    });
  
  }


  startListeningForIdentification(idUser, blob){

    id = idUser;
    console.log('Estou ouvindo...fale alguma coisa por 10 segundos...');
    
    return this.checkAudio(blob);
  }


























  // 3. Take the audio and send it to the identification endpoint
  identifyProfile(blob){
    addAudioPlayer(blob);

    // comma delimited list of profile IDs we're interested in comparing against
    let Ids = profileIds.map(x => x.profileId).join();
    
    let request = new XMLHttpRequest();
    request.open("POST", identifyProfileEndpoint(Ids), true);
    request.setRequestHeader('Ocp-Apim-Subscription-Key', key);
    request.onload = function () {
      console.log('identifying profile');
      let json = JSON.parse(request.responseText);
      console.log(json);

      if (request.status == 200) {
        let speaker = profileIds.filter(function(p){return p.profileId == json.identifiedProfile.profileId});

        if (speaker != null && speaker.length > 0){
          console.log('I think ' + speaker[0].name + ' was talking');
        } else {
          console.log('I couldn\'t tell who was talking. So embarrassing.');
        }
      } else {
        console.log(`Failed to submit for identification: got a ${request.status} response code.`);
        console.log(`${json.error.code}: ${json.error.message}`);
      }
    };
    
    request.send(blob);
  }





}