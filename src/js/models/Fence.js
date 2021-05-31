/*
  Descrição: Classe de Modelo de Cerca
  Autor: Maychon Douglas // @maychondouglas
  Data: 2021/1
*/


import * as atlas from 'azure-maps-control';

export default class Fence{
  constructor(fence){
    this.type = fence.type;
    this.perimeter = fence.perimetro,
    this.area = fence.area,
    this.coordinates = fence.coordinates;
    this.radius = fence.radius;
  }
  /*
    Método responsável por verificar se o usuário está dentro da cerca cadastrada
    Primeiramente calcula-se a distância entre o centro 
    da circunferência da cerca e a localização atual
    depois é comparado a distância obtida com o raio da cerca
    Se esta distância for menor ou igual, o usuário está dentro da cerca
    Se for menor, o usuário está fora da cerca
  */
  onFenceArea({lat, lng}) {

    let distance = atlas.math.getDistanceTo([lng, lat], [this.coordinates[0], this.coordinates[1]], "kilometers");
    console.log('Distancia calculada: ' + distance);
    console.log('Raio Guardado: ' + this.radius);

    return distance <= this.radius;
  }
}
