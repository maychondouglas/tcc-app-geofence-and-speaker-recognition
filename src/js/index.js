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
    state.modal = new Modal(modalProperties);

    ModalView.rederTheModal(state.modal);

    document.getElementById(modalProperties.modalId).querySelector('button').addEventListener('click', ()=>{
      document.getElementById(modalProperties.modalId).classList.add('hidden');
    })

    //hiddenModal();
    
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
  modalController({
    modalId: 'modalInit',
    iconPath: '../images/icons/location.svg',
    mensage: 'Agora é hora de você criar a sua cerca Virtual!',
    buttonValue: 'OK'    
  });
  
  navigator.geolocation.getCurrentPosition(local => {
    mapsController({
      longitude: local.coords.longitude, 
      latitude: local.coords.latitude, 
      idElementMap: 'map',
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

  buttonController({id: 'fence-subscribe', value: 'cadastrar cerca', parent: '.buttons-controll-fence', classList: 'btn btn-primary', disabled: true});
  buttonController({id: 'change-fence', value: 'refazer cerca', parent: '.buttons-controll-fence', classList: 'btn btn-secondary', disabled: true});
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