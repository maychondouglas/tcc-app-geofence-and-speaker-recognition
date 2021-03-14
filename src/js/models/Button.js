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