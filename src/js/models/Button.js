/*
  Descrição: Classe de Modelo de Botões
  Autor: Maychon Douglas // @maychondouglas
  Data: 2021/1
*/

export default class Button {
  constructor(button){
    this.id = button.id;
    this.value = button.value;
    this.parent = button.parent;
    this.classList = button.classList;
    this.disabled = button.disabled;
    this.position = button.position;
  }
}