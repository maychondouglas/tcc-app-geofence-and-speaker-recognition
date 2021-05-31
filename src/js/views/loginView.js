/*
  Descrição: Login View
  Autor: Maychon Douglas // @maychondouglas
  Data: 2021/1
*/
import { elements } from './base.js';

export const renderLoading = login => {
  const markup = `
    <main class='login__main'>
      <div class='login__main__container'>
        <div class='login-area'>
          <div class=''>
            <h2>Login</h2>
            <form>
              <input type='text' placeholder='username' name='username' required id='username-login' class='field field__username'>
              <input  id='btn_login'  class='btn btn-main' type='submit' value='Sign In'>
            </form>
            <span class='line-or'><p>or</p></span>
            <button id='go-to-sign-up' class='btn btn-tertiary'>Sign Up</button>
          </div>
          
          <div class='sign-up-area hidden'>
            <h2>Sign Up</h2>
            <form>
              <input type='text' placeholder='username' name='username' required id='username-signup' class='field field__username'>
              <input type='text' placeholder='first name' name='firstname' required id='firstname-signup' class='field field__firstname'>
              <input type='text' placeholder='last name' name='lastname' required id='lastname-signup' class='field field__lastname'>
              <input  id='btn_subscribe'  class='btn btn-main' type='submit' value='Subscribe'>
            </form>
            <span class='line-or'><p>or</p></span>
            <button class='btn btn-tertiary'>Sign In</button>
          </div>
          
          <div class='login-record hidden'>
            <div class='login-record__verify'>
              <div class='login-record__verify__icon'>
                <img src='images/icons/mic.svg'>
              </div>
              <p class='record-msg'>Clique no microfone para começar o reconhecimento</p>
            </div>
            <button class='btn btn-return'>Return</button>
          </div>

          <div class='subscribe-record hidden'>
            <div class='login-record__verify'>
              <div id='voice-subscribe-button' class='login-record__subscribe__icon'>
                <img src='images/icons/mic.svg'>
              </div>
              <p class='record-msg'>Clique no microfone para começar o reconhecimento</p>
            </div>
            <button class='btn btn-return'>Return</button>
          </div>
        <div>
      </div>
    </main>
  `;

  elements.body.innerHTML = markup;
}

export const renderAudioRecord = () => {

  const record_section = document.querySelector('.login-record');
  const record__verify__icon = document.querySelector('.login-record__verify__icon');
  const login_area = document.querySelector('.login-area>div');

  record_section.classList.remove('hidden');
  record__verify__icon.querySelector('img').setAttribute('src', 'images/icons/mic.svg');
  //record__verify__icon.classList.add('record-init');
  login_area.classList.add('hidden');
}

export const renderAudioRecording = () => {
  const record_msg = document.querySelector('.record-msg');

  const record__verify__icon = document.querySelector('.login-record__verify__icon');

  record_msg.innerHTML = `Fale alguma frase legal ou desabafe por 10 segundos`;
  record__verify__icon.querySelector('img').setAttribute('src', 'images/icons/waves.svg');
  record__verify__icon.classList.add('record-init');
}

export const renderAudioRecordCompleted = (firstName, accessResult) => {

  if(accessResult){
    const record_msg = document.querySelector('.record-msg');
    const record__verify__icon = document.querySelector('.login-record__verify__icon');
  
    record_msg.innerHTML = `Pronto! Você é o ${firstName} mesmo ;)`;
    record__verify__icon.querySelector('img').setAttribute('src', 'images/icons/check.svg');
    record__verify__icon.classList.add('record-authorized');
  }else{
    const record_msg = document.querySelector('.record-msg');
    const record__verify__icon = document.querySelector('.login-record__verify__icon');
  
    record_msg.innerHTML = `Não conseguimos validar. É você mesmo? Tente novamente... ;)`;
    record__verify__icon.querySelector('img').setAttribute('src', 'images/icons/close.svg');
    record__verify__icon.classList.add('record-denied');
  }

}

export const renderSignUpData = () => {
  const record__verify__icon = document.querySelector('.login-record__verify__icon');
  record__verify__icon.classList.remove('record-denied');
  const login_area = document.querySelector('.login-area>div');
  const sign_up_area = document.querySelector('.sign-up-area');
  login_area.classList.add('hidden');
  sign_up_area.classList.remove('hidden');
}

export const getDataNewUser = () => {
  return {
    username: document.getElementById('username-signup').value,
    firstName: document.getElementById('firstname-signup').value,
    lastName: document.getElementById('lastname-signup').value
  };
}

export const renderAudioRecordToSubscribe = () => {

  const signup_area = document.querySelector('.sign-up-area');
  const signup_voice_record_area = document.querySelector('.subscribe-record');

  signup_area.classList.add('hidden');
  signup_voice_record_area.classList.remove('hidden');
}

export const renderAudioRecordingToSubscribe = () => {
  const record_msg = document.querySelector('.record-msg');

  const record__subscribe__icon = document.querySelector('.login-record__subscribe__icon');

  record_msg.innerHTML = `Fale alguma frase legal ou desabafe por 15 segundos`;
  record__subscribe__icon.querySelector('img').setAttribute('src', 'images/icons/waves.svg');
  record__subscribe__icon.classList.add('record-init');
}

export const deleteLoginView = () => {
  elements.body.innerHTML = '';
}