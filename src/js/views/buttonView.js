import {elements} from './base.js';

export const renderButton = button => {

  const markup = `<button ${(button.disabled)?'disabled':''} class='${button.classList}' id=${button.id}>${button.value}</button>`;

  document.querySelector(button.parent).insertAdjacentHTML('afterbegin', markup);
}