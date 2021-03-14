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
}