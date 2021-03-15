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

    this.map.events.add('click', this.marker, () => {
      this.marker.togglePopup();
    });

    this.map.markers.add(this.marker);

    this.fenceSubscribeButton = document.querySelector('#fence-subscribe');

  }

  buildToolbar(){
    this.map.events.add('ready', () => {
      drawingManager = new atlasDraw.drawing.DrawingManager(this.map, {
          toolbar: new atlasDraw.control.DrawingToolbar({ 
            position: 'non-fixed', 
            style: 'dark', 
            buttons: ['draw-circle', 'draw-rectangle']  
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
      fence.type = 'circulo';
      fence.radius = atlas.math.convertDistance(shape.getProperties().radius, 'meters', 'kilometers', 2);
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

};



