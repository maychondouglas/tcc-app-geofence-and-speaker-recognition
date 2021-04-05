import Maps from './models/Maps';
import * as MapsView from './views/mapsView';

import '../scss/main.scss';

import Login from './models/Login';
import * as LoginView from './views/loginView';

import Modal from './models/Modal';
import * as ModalView from './views/modalView';

import * as LoadingView from './views/loadingView';


import { elements } from './views/base';

import Button from './models/Button';
import * as ButtonView from './views/buttonView';
import Fence from './models/Fence';
import DataBase from './models/Repository/DataBase';
import FenceRepository from './models/Repository/FenceRepository';
import Loading from './models/Loading';
import SpeakerRepository from './models/Repository/SpeakerRepository';
import User from './models/User';
import Speaker from './models/Speaker';
import UserRepository from './models/Repository/UserRepository';



const state = {};

state.loadings = {};
state.modals = {};
state.speaker = {};

const loginController = loginProperties => {
  try{

    state.login = new Login(loginProperties);

    LoginView.renderLoading(state.login);

  }catch(err){
    console.log(err);
  }
}

const modalController = modalProperties => {
  try{

    let modal_id = JSON.stringify(modalProperties.modalId);

    state.modals[modal_id] = new Modal(modalProperties);

    ModalView.rederTheModal(state.modals[modal_id]);
    
  }catch(error){
    console.log(error)
  }
}

const mapsController = mapsProperties => {
  try{
    state.maps = new Maps(mapsProperties);

    MapsView.renderTheMap(state.maps);


  }catch(error){
    console.log(error);
  }
}

const buttonController = button => {
  state.buttons = {};

  let button_id = JSON.stringify(button.id);

  state.buttons[button_id] = new Button(button);

  ButtonView.renderButton(state.buttons[button_id]);

}

const dbController = configs => {
  state.database = new DataBase(configs);
}

const inicializarDB = () => {
  dbController({
    apiKey: "AIzaSyD7BorZwXPshl0hoF_vU9TMwp2fh3v2DbM",
    authDomain: "tcc-2-1e9c6.firebaseapp.com",
    projectId: "tcc-2-1e9c6",
    storageBucket: "tcc-2-1e9c6.appspot.com",
    messagingSenderId: "394765204468",
    appId: "1:394765204468:web:5f6e77d6f878166bdc17a1"
  });
}

const fenceController = fence => {
  state.fence = new Fence(fence);
}

const loadingController = loading => {
  
  state.loadings[loading.loadingId] = new Loading(loading);

  LoadingView.renderLoading(state.loadings[loading.loadingId]);
  
}

const fenceVerificationController = mapsProperties => {

  try{
    
    loadingController({ loadingId: 'awaitingFenceVerification' });

    LoadingView.showLoading('awaitingFenceVerification');

    if(!state.database){
      inicializarDB();
    }

    const fenceRepository = new FenceRepository(state.database);

    if(! state.maps){

      if(!document.querySelector('#map')){
        elements.body.innerHTML = `<div id='map'></div>`;
      }
      
      state.maps = new Maps(mapsProperties);
    }
    
    let request =  fenceRepository.read({username: 'maychondouglas'});
    
    request.then(cercaCadastrada => {

      console.log(cercaCadastrada);

      MapsView.renderTheMapVerification(state.maps, cercaCadastrada);
      
      LoadingView.hideLoading('awaitingFenceVerification');

    }).catch(err => {
      console.log(err);
    })

    


  }catch(error){
    console.log(error);
  }  

}

const inicializarApp = () => {

  inicializarDB();


  loginController({fields: "algunsFields"});
}



const iniciarMapa = () => {


  /*                      PRIMEIRO MODAL                     */
  /*                      PRIMEIRO MODAL                     */
  /*                      PRIMEIRO MODAL                     */
  /*                      PRIMEIRO MODAL                     */
  /*                      PRIMEIRO MODAL                     */

  inicializarDB();

  modalController({
    modalId: 'modalInit',
    iconPath: '../images/icons/location.svg',
    title: 'Agora é hora de você criar a sua cerca Virtual!',
    mensage: "",
    hasCloseButton: false,
    classList: ""
  });

  buttonController({id: 'ok-initButton', value: 'OK', parent: '.modal-alert', classList: 'btn btn-accept-alert', disabled: false, position: 'beforeend'});
  

  /*                      DEFINIÇÕES DO MAPA                     */
  /*                      DEFINIÇÕES DO MAPA                     */
  /*                      DEFINIÇÕES DO MAPA                     */
  /*                      DEFINIÇÕES DO MAPA                     */
  /*                      DEFINIÇÕES DO MAPA                     */

  navigator.geolocation.getCurrentPosition(local => {
    mapsController({
      longitude: local.coords.longitude, 
      latitude: local.coords.latitude, 
      idElementMap: 'map',
      markerOptions: {
        htmlContent: '<div><div class="pin bounce"></div><div class="pulse"></div></div>',
        color: 'DodgerBlue',
        text: 'o',
        position: [local.coords.longitude, local.coords.latitude]
      },
      popupMarkerOptions: {
        
        htmlContent: "",
        pixelOffset: [0, -30]
      },
      properties: {
        center: [local.coords.longitude, local.coords.latitude],
        zoom: 15,
        view: "Auto",
        authOptions: {
          authType: 'subscriptionKey',
          subscriptionKey: 'JEs_jF8YIe3SEQDDCY_9o4TAcclusprjHC8b0VBtvOw',
          clientId: 'e9fb7e5f-71e4-400c-8e56-5f6d07d50184',
          getToken: function (resolve, reject, map) {
              var tokenServiceUrl = "https://azuremapscodesamples.azurewebsites.net/Common/TokenService.ashx";
              fetch(tokenServiceUrl).then(r => r.text()).then(token => resolve(token));
          }
        }
    }})
  });

  buttonController({
    id: 'fence-subscribe', 
    value: 'cadastrar cerca', 
    parent: '.buttons-controll-fence', 
    classList: 'btn btn-primary', 
    disabled: true, 
    position: 'afterbegin'
  });



  /*                      SEGUNDO MODAL - CONFIRMAÇÃO DE CADASTRO DE CERCA                     */
  /*                      SEGUNDO MODAL - CONFIRMAÇÃO DE CADASTRO DE CERCA                     */
  /*                      SEGUNDO MODAL - CONFIRMAÇÃO DE CADASTRO DE CERCA                     */
  /*                      SEGUNDO MODAL - CONFIRMAÇÃO DE CADASTRO DE CERCA                     */
  /*                      SEGUNDO MODAL - CONFIRMAÇÃO DE CADASTRO DE CERCA                     */
  
  modalController({
    modalId: 'modalConfirmSubscribeFence',
    iconPath: '../images/icons/select.svg',
    title: `Você confirma a criação da cerca abaixo:`,
    mensage: '',
    hasCloseButton: true,
    classList: 'hidden',
  });

  buttonController({
    id: 'confirm-fence-subscribe', 
    value: 'Confirmar', 
    parent: '#modalConfirmSubscribeFence>.modal-alert', 
    classList: 'btn btn-primary', 
    disabled: false, 
    position: 'beforeend'
  });

};

/* Verificar Situações de click para não adicionar evento onde o elemento ainda não foi criado */
elements.body.addEventListener('click', e => {

  if(e.target.matches('#ok-initButton, #ok-initButton *')){

    //Hide Init Modal due to clicking the OK button
    ModalView.hideModal('modalInit');

  } else if(e.target.matches('.close-modal, .close-modal *')){

    //Hide Confirm Modal due to clicking the Close button
    ModalView.hideModal('modalConfirmSubscribeFence');

  } else if(e.target.matches('#confirm-fence-subscribe, #confirm-fence-subscribe *')){

    //Subscribe fence on DB Firebase
    fenceController(state.maps.fence);
    
    const fenceRepository = new FenceRepository(state.database);

    let envio = fenceRepository.create('maychondouglas', state.fence);

    //iniciar loading
    loadingController({ loadingId: 'awaitingFenceSubscribe' });
    envio.then(deuCerto => {
      console.log(deuCerto);
      setTimeout(() => {
        LoadingView.hideLoading('awaitingFenceSubscribe');
      }, 1000 )
    }).catch(err => {
      console.log(err);
    })

    //terminar loading 
    

    //Hide Confirm Modal
    //ModalView.hideModal('modalConfirmSubscribeFence');

  }else if(e.target.matches('#fence-subscribe, #fence-subscribe *')){

    ModalView.setMensage({
      id: 'modalConfirmSubscribeFence',
      title: 'Você confirma a criação da cerca abaixo:',
      mensage: `Tipo: <strong>${state.maps.fence.type}</strong>
      <br>Área: <strong>${state.maps.fence.area} km2</strong>
      <br>Perímetro: <strong>${state.maps.fence.perimetro} km</strong>`
    })
    ModalView.showModal('modalConfirmSubscribeFence');
  }else if(e.target.matches('#btn_login, #btn_login *')){

    e.preventDefault();

    initValidation();

  }else if(e.target.matches('.login-record__verify__icon, .login-record__verify__icon *')){

    startRecordToRecognition();

  }else if(e.target.matches('#btn_subscribe, #btn_subscribe *')){


    e.preventDefault();

    loadingController({ loadingId: 'initialLoading' });
    

    //obter os dados do formulário de cadastro
    const userData = LoginView.getDataNewUser();
    console.log(userData);

    //verificar se este usuário já existe
    if(! state.database){
      inicializarDB();
    }
    const userRepository = new UserRepository(state.database);

    userRepository.read(userData).then(res => {

      console.log(res);
      if(!res){
        
        userRepository.create(userData).then(res => {
          LoadingView.hideLoading('initialLoading');
          LoginView.renderAudioRecordToSubscribe();
        })
      }else{
        LoadingView.hideLoading('initialLoading');
        alert('Este usuário já existe. Clique em Sign In e faça Login');
      }
      

    }).catch(err => {
      console.log(err);
    })
    
    

  }else if(e.target.matches('#go-to-sign-up, #go-to-sign-up *')){

    LoginView.renderSignUpData();

  }else if(e.target.matches('.login-record__subscribe__icon, .login-record__subscribe__icon *')){
    startRecordToSubscribe();
  }

});

const initValidation = () => {

  const speakerRepository = new SpeakerRepository(state.database);

  let username = document.querySelector('#username-login').value;
  console.log(username);
  
  let speakerId = speakerRepository.read({username: username});

  speakerId.then(encontrado => {
    console.log(encontrado.id);
    if(encontrado){
      initSpeakerRecognition(encontrado.id)
    }else{
      alert('Usuário não Encontrado');
    }
  }, naoEncontrado => {
    console.log(naoEncontrado);
  });

}

const initSpeakerRecognition = (speakerId) => {

  /*Aqui será disponibilizado o botão para o usuário 
  clicar e iniciar a gravação para o Reconhecimento do Locutor*/

  LoginView.renderAudioRecord();
  state.speaker.id = speakerId;
}

window.onload = inicializarApp;







/*Criando o Áudio( blob ) e guardar no state */ 
const createBlob = (seconds) => {
  navigator.getUserMedia({ 
    audio: true
  }, stream => { 
    onRecorderSuccess(stream, setarAudioBlob, seconds)
  }, onRecorderError);
}


/*Criando o Áudio( blob ) para um novo Usuário*/
const startRecordToSubscribe = () => {
  console.log('Gravação para Cadastro de Novo Locutor Iniciada...');

  const speaker = new Speaker();

  createBlob(15);

  setTimeout(() => {
    const resultado = speaker.createProfile(state.audioBlob);

    resultado.then(res1 => {
      //irá devolver o ID do novo Locutor, esse ID será enviado para o cadastro do usuário no Firebase
      //console.log(res);

      speaker.enrollProfileAudio(state.audioBlob, res1).then(res2 => {
        console.log(res2);

      }).catch(err => {

        console.log(err);

      })
    }).catch(err => {
      console.log(err);
    })
  }, 15000)

}








/*Parte de Gravação de Áudio - Reconhecimento de Usuário Cadastrado*/

const startRecordToRecognition = () => {
  console.log('Gravação para Reconhecimento do Locutor (já cadastrado) Iniciada...');


  const speaker = new Speaker();

  createBlob(10);

  let result = callIdentifier(speaker);

  result.then(res => {
    let jsonResult = JSON.parse(res);
    console.log(jsonResult);

    if(jsonResult.identifiedProfile.score > 0.5){
      LoginView.renderAudioRecordCompleted('Maychon',true);


      /*Passando as informações para rendereizar o Mapa da 
      Localização Atual e verificar se está dentro da Cerca*/

      navigator.geolocation.watchPosition(local => {
        fenceVerificationController({
          longitude: local.coords.longitude, 
          latitude: local.coords.latitude, 
          idElementMap: 'map',
          markerOptions: {
            htmlContent: '<div><div class="pin bounce"></div><div class="pulse"></div></div>',
            color: 'DodgerBlue',
            text: 'o',
            position: [local.coords.longitude, local.coords.latitude]
          },
          popupMarkerOptions: {
            
            htmlContent: "",
            pixelOffset: [0, -30]
          },
          properties: {
            center: [local.coords.longitude, local.coords.latitude],
            zoom: 15,
            view: "Auto",
            authOptions: {
              authType: 'subscriptionKey',
              subscriptionKey: 'JEs_jF8YIe3SEQDDCY_9o4TAcclusprjHC8b0VBtvOw',
              clientId: 'e9fb7e5f-71e4-400c-8e56-5f6d07d50184',
              getToken: function (resolve, reject, map) {
                  var tokenServiceUrl = "https://azuremapscodesamples.azurewebsites.net/Common/TokenService.ashx";
                  fetch(tokenServiceUrl).then(r => r.text()).then(token => resolve(token));
              }
            }
        }})
      });

    }else{
      LoginView.renderAudioRecordCompleted('Maychon',false);
    }
  }).catch(err => {
    console.log(err);
  })

  LoginView.renderAudioRecording();

}

const callIdentifier = async (speaker) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      speaker.startListeningForIdentification(state.speaker.id, state.audioBlob).then(res => {
        if(res){
          resolve(res);
        }
      }).catch(err => {
        reject(err);
      })
    }, 12000);
  })
}

const setarAudioBlob = blob => {
  state.audioBlob = blob;
}

function StopListening(callback){
  console.log('...working...');
    state.recorder && state.recorder.stop();
    state.recorder.exportWAV(blob => {
        callback(blob);
    });
    state.recorder.clear();
}

function onRecorderError(e) {
  console.error('media error', e);
}

function onRecorderSuccess(stream, callback, secondsOfAudio) {
  let audio_context = audio_context || new window.AudioContext;
  var input = audio_context.createMediaStreamSource(stream);
  state.recorder = new Recorder(input);
  state.recorder.record();
  
  setTimeout(() => { 
    StopListening(callback); 
  }, secondsOfAudio*1000);
}