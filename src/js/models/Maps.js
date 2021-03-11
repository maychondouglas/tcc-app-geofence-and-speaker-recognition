import * as atlas from 'azure-maps-control';
import * as atlasDraw from 'azure-maps-drawing-tools';

export default class Maps {

  constructor({longitude, latitude, properties, idElementMap}){
    this.longitude = longitude;
    this.latitude = latitude;
    this.mapsConfigs = properties;

    this.markerOptions = {
      htmlContent: '<svg id="Layer_1" enable-background="new 0 0 497 497" height="32" viewBox="0 0 497 497" width="32" xmlns="http://www.w3.org/2000/svg"><g><path d="m248.5 0v497c4.966 0 9.355-2.424 12.085-6.141.021 0 140.047-191.036 140.047-191.036 22.853-31.196 36.368-69.679 36.368-111.323 0-104.106-84.394-188.5-188.5-188.5z" fill="#f0224e"/><path d="m258.662 490.859c.017 0 117.759-191.036 117.759-191.036 19.215-31.196 30.579-69.679 30.579-111.323 0-104.106-70.963-188.5-158.5-188.5-104.106 0-188.5 84.394-188.5 188.5 0 41.644 13.515 80.127 36.383 111.322-.016 0 140.011 191.036 140.011 191.036 2.751 3.718 7.14 6.141 12.106 6.141 4.176.001 7.866-2.423 10.162-6.14z" fill="#ff4c50"/><circle cx="248.5" cy="188.5" fill="#fff" r="128.5"/><path d="m248.5 90v90c24.853 0 45-20.147 45-45s-20.147-45-45-45z" fill="#1b74d6"/><path d="m263.5 135c0-24.853-6.716-45-15-45-24.853 0-45 20.147-45 45s20.147 45 45 45c8.284 0 15-20.147 15-45z" fill="#1e8aff"/><path d="m195.996 210c-16.5 0-30 13.5-30 30v2.316c7.756 11.867 18.005 21.955 30 29.529l30-61.845z" fill="#54a5ff"/><path d="m301.004 210h-30l30 61.845c11.995-7.574 22.244-17.662 30-29.529v-2.316c0-16.5-13.5-30-30-30z" fill="#1b74d6"/><path d="m271.004 210h-45.009c-16.5 0-30 13.5-30 30v31.845c15.199 9.597 33.201 15.155 52.505 15.155s37.306-5.558 52.504-15.155v-31.845c0-16.5-13.5-30-30-30z" fill="#1e8aff"/></g></svg>',
      color: 'DodgerBlue',
      text: 'o',
      position: [this.longitude, this.latitude],
      popup: new atlas.Popup({
          content: '<div style="padding:20px">You current position</div>',
          pixelOffset: [0, -30]
      })
    }

    this.map = new atlas.Map(idElementMap, this.mapsConfigs);

    this.drawingEvents = ['drawingchanged', 'drawingchanging', 'drawingcomplete', 'drawingmodechanged', 'drawingstarted'];

    
  }


  
  builderMarker(){
    //Create an HTML marker and add it to the map.
    var marker = new atlas.HtmlMarker(this.markerOptions);

    this.map.markers.add(marker);

    //Add a click event to toggle the popup.
    this.map.events.add('click', marker, () => {
      marker.togglePopup();
    });
  }

  buildToolbar(){
    this.map.events.add('ready', () => {
      let drawingManager = new atlasDraw.drawing.DrawingManager(this.map, {
          toolbar: new atlasDraw.control.DrawingToolbar({ position: 'non-fixed', style: 'dark', buttons: ['draw-circle', 'draw-rectangle']  })
      });

      /*                ADICIONANDO EVENTOS DO MAPA             */
      /*                ADICIONANDO EVENTOS DO MAPA             */
      /*                ADICIONANDO EVENTOS DO MAPA             */
      /*                ADICIONANDO EVENTOS DO MAPA             */


      this.map.events.add(this.drawingEvents[2], drawingManager, ()=>{
        console.log(this.drawingEvents[2]);
      });

      this.map.events.add(this.drawingEvents[4], drawingManager, ()=>{
        console.log(this.drawingEvents[4]);
        this.drawingComplete();
      });




      
    });
  }

  getDrawnShapes() {
    var source = drawingManager.getSource();
    
    console.log( JSON.stringify(source.toJson(), null, '    ') );
  }

  drawingStarted(){
    //
  }

  drawingComplete(){

    document.querySelector('#fence-subscribe').disabled = false;
    document.querySelector('#change-fence').disabled = false;
    //habilitar cadastro da cerca
    //habilitar apagar desenho
    //bloquear buttosn de formas
  }
};

