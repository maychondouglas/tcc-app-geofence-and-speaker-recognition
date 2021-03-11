export default class DataBase {

  constructor(data){
    firebase.initializeApp(data);
    this.database = firebase.database;
  }
  
}