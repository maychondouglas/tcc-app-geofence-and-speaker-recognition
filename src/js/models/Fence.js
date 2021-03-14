export default class Fence{
  constructor(fence){
    this.type = fence.type;
    this.perimeter = fence.perimetro,
    this.area = fence.area,
    this.coordinates = fence.coordinates;

    if(this.type == 'circle'){
      this.radius = fence.radius;
    }
  }
}