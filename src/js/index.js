import Maps from './models/Maps';
import * as MapsView from './views/mapsView';

import '../scss/main.scss';


import Modal from './models/Modal';
import * as ModalView from './views/modalView';


import { elements } from './views/base';

import Button from './models/Button';
import * as ButtonView from './views/buttonView';



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
  modalController({
    modalId: 'modalInit',
    iconPath: '../images/icons/location.svg',
    mensage: 'Agora é hora de você criar a sua cerca Virtual!',
    hasCloseButton: false,
  });

  buttonController({id: 'ok-initButton', value: 'OK', parent: '.modal-alert', classList: 'btn btn-accept-alert', disabled: false, position: 'beforeend'});
  
  
  document.querySelector('#ok-initButton').addEventListener('click', () => {
    document.querySelector('#modalInit').classList.add('hidden');
  });
  

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

  buttonController({id: 'fence-subscribe', value: 'cadastrar cerca', parent: '.buttons-controll-fence', classList: 'btn btn-primary', disabled: true, position: 'afterbegin'});



  /*                      SEGUNDO MODAL - CONFIRMAÇÃO DE CADASTRO DE CERCA                     */
  /*                      SEGUNDO MODAL - CONFIRMAÇÃO DE CADASTRO DE CERCA                     */
  /*                      SEGUNDO MODAL - CONFIRMAÇÃO DE CADASTRO DE CERCA                     */
  /*                      SEGUNDO MODAL - CONFIRMAÇÃO DE CADASTRO DE CERCA                     */
  /*                      SEGUNDO MODAL - CONFIRMAÇÃO DE CADASTRO DE CERCA                     */
  
  modalController({
    modalId: 'modalConfirmSubscribeFence',
    iconPath: '../images/icons/select.svg',
    mensage: 'teste',
    hasCloseButton: true,
    classList: 'hidden',
  });

  document.querySelector('#fence-subscribe').addEventListener('click', () => {
    document.querySelector('#modalConfirmSubscribeFence').classList.remove('hidden');
  });



  buttonController({id: 'confirm-fence-subscribe', value: 'confirmar', parent: '#modalConfirmSubscribeFence>.modal-alert', classList: 'btn btn-primary', disabled: false, position: 'beforeend'});
})












/*
const mapsController = () => {
  state.maps = new Maps();
  
  try{
    navigator.geolocation.getCurrentPosition(local => {
      state.maps.mapInit(local.coords.longitude, local.coords.latitude);
    });
  }catch(err){
    throw(err);
  }
}*/