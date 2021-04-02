import Fence from "../Fence";

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
  async read(user){
    return new Promise((resolve, reject) => {

      let result = this.database.recev(`usuarios/${user.username}`, 'fence');

      if(result){

        result.then(res => {
          let myFence = new Fence({
            type: res.type, 
            perimeter: res.perimetro, 
            area: res.area, 
            coordinates: res.coordenadas,
            radius: res.radius
          });

          resolve(myFence);
        })
        

      }else{
        reject('err');
      }

    });
  }

}