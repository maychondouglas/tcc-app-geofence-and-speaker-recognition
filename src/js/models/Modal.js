/*
  Descrição: Classe de Modelo de Modal
  Autor: Maychon Douglas // @maychondouglas
  Data: 2021/1
*/


export default class Modal {

  constructor(modal){
    this.modalId = modal.modalId;
    this.iconPath = modal.iconPath;
    this.title = modal.title;
    this.mensage = modal.mensage;
    this.hasCloseButton = modal.hasCloseButton;
    this.classList = modal.classList;
  }  
}