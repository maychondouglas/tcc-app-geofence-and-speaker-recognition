import Maps from './models/Maps';
import * as MapsView from './views/mapsView';

import '../scss/main.scss';


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



const state = {};

/*                      CONTROLADORA DO MODAL                     */
/*                      CONTROLADORA DO MODAL                     */
/*                      CONTROLADORA DO MODAL                     */
/*                      CONTROLADORA DO MODAL                     */
/*                      CONTROLADORA DO MODAL                     */

const modalController = modalProperties => {
  try{

    state.modals = {};

    let modal_id = JSON.stringify(modalProperties.modalId);

    state.modals[modal_id] = new Modal(modalProperties);

    ModalView.rederTheModal(state.modals[modal_id]);
    
  }catch(error){
    console.log(error)
  }
}

/*                      CONTROLADORA DO MAPA                     */
/*                      CONTROLADORA DO MAPA                     */
/*                      CONTROLADORA DO MAPA                     */
/*                      CONTROLADORA DO MAPA                     */
/*                      CONTROLADORA DO MAPA                     */

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

const fenceController = fence => {
  state.fence = new Fence(fence);
}

const loadingController = loading => {
  
  state.loadings = {};

  state.loadings[loading.loadingId] = new Loading(loading);

  LoadingView.renderLoading(state.loadings[loading.loadingId]);
  
}

/*                      INICIALIZAÇÃO DAS PROPRIEDADES DO MAPA                     */
/*                      INICIALIZAÇÃO DAS PROPRIEDADES DO MAPA                     */
/*                      INICIALIZAÇÃO DAS PROPRIEDADES DO MAPA                     */
/*                      INICIALIZAÇÃO DAS PROPRIEDADES DO MAPA                     */
/*                      INICIALIZAÇÃO DAS PROPRIEDADES DO MAPA                     */

window.addEventListener('load', ()  =>  {
  /*                      PRIMEIRO MODAL                     */
  /*                      PRIMEIRO MODAL                     */
  /*                      PRIMEIRO MODAL                     */
  /*                      PRIMEIRO MODAL                     */
  /*                      PRIMEIRO MODAL                     */

  dbController({
    apiKey: "AIzaSyD7BorZwXPshl0hoF_vU9TMwp2fh3v2DbM",
    authDomain: "tcc-2-1e9c6.firebaseapp.com",
    projectId: "tcc-2-1e9c6",
    storageBucket: "tcc-2-1e9c6.appspot.com",
    messagingSenderId: "394765204468",
    appId: "1:394765204468:web:5f6e77d6f878166bdc17a1"
  });

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

});

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
  }

});
