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
              <input  id='btn_login'  class='btn btn-signin' type='submit' value='Sign In'>
            </form>
            <span class='line-or'><p>or</p></span>
            <button class='btn btn-signup'>Sign Up</button>
          </div>
          <div class='login-record hidden'>
            <div class='login-record__verify'>
              <div class='login-record__verify__icon'>
                <img src='../../images/icons/mic.svg'>
              </div>
              <p class='record-msg'>Clique no microfone para iniciar o reconhecimento</p>
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
  record__verify__icon.querySelector('img').setAttribute('src', '../../images/icons/mic.svg');
  //record__verify__icon.classList.add('record-init');
  login_area.classList.add('hidden');
}

export const renderAudioRecording = () => {
  const record_msg = document.querySelector('.record-msg');

  const record__verify__icon = document.querySelector('.login-record__verify__icon');

  record_msg.innerHTML = `Fale alguma frase legal ou desabafe por 20 segundos`;
  record__verify__icon.querySelector('img').setAttribute('src', '../../images/icons/waves.svg');
  record__verify__icon.classList.add('record-init');
}

export const renderAudioRecordCompleted = () => {

  const record_msg = document.querySelector('.record-msg');
  const record__verify__icon = document.querySelector('.login-record__verify__icon');

  record_msg.innerHTML = `Pronto! Você é o Maychon Mesmo ;)`;
  record__verify__icon.querySelector('img').setAttribute('src', '../../images/icons/check.svg');
  record__verify__icon.classList.add('record-init');
}

