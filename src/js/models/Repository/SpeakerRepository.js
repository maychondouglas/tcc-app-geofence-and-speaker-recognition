export default class SpeakerRepository {
  constructor(database){
    this.database = database;
  }

  create(user, speaker){

    return new Promise((resolve, reject) => {
      let result = this.database.send(`usuarios/${user}/speaker/`, {
        id: (speaker.id)?speaker.id:""
      });

      if(result){
        resolve('ok');
      }else{
        reject('err');
      }
    });
  }

  read(user){
    return new Promise((resolve, reject) => {

      let result = this.database.recev(`usuarios/${user.username}`, 'speaker');

      if(result){
        resolve(result);
      }else{
        reject('err');
      }

    });
  }
};