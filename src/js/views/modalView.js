/*
  Descrição: Modal View
  Autor: Maychon Douglas // @maychondouglas
  Data: 2021/1
*/
import { elements } from './base.js';

export const rederTheModal = (modal) =>  {
  
  const markup = `<div id='${modal.modalId}' class='modal ${modal.classList}'><div class='modal-alert'>
                    ${(modal.hasCloseButton)?`<span class='close-modal'>x</span>`:''}
                    <img src='${modal.iconPath}'>
                    <h4>${modal.title}</h4>
                    <p>${modal.mensage}</p>
                  </div></div>`; 

  document.body.innerHTML += markup;  
}

export const hideModal = modalId => {

  document.getElementById(modalId).classList.add('hidden');
}

export const showModal = modalId => {

  document.getElementById(modalId).classList.remove('hidden');
}

export const setMensage = ({id, title, mensage}) => {

  const modal = document.getElementById(id);
  modal.querySelector('h4').innerHTML = title;
  modal.querySelector('p').innerHTML = mensage;
}