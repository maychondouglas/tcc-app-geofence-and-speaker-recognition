
export default class FenceRepository {

  constructor(database){
    this.database = database;
  }

  create(usuario, fence){
    
    this.database.send(`usuarios/${usuario}/fence/`, {

      type: (fence.type)?fence.type:"",
      coordenadas: (fence.coordinates)?fence.ponto:"",
      area: (fence.area)?fence.area:"",
      perimetro: (fence.perimeter)?fence.perimeter:"",
      radius: fence.radius?fence.radius:"" 
    });
    
  }
}