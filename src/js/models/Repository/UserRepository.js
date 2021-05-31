/*
  Descrição: Classe de Armazenamento do Usuário
  Autor: Maychon Douglas // @maychondouglas
  Data: 2021/1
*/
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

      let result = this.database.receive(`usuarios/`, user.username);

      if(result){
        resolve(result);
      }else{
        reject('err');
      }

    });
  }
};