/*
  Descrição: Maps View
  Autor: Maychon Douglas // @maychondouglas
  Data: 2021/1
*/

import { elements } from './base.js';


export const renderTheMap = maps => {
    if(!document.querySelector('#map')){
      elements.body.innerHTML = `<div id='map'></div>`;
    }

    maps.buildToolbar();

}

export const renderTheMapVerification = (maps, fence) => {
    
  maps.showFenceVerification(fence);

  navigator.geolocation.getCurrentPosition(local => {

    if(fence.onFenceArea({lng: local.coords.longitude, lat: local.coords.latitude})){
      //está dentro da cerca
      document.querySelector('#acionamento-tranca').disabled = false;
      console.log('Está dentro da cerca');
    }else{
      //está fora
      document.querySelector('#acionamento-tranca').disabled = true;
      console.log('Está FORA da cerca');
    }
  });

}
