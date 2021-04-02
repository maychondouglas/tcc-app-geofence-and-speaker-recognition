export default class UserRepository {
  constructor(database){
    this.database = database;
  }

  create(user){

    return new Promise((resolve, reject) => {
      let result = this.database.send(`usuarios/${user.username}/dados-pessoais/`, {
        firstName: user.firstName,
        lastName: user.lastName
      });

      if(result){
        resolve(result);
      }else{
        reject('err');
      }
    });
  }

  read(user){
    return new Promise((resolve, reject) => {

      let result = this.database.recev(`usuarios/`, user.username);

      if(result){
        resolve(result);
      }else{
        reject('err');
      }

    });
  }
};