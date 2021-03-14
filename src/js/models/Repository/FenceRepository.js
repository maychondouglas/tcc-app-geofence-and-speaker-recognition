
export default class FenceRepository {

  constructor(database){
    this.database = database;
  }

  async create(usuario, fence){
    
    return new Promise((resolve, reject) => {
      let result = this.database.send(`usuarios/${usuario}/fence/`, {

        type: (fence.type)?fence.type:"",
        coordenadas: (fence.coordinates)?fence.coordinates:"",
        area: (fence.area)?fence.area:"",
        perimetro: (fence.perimeter)?fence.perimeter:"",
        radius: fence.radius?fence.radius:"" 
      });

      console.log(result)

      if(result){
        resolve('ok');
      }else{
        reject('err');
      }
    }); 
  }
}