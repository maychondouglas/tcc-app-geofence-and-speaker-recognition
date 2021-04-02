export default class Fence{
  constructor(fence){
    this.type = fence.type;
    this.perimeter = fence.perimetro,
    this.area = fence.area,
    this.coordinates = fence.coordinates;
    this.radius = fence.radius;
  }

  onFenceArea({lat, lng}) {

    let deg2rad = (deg) => { 
      return deg * (Math.PI / 180); 
    };

    let  R = 6371;
    let  dLat = deg2rad(lat - this.coordinates[0]);
    let  dLng = deg2rad(lng - this.coordinates[1]);
    let  a = Math.sin(dLat / 2) 
            * Math.sin(dLat / 2) 
            + Math.cos(deg2rad(this.coordinates[0])) 
            * Math.cos(deg2rad(this.coordinates[1])) 
            * Math.sin(dLng / 2) 
            * Math.sin(dLng / 2);
      
    let  c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    //return true or false to distance by fence smaller that radius
  
    return this.radius*1000 <= ((R * c *1000).toFixed());
  }

}