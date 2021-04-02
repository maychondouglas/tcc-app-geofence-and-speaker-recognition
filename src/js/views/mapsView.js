import { elements } from './base.js';


export const renderTheMap = maps => {
    if(!document.querySelector('#map')){
      elements.body.innerHTML = `<div id='map'></div>`;
    }

    maps.buildToolbar();

}


export const renderTheMapVerification = (maps, fence) => {

  /*if(!document.querySelector('#map')){
    elements.body.innerHTML = `<div id='map'></div>`;
  }*/
    
  maps.showFenceVerification(fence);

  navigator.geolocation.getCurrentPosition(local => {

    if(fence.onFenceArea({lng: local.coords.longitude, lat: local.coords.latitude})){
      //está dentro da cerca
      console.log('Está dentro da cerca');
    }else{
      //está fora
      console.log('Está FORA da cerca');
    }

  });

}
