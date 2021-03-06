/*
  Descrição: Classe de Modelo de Mapa
  Autor: Maychon Douglas // @maychondouglas
  Data: 2021/1
*/

import * as atlas from 'azure-maps-control';
import * as atlasDraw from 'azure-maps-drawing-tools';
import Fence from './Fence';

let drawingManager , area, fence = {};

export default class Maps {

  constructor(configs){

    this.mapsConfigs = configs.properties;
    
    this.map = new atlas.Map(configs.idElementMap, this.mapsConfigs);

    this.longitude = configs.longitude;

    this.latitude = configs.latitude;

    this.drawnshape = {};

    this.fence;

    this.markerOptions = configs.markerOptions;

    this.markerOptions.popup =  new atlas.Popup(configs.popupMarkerOptions);

    this.marker = new atlas.HtmlMarker(this.markerOptions);
    //this.map.markers = new atlas.HtmlMarker(this.markerOptions);

    //this.markerManager = new atlas.HtmlMarkerManager;

    this.map.events.add('click', this.marker, () => {
      this.marker.togglePopup();
    });

    

    this.fenceSubscribeButton = document.querySelector('#fence-subscribe');




    //this.map.events.add('ready', () => {
      this.map.markers.add(this.marker);
    //});
  }

  buildToolbar(){
    /*
      Executa a criação da barra de ferramentas de desenho
    */
    this.map.events.add('ready', () => {
      drawingManager = new atlasDraw.drawing.DrawingManager(this.map, {
          toolbar: new atlasDraw.control.DrawingToolbar({ 
            position: 'non-fixed', 
            style: 'dark', 
            buttons: ['draw-circle']  
          })
      });
      

      this.map.events.add('drawingmodechanged', drawingManager, mode => {

        
        if (mode.startsWith('draw')) {
          drawingManager.getSource().clear();
          this.fenceSubscribeButton.disabled = true;
        }
      });

      this.map.events.add('drawingchanging', drawingManager, this.measureShape);

      this.map.events.add('drawingcomplete', drawingManager, ()=> {

        this.fenceSubscribeButton.disabled = false;

        this.fenceSubscribeButton.addEventListener('click', ()=>{
          document.querySelector('#modalConfirmSubscribeFence').classList.remove('hidden');
        })

        drawingManager.setOptions({ mode: 'idle' });

        this.measureShape;

        this.fence = fence;

      });

    });
  }

  measureShape(shape) {
        
    
    fence.coordinates = {};
    if (shape.isCircle()) {
      
      fence = {};
      
      let result = JSON.parse(JSON.stringify(drawingManager.getSource().toJson()));

      fence.coordinates = result.features[0]["geometry"]["coordinates"];
      console.log(result);
      
      console.log(fence.coordinates);
      fence.type = 'circle';
      
      ///fence.radius = atlas.math.convertDistance(shape.getProperties().radius, 'meters', 'kilometers', 2);
      fence.radius = atlas.math.convertDistance(shape.getProperties().radius, 'meters', 'kilometers', 5);
      fence.area = Math.round(2 * Math.PI * fence.radius * fence.radius * 100) / 100;
      fence.perimetro = Math.round(2 * Math.PI * fence.radius * 100) / 100;


    } else {

      /*Rectangle*/
      fence = {};
      fence.type = 'retangulo';
      fence.geometry = shape.toJson().geometry;
      //fence.coordinates = fence.geometry;
      fence.coordinates = fence.geometry.coordinates[0];

      console.log(fence.coordinates);

      fence.perimetro = Math.round(atlas.math.getLengthOfPath(fence.geometry.coordinates[0], 'kilometers') * 100) / 100;

      fence.area = atlas.math.getArea(fence.geometry, 'squareKilometre', 2);
    }
  }

  showFenceVerification(fence) {
    this.map.events.add('ready', () => {
      let dataSource = new atlas.source.DataSource();
      this.map.sources.add(dataSource);

      console.log(fence.radius);

      dataSource.add(new atlas.data.Feature(new atlas.data.Point(
        [fence.coordinates[0], fence.coordinates[1]]), {
          subType: fence.type,
          radius: fence.radius*1000
        })
      );

      this.map.layers.add(new atlas.layer.PolygonLayer(dataSource, null, {
        fillColor: 'rgba(0, 200, 200, 0.8)'
      }));

    });
  }

  setMarkerPosition(longitude, latitude){

    console.log('****ALTERANDO A LOCALIZAÇÃO DO USUÁRIO*****');

    this.markerOptions = {
      htmlContent: '<div><div class="pin bounce"></div><div class="pulse"></div></div>',
      color: 'DodgerBlue',
      text: 'o',
      position: [longitude, latitude]
    };

    this.map.markers.clear();
    this.map.markers.add(new atlas.HtmlMarker(this.markerOptions));

  }

};



