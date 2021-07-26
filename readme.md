# Reconhecimento de Locutor com o Uso de Geofencing
Este projeto foi desenvolvido em meu Trabalho de Conclusão do Curso de Engenharia da Computação. A aplicação utiliza  APIs de [Serviços Cognitivos da Azure](https://azure.microsoft.com/pt-br/services/cognitive-services). Trata-se de uma aplicação web que faz a validação do usuário através de Reconhecimento de Locutor e de Geofencing. 


## Reconhecimento de Locutor
O **Reconhecimento de Locutor** é um método que utiliza-se da biometria de voz para validar se é realmente o mesmo usuário que está falando.

## Geofencing
O **Geofencing** verifica a localização atual do usuário em relação a uma **cerca virtual**. Esta informação pode ser utilizada (como feito neste trabalho) para implementação de aplicações de segurança, a fim de validar se o usuário está dentro do perímetro da cerca virtual previamente cadastrada. Para implementação de Geofencing na aplicação, utilizou-se dos [Serviços de Mapas da Azure](https://azure.microsoft.com/pt-br/services/azure-maps/).

## Microcontrolador
O acionamento de dispositivos (localizados na residência do usuário) pode ser implementado utilizando um microcontrolador conectado a Internet. A comunicação entre a aplicação web e o módulo ESP32 foi estabelecido utilizando o banco de dados [Realtime Firebase](https://firebase.google.com/products/realtime-database?gclid=CjwKCAjwuvmHBhAxEiwAWAYj-CKdnc_oHpVE-l0jnFZvwkYQkT2qH5Ulv53RORnRNONsAbz7KmckbBoCjaEQAvD_BwE&gclsrc=aw.ds).


A Aplicação Web foi desenvolvida em Javascript no formato de PWA (Progressive Web Application), podendo ser instalado em múltiplas plataformas (Android, iOS, Windows etc.)

## Execução
No gif abaixo é mostrado o processo de cadastro e autenticação na aplicação, seguidos do acionamento da tranca, no microcontrolador conectado a Internet (localizado na residência do usuário):

![](./assets/execution.gif)
