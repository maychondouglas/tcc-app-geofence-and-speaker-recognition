import { elements } from './base.js';

export const rederTheModal = (modal) =>  {
  const markup = `<div id='${modal.modalId}' class='modal'><div class='modal-alert'>
                    <img src='${modal.iconPath}'>
                    <h4>${modal.mensage}</h4>
                    <button class='btn btn-accept-alert'>${modal.buttonValue}</button>
                  </div></div>`; 

  document.body.innerHTML += markup;                ;
}

export const hiddenModal = modalId => {

  document.getElementById(modalId).classList.add('hidden');

}