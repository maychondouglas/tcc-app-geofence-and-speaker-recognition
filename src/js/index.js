/*
  Descrição: Camada de Controle da Aplicação
  Autor: Maychon Douglas // @maychondouglas
  Data: 2021/1
*/

/*      IMPORTAÇÕES     */
/*      IMPORTAÇÕES     */
/*      IMPORTAÇÕES     */

//Importar Models
import Maps from './models/Maps';
import Login from './models/Login';
import Modal from './models/Modal';
import Button from './models/Button';
import Fence from './models/Fence';
import DataBase from './models/Repository/DataBase';
import FenceRepository from './models/Repository/FenceRepository';
import Speaker from './models/Speaker';
import UserRepository from './models/Repository/UserRepository';
import LockedRepository from './models/Repository/LockedRepository';
import Loading from './models/Loading';
import SpeakerRepository from './models/Repository/SpeakerRepository';
import User from './models/User';

//Importar as VIEWS
import * as MapsView from './views/mapsView';
import * as LoginView from './views/loginView';
import * as ModalView from './views/modalView';
import * as LoadingView from './views/loadingView';
import * as ButtonView from './views/buttonView';

//Importar alguns Elementos do DOM
import { elements } from './views/base';

//Importar arquivo de SASS
import '../scss/main.scss';


/*      DEFININDO OBJETO DE ESTADOS QUE SERÁ ACESSADO POR QUALQUER FUNÇÃO NESTE SCRIPT     */
/*      DEFININDO OBJETO DE ESTADOS QUE SERÁ ACESSADO POR QUALQUER FUNÇÃO NESTE SCRIPT     */
/*      DEFININDO OBJETO DE ESTADOS QUE SERÁ ACESSADO POR QUALQUER FUNÇÃO NESTE SCRIPT     */

const state = {};
      state.loadings = {};
      state.modals = {};
      state.speaker = {};
      
/*      FUNÇÕES QUE IRAM ATUAR COMO CONTROLADORES DE SUAS MODELS E VIEWS     */
/*      FUNÇÕES QUE IRAM ATUAR COMO CONTROLADORES DE SUAS MODELS E VIEWS     */
/*      FUNÇÕES QUE IRAM ATUAR COMO CONTROLADORES DE SUAS MODELS E VIEWS     */

//Controle de Login
const loginController = loginProperties => {
  try{

    state.login = new Login(loginProperties);

    LoginView.renderLoading(state.login);

  }catch(err){
    console.log(err);
  }
};

//Controle de Modals
const modalController = modalProperties => {
  try{

    let modal_id = JSON.stringify(modalProperties.modalId);

    state.modals[modal_id] = new Modal(modalProperties);

    ModalView.rederTheModal(state.modals[modal_id]);
    
  }catch(error){
    console.log(error)
  }
};

//Controle de Mapas
const mapsController = mapsProperties => {
  try{
    state.maps = new Maps(mapsProperties);

    MapsView.renderTheMap(state.maps);


  }catch(error){
    console.log(error);
  }
};

//Controle de Botões
const buttonController = button => {
  state.buttons = {};

  let button_id = JSON.stringify(button.id);

  state.buttons[button_id] = new Button(button);

  ButtonView.renderButton(state.buttons[button_id]);

};

//Controle do Banco de Dados
const dbController = configs => {
  state.database = new DataBase(configs);
};

//Controle da Cerca
const fenceController = fence => {
  state.fence = new Fence(fence);
};

//Controle do Loading, executado quando algo está em processamento
const loadingController = loading => {
  
  state.loadings[loading.loadingId] = new Loading(loading);

  LoadingView.renderLoading(state.loadings[loading.loadingId]);
  
};

//Controle da verificação da localização do usuário em relacão à Cerca Virtual
const fenceVerificationController = mapsProperties => {

  try{
    
    loadingController({ loadingId: 'awaitingFenceVerification' });

    LoadingView.showLoading('awaitingFenceVerification');

    if(!state.database){
      inicializarDB();
    }

    const fenceRepository = new FenceRepository(state.database);

    if(! state.maps){

      if(!document.querySelector('#map')){
        elements.body.innerHTML = `<div id='map'></div>`;
      }
      
      state.maps = new Maps(mapsProperties);
    }
    
    let request =  fenceRepository.read({username: state.current_username});
    
    
    request.then(cercaCadastrada => {

      console.log(cercaCadastrada);

      MapsView.renderTheMapVerification(state.maps, cercaCadastrada);

      LoadingView.hideLoading('awaitingFenceVerification');

    }).catch(err => {
      console.log(err);
    })

    navigator.geolocation.watchPosition(local => {
      console.log('***PASEI AQUI PARA ALTERAR A LOCALIZAÇÃO***');
      state.maps.setMarkerPosition(local.coords.longitude, local.coords.latitude);
      MapsView.renderTheMapVerification(state.maps, cercaCadastrada);
    });


  }catch(error){
    console.log(error);
  }  

};


/*      FUNÇÕES QUE UTILIZAM OS CONTROLES ACIMA PARA EXECUTAR A APLICAÇÃO     */
/*      FUNÇÕES QUE UTILIZAM OS CONTROLES ACIMA PARA EXECUTAR A APLICAÇÃO     */
/*      FUNÇÕES QUE UTILIZAM OS CONTROLES ACIMA PARA EXECUTAR A APLICAÇÃO     */

//Envia o ID de Locutor gerado para o Banco de Dados (Firebase)
const sendIdToDB = (speaker) => {

  try{

    if(!state.database){
      inicializarDB();
    }
  
    const speakerRepository = new SpeakerRepository(state.database);
  
    return speakerRepository.create(state.username, speaker);


  }catch(err){
    console.log(err);
  }

};

//Cria um BLOB com os segundos informados no parâmetro da função
const createBlob =  (seconds) => {

  navigator.getUserMedia({ 
    audio: true
  }, stream => { 
    onRecorderSuccess(stream, setarAudioBlob, seconds)
  }, onRecorderError);

};

//Inicia a gravação da voz do usuário para um NOVO cadastro
const recordToSubscribe = () => {
  console.log('Gravação para Cadastro de Novo Locutor Iniciada...');

  const speaker = new Speaker();

  LoginView.renderAudioRecordingToSubscribe();
  createBlob(15);
  

  setTimeout(() => {
    const resultado = speaker.createProfile(state.audioBlob);

    resultado.then(res1 => {

      //irá devolver o ID do novo Locutor, esse ID será enviado para o cadastro do usuário no Firebase
      LoadingView.showLoading('initialLoading');
      
      console.log(state.audioBlob);

      //Chama o método que irá inscrever o locutor na API de reconhecimento de Locutor
      speaker.enrollProfileAudio(state.audioBlob, res1).then(res2 => {
        console.log();

        speaker.id = res2;

        //Cadastrar o ID de Locutor do usuário 
        
        //Oculta o Loading
        LoadingView.hideLoading('initialLoading');

        sendIdToDB(speaker).then(res3 => {
          LoginView.deleteLoginView();
          //redicionar para cadastro de cerca
          iniciarMapa();
        });
        
      }).catch(err => {
        console.log(err);

      })
    }).catch(err => {
      console.log(err);
    })
  }, 15000)

};

//Inicia a gravação para reconhecimento do locutor JÁ CADASTRADO
const startRecordToRecognition = () => {
 
  console.log('Gravação para Reconhecimento do Locutor (já cadastrado) Iniciada...');


  const speaker = new Speaker();

  createBlob(10);

  
  if(!state.database){
    inicializarDB();
  }

  let result = callIdentifier(speaker);

  state.lockedRepository = new LockedRepository(state.database);

  result.then(res => {
    let jsonResult = JSON.parse(res);
    console.log(jsonResult);

    if(jsonResult.identifiedProfile.score > 0.5){

      console.log('FOI IDENTIFICADO! VOCÊ É MESMO QUEM DIZ SER, VAMOS CARREGAR O MAPA');

      const userRepository = new UserRepository(state.database);

      userRepository.read({username: state.current_username}).then(res => {
        state.current_user= {};
        state.current_user = res.name;
        console.log(state.current_user);
  
        //Informa que o usuário FOI RECONHECIDO
        LoginView.renderAudioRecordCompleted(state.current_username,true);
  
  
        //Passando as informações para rendereizar o Mapa da 
        //Localização Atual e verificar se está dentro da Cerca
  
        console.log('AQUI ESTOU COMEÇANDO A RENDERIZAR O MAPA');

        setTimeout(() => {
          navigator.geolocation.watchPosition(local => {
          
            console.log('Consegui obter a localização: Latitude: ' + local.coords.latitude + ' Longitude:' + local.coords.longitude);

            if(!document.querySelector('#acionamento-tranca')){
              
              //Cria um button para Acionar a tranca
              buttonController({id: 'acionamento-tranca', value: 'ABRIR TRANCA', parent: 'body', classList: 'btn btn-acionar-tranca', disabled: true, position: 'beforeend'});
            }

            //Renderiza o mapa e localização atual do usuário em relação a cerca virtual
            fenceVerificationController({
              longitude: local.coords.longitude, 
              latitude: local.coords.latitude, 
              idElementMap: 'map',

              //Elemento HTML5 que irá marcar a posição do usuário no mapa
              markerOptions: {
                htmlContent: '<div><div class="pin bounce"></div><div class="pulse"></div></div>',
                color: 'DodgerBlue',
                text: 'o',
                position: [local.coords.longitude, local.coords.latitude]
              },

              //Popup acima do ícone que mostra a localização do usuário no mapa
              popupMarkerOptions: {
                
                htmlContent: "",
                pixelOffset: [0, -30]
              },

              //Propriedades do Mapa
              properties: {
                center: [local.coords.longitude, local.coords.latitude],
                zoom: 15,
                view: "Auto",
                authOptions: {
                  authType: 'subscriptionKey',
                  subscriptionKey: 'JEs_jF8YIe3SEQDDCY_9o4TAcclusprjHC8b0VBtvOw',
                  clientId: 'e9fb7e5f-71e4-400c-8e56-5f6d07d50184',
                  getToken: function (resolve, reject, map) {
                      var tokenServiceUrl = "https://azuremapscodesamples.azurewebsites.net/Common/TokenService.ashx";
                      fetch(tokenServiceUrl).then(r => r.text()).then(token => resolve(token));
                  }
                }
            }})
          });
        }, 10);


      });
     

    }else{

      //Informa que o usuário NÃO FOI RECONHECIDO
      LoginView.renderAudioRecordCompleted(state.current_username,false);
    }
  }).catch(err => {
    console.log(err);
  })

  LoginView.renderAudioRecording();

};

//Chama o método que irá verificar se a voz gravada é mesmo do username informado
const callIdentifier = async (speaker) => {

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      speaker.startListeningForIdentification(state.speaker.id, state.audioBlob).then(res => {
        if(res){
          resolve(res);
        }
      }).catch(err => {
        reject(err);
      })
    }, 12000);
  })
};

//Guarda o BLOB no state, para ser acessível globalmente
const setarAudioBlob = blob => {
  //console.log(blob);
  state.audioBlob = blob;
};

//Parar a gravação de voz do usuário e chamar a callback de sucesso
function StopListening(callback){
  console.log('Parando a gravação...');
  state.recorder && state.recorder.stop();
  state.recorder.exportWAV(blob => {
      callback(blob);
  });
  state.recorder.clear();
};

//Callback de erro, utilizada caso ocorra erro na gravação de voz do usuário
function onRecorderError(e) {
  console.error('media error', e);
};

//Callback e sucesso, utilizada caso consiga fazer a gravação da voz do usuário corretamente
function onRecorderSuccess(stream, callback, secondsOfAudio) {

  
  //Criação do contexto de áudio, para captura de voz do usuário
  let audio_context = audio_context || new window.AudioContext;
  var input = audio_context.createMediaStreamSource(stream);
  
  //criação de um objeto de áudio que pode ser reproduzido e manipulado
  state.recorder = new Recorder(input);
  state.recorder.record();
  

  //Aguarda os segundos (passados na variável secondOfAudio)
  //para encerrar a transmissão do áudio
  setTimeout(() => { 
    StopListening(callback); 
  }, secondsOfAudio*1000);
};



/*      ASSISTE OS EVENTOS DE CLIQUE NO BODY E EXECUTA AÇÃO CONFORME O ELEMENTO CLICADO     */
/*      ASSISTE OS EVENTOS DE CLIQUE NO BODY E EXECUTA AÇÃO CONFORME O ELEMENTO CLICADO     */
/*      ASSISTE OS EVENTOS DE CLIQUE NO BODY E EXECUTA AÇÃO CONFORME O ELEMENTO CLICADO     */

elements.body.addEventListener('click', e => {

  if(e.target.matches('#ok-initButton, #ok-initButton *')){

    //Oculta o Modal de Inicialização
    ModalView.hideModal('modalInit');

  } else if(e.target.matches('.close-modal, .close-modal *')){

    //Oculta o Modal de Confirmação de Cadastro de Cerca Virtual
    ModalView.hideModal('modalConfirmSubscribeFence');

  } else if(e.target.matches('#confirm-fence-subscribe, #confirm-fence-subscribe *')){

    //Envia os dados da Cerca Virtual para cadastro no Banco de Dados
    fenceController(state.maps.fence);
    
    const fenceRepository = new FenceRepository(state.database);

    let envio = fenceRepository.create(state.username, state.fence);

    //Mostra o Loading até concluir o envio da cerca ao Bando de Dados
    loadingController({ loadingId: 'awaitingFenceSubscribe' });
    envio.then(deuCerto => {
      console.log(deuCerto);
      setTimeout(() => {
        LoadingView.hideLoading('awaitingFenceSubscribe');
      }, 1000 )
    }).catch(err => {
      console.log(err);
    })

  }else if(e.target.matches('#fence-subscribe, #fence-subscribe *')){

    //Mostra um Modal para confirmação dos dados da cerca virtual que será cadastrada
    ModalView.setMensage({
      id: 'modalConfirmSubscribeFence',
      title: 'Você confirma a criação da cerca abaixo:',
      mensage: `Tipo: <strong>${state.maps.fence.type}</strong>
      <br>Área: <strong>${state.maps.fence.area} km2</strong>
      <br>Perímetro: <strong>${state.maps.fence.perimetro} km</strong>`
    })
    ModalView.showModal('modalConfirmSubscribeFence');

  }else if(e.target.matches('#btn_login, #btn_login *')){

    //Chama a Validação do Usuário (mostra o botão de início da gravação) quando ele digita o username e clica em LOGIN
    e.preventDefault();
    initValidation();

  }else if(e.target.matches('.login-record__verify__icon, .login-record__verify__icon *')){

    //Chama o início de reconhecimento do locutor, após clicar no microfone
    startRecordToRecognition();

  }else if(e.target.matches('#btn_subscribe, #btn_subscribe *')){

    //Mostra formulário de cadastro de novo usuário
    e.preventDefault();

    loadingController({ loadingId: 'initialLoading' });
    

    //obter os dados do formulário de cadastro
    const userData = LoginView.getDataNewUser();
    console.log(userData);

    if(! state.database){
      inicializarDB();
    }

    //verificar se este usuário já existe
    const userRepository = new UserRepository(state.database);

    userRepository.read(userData).then(res => {

      console.log(res);
      if(!res){
        
        userRepository.create(userData).then(res => {
          LoadingView.hideLoading('initialLoading');
          LoginView.renderAudioRecordToSubscribe();
          state.username = userData.username;
        })
      }else{

        //Se usuário já existir, mostra alerta informando
        LoadingView.hideLoading('initialLoading');
        alert('Este usuário já existe. Clique em Sign In e faça Login');
      }
      

    }).catch(err => {
      console.log(err);
    })
    
    

  }else if(e.target.matches('#go-to-sign-up, #go-to-sign-up *')){

    //Mostra formulário de cadastro
    LoginView.renderSignUpData();

  }else if(e.target.matches('.login-record__subscribe__icon, .login-record__subscribe__icon *')){
    
    //Inicia a gravação de voz para cadastro de um NOVO USUÁRIO
    recordToSubscribe();

  }else if(e.target.matches('#acionamento-tranca, #acionamento-tranca *')){
    
    console.log("Usuário Atual: " + state.current_username);

    state.lockedRepository.read({username: state.current_username}).then(locked => {
      console.log('A tranca está: ' + JSON.stringify(locked));
      if(locked){
        state.lockedRepository.set(state.current_username, false).then(res => {
          document.querySelector('#acionamento-tranca').innerHTML = "ABRIR TRANCA";
        });
      }else{
        state.lockedRepository.set(state.current_username, true).then(res => {
          document.querySelector('#acionamento-tranca').innerHTML = "FECHAR TRANCA";
        });
      }
    })
  }
});


/*      FUNÇÕES DE INICIALIZAÇÃO     */
/*      FUNÇÕES DE INICIALIZAÇÃO     */
/*      FUNÇÕES DE INICIALIZAÇÃO     */

//Inicializa o Mapa (Azure)
const iniciarMapa = () => {

  //Verifica se já foi instanciado um objeto DataBase
  if(! state.database){
    inicializarDB();
  }

  //Cria elemento HTML5 que irá renderizar o Mapa
  document.body.innerHTML = `<div id="map"></div>
                              <main>
                              <div class="buttons-controll-fence"></div>
                            </main>`;

  //Cria modal para avisar que é hora do cadastro da cerca virtual                            
  modalController({
    modalId: 'modalInit',
    iconPath: '../images/icons/location.svg',
    title: 'Agora é hora de você criar a sua cerca Virtual!',
    mensage: "",
    hasCloseButton: false,
    classList: ""
  });

  //Cria botão no modal com ação de FECHAR MODAL para o alerta de cadastro de cerca virtual
  buttonController({id: 'ok-initButton', value: 'OK', parent: '.modal-alert', classList: 'btn btn-accept-alert', disabled: false, position: 'beforeend'});
  

  //Faz chamada ao controlador do Mapa para renderizar o cadastro de cerca virtual
  navigator.geolocation.getCurrentPosition(local => {
    mapsController({
      //encaminhas as coordenadas atuais do usuário
      longitude: local.coords.longitude, 
      latitude: local.coords.latitude, 

      //Identificador do Elemento que irá renderizar o Mapa no HTML5
      idElementMap: 'map',

      //Opções do Marcador da Localização atual do usuário
      markerOptions: {
        htmlContent: '<div><div class="pin bounce"></div><div class="pulse"></div></div>',
        color: 'DodgerBlue',
        text: 'o',
        position: [local.coords.longitude, local.coords.latitude]
      },

      //Opções da mensagem que aparece no Popup
      popupMarkerOptions: {
        htmlContent: "",
        pixelOffset: [0, -30]
      },

      //Propriedades da visualização do Mapa
      properties: {
        center: [local.coords.longitude, local.coords.latitude],
        zoom: 15,
        view: "Auto",
        authOptions: {
          authType: 'subscriptionKey',
          subscriptionKey: 'JEs_jF8YIe3SEQDDCY_9o4TAcclusprjHC8b0VBtvOw',
          clientId: 'e9fb7e5f-71e4-400c-8e56-5f6d07d50184',
          getToken: function (resolve, reject, map) {
              var tokenServiceUrl = "https://azuremapscodesamples.azurewebsites.net/Common/TokenService.ashx";
              fetch(tokenServiceUrl).then(r => r.text()).then(token => resolve(token));
          }
        }
    }});

  });

  //Cria um botão com ação de cadastro de cerca virtual
  buttonController({
    id: 'fence-subscribe', 
    value: 'cadastrar cerca', 
    parent: '.buttons-controll-fence', 
    classList: 'btn btn-primary', 
    disabled: true, 
    position: 'afterbegin'
  });

  //Cria um modal para o usuário confirmar o cadastro da cerca virtual
  modalController({
    modalId: 'modalConfirmSubscribeFence',
    iconPath: '../images/icons/select.svg',
    title: `Você confirma a criação da cerca abaixo:`,
    mensage: '',
    hasCloseButton: true,
    classList: 'hidden',
  });

  //Cria um botão no modal com ação de confirmação da cerca virtual
  buttonController({
    id: 'confirm-fence-subscribe', 
    value: 'Confirmar', 
    parent: '#modalConfirmSubscribeFence>.modal-alert', 
    classList: 'btn btn-primary', 
    disabled: false, 
    position: 'beforeend'
  });

};

//Inicializa o Banco de Dados (Firebase)
const inicializarDB = () => {

  dbController({
    apiKey: "AIzaSyD7BorZwXPshl0hoF_vU9TMwp2fh3v2DbM",
    authDomain: "tcc-2-1e9c6.firebaseapp.com",
    projectId: "tcc-2-1e9c6",
    storageBucket: "tcc-2-1e9c6.appspot.com",
    messagingSenderId: "394765204468",
    appId: "1:394765204468:web:5f6e77d6f878166bdc17a1"
  });

};

//Inicializa o reconhecimento do Locutor (Azure)
const initSpeakerRecognition = (speakerId) => {

  /*Aqui será disponibilizado o botão para o usuário 
  clicar e iniciar a gravação para o Reconhecimento do Locutor*/

  LoginView.renderAudioRecord();
  state.speaker.id = speakerId;
};

//Inicializa a Validação do Usuário 
const initValidation = () => {

  const speakerRepository = new SpeakerRepository(state.database);

  state.current_username = document.querySelector('#username-login').value;
  console.log(state.current_username);
  
  let speakerId = speakerRepository.read({username: state.current_username});

  speakerId.then(encontrado => {
    console.log(encontrado.id);
    if(encontrado){
      initSpeakerRecognition(encontrado.id)
    }else{
      alert('Usuário não Encontrado');
    }
  }, naoEncontrado => {
    console.log(naoEncontrado);
  });

};

//Inicializa a Aplicação
const inicializarApp = () => {

  inicializarDB();

  loginController({fields: "algunsFields"});
};

//Aguarda a página ser iniciada e chama o Início da Aplicação
window.onload = inicializarApp;