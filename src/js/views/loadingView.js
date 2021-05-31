
/*
  Descrição: Loading View
  Autor: Maychon Douglas // @maychondouglas
  Data: 2021/1
*/

import { elements } from "./base";

export const renderLoading = loading => {
    
  const markup = `<div id='${loading.loadingId}' class="loading-parent">
                    <div class="loading-children">
                      <div></div>
                      <div></div>
                    </div>
                  </div>`;

  elements.body.insertAdjacentHTML('afterend', markup);                  
}

export const hideLoading = loadingId => {
  document.getElementById(loadingId).classList.add('hidden');
}

export const showLoading = loadingId => {
  document.getElementById(loadingId).classList.remove('hidden');
}