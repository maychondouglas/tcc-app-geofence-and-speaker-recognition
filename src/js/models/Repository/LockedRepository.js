/*
  Descrição: Classe de Armazenamento do Estado da Tranca
  Autor: Maychon Douglas // @maychondouglas
  Data: 2021/1
*/
export default class LockedRepository {
  constructor(database){
    this.database = database;
  }

  set(user, locked){

    return new Promise((resolve, reject) => {
      let result = this.database.send(`usuarios/${user}/locked`, locked);

      if(result){
        resolve('ok');
      }else{
        reject('err');
      }
    });
  }

  read(user){
    return new Promise((resolve, reject) => {

      let result = this.database.receive(`usuarios/${user.username}`, 'locked');

      if(result){
        resolve(result);
      }else{
        reject('err');
      }

    });
  }
};