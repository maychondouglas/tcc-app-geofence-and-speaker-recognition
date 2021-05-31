/*
  Descrição: Classe de Banco de Dados
  Autor: Maychon Douglas // @maychondouglas
  Data: 2021/1
*/

export default class DataBase {

  constructor(data){
    firebase.initializeApp(data);
    this.database = firebase.database();
  }

  async send(where, what){
    return await this.database.ref(where).set(what, err => {
      if(err){
        return err;
      }else{
        return true;
      }
    });
  }

  async receive(where, who){

    return await this.database.ref(where).child(who).get().then( result =>  {
      if (result.exists()) {
        return result.val();
      }
      else {
        console.log("No data available");
        return false;
      }
    }).catch(err => {
      console.error(err);
    });
  }
}

