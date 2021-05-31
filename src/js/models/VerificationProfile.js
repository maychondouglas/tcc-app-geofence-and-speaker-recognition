/*
  Descrição: Classe de Modelo de Verificação de Perfil
  Autor: Maychon Douglas // @maychondouglas
  Data: 2021/1
*/

export default class VerificationProfile { 
  constructor (name, profileId) { 
  this.name = name; 
  this.profileId = profileId; 
  this.remainingEnrollments = 3
  }
};