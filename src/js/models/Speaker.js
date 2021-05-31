/*
  Descrição: Classe de Modelo de Locutor
  Autor: Maychon Douglas // @maychondouglas
  Data: 2021/1
*/

import VerificationProfile from './VerificationProfile';
import Profile from './Profile';

  
let  recorder;
let audio_context;
let id = "";


const key = "8e962cfc24a445dbbed5cd6b9f922df1";

var profileIds = [];

(function () {
	//Verifica qual método de gravação de mídia está disponível no navegador
	navigator.getUserMedia = ( navigator.getUserMedia ||
							navigator.webkitGetUserMedia ||
							navigator.mozGetUserMedia ||
							navigator.msGetUserMedia);

})();

//url base da API dos Serviços de Cognição da Azure, dentre eles o de Reconhecimento de Locutor
const baseApi = "https://westus2.api.cognitive.microsoft.com/";

//Endpoint de criação ID de Identificação do Locutor
const createIdentificationProfileEndpoint = `${baseApi}/speaker/identification/v2.0/text-independent/profiles`;

//Endpoint de cadastro do usuário com ID de Identificação do Locutor já criado.
const enrollIdentificationProfileEndpoint = (profileId) => { return `${baseApi}/speaker/identification/v2.0/text-independent/profiles/${profileId}/enrollments?ignoreMinLength=true`;
};


//Endpoints
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

  //cria o perfil de usuário na API de Reconhecimento de Locutor
  createProfile(blob){
    
    //retorna uma Promisse contendo o ID do Perfil de Identificação do Locutor
    return new Promise((resolve, reject) => {
        
      let request = new XMLHttpRequest();
      request.open("POST", createIdentificationProfileEndpoint, true);
    
      request.setRequestHeader('Content-Type','application/json');
      request.setRequestHeader('Ocp-Apim-Subscription-Key', key);
    
      request.onload = function () {
        
        let json = JSON.parse(request.responseText);
        console.log(json);
        
        let profileId = json.profileId;
    
        //resolve a promisse retornando o ID do Perfil de Identificação do Locutor
        resolve(profileId);
      };
    
      request.send(JSON.stringify({ 'locale' :'en-us'}));
    });
  }

  
  //cadastra o novo ID de Locutor gerado
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

  //Começa a ouvir para identificar o usuário
  startListeningForIdentification(idUser, blob){

    id = idUser;
    console.log('Estou ouvindo...fale alguma coisa por 10 segundos...');
    
    return this.checkAudio(blob);
  }

}