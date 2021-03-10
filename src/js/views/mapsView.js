import { elements } from './base.js';


export const renderTheMap = maps => {
    
    maps.buildToolbar();

    maps.builderMarker();

}

  /*
getDrawnShapes() {
  var source = drawingManager.getSource();
  
  document.getElementById('CodeOutput').value = JSON.stringify(source.toJson(), null, '    ');
}*/