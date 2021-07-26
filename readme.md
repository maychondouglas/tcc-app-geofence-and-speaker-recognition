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

![](https://drive.google.com/uc?export=view&id=/1fA6FjqCZeKfbvPcUNORcDDX_ehUqi-kG)

## Etapas de Autenticação
O diagrama abaixo ilustra as etapas do processo de autenticação:

![](/assets/auth-steps.png)

### Etapa 1
Na primeira etapa a App, depois de obter o username (nome de usuário) que será digitado pelo usuário, irá verificar se existe algum usuário cadastrado com este identificador.

### Etapa 2
Se existir usuário cadastrado com o username informado, a aplicação fará a gravação de voz do usuário por aproximadamente 10 segundos. Esta gravação será encaminhada à API de Reconhecimento de Locutor, juntamente com o ID de Locutor previamente cadastrado, para comparar as características da voz obtida na gravação atual com as características obtidas anteriormente em fase de cadastro. A reposta da API de Reconhecimento de Locutor será um percentual de aproximação que está no intervalo de 0,0 a 100,0. Quanto menor o percentual, menos provável de ser a voz autêntica do usuário.

### Etapa 3
Se o percentual de aproximação da gravação da voz do usuário for maior ou igual a 60,0, a Aplicação irá então solicitar os dados referentes a cerca virtual cadastradas ao banco de dados Firebase.

### Etapa 4
A aplicação vai utilizar a API de Geofencing para mostrar ao usuário sua posição atual juntamente com a cerca virtual cadastrada.

### Etapa 5
Após a validação da voz e de localização do usuário, ele já poderá fazer o acionamento da tranca, que está localizada na sua residência, através de um microcontrolador com acesso ao banco de dados Firebase, que faz a leitura de uma variável (flag) que armazena o estado da tranca.

