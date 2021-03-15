import { elements } from './base.js';

export const renderLoading = login => {
  const markup = `
    <main class='login__main'>
      <div class='login__main__container'>
        <div class='login-area'>
          <div class=''>
            <h2>Login</h2>
            <form>
              <input type='text' placeholder='username' name='username' id='username' class='field field__username'>
              <input class='btn btn-signin' type='submit' value='Sign In'>
            </form>
            <span class='line-or'><p>or</p></span>
            <button class='btn btn-signup'>Sign Up</button>
          </div>
          <div class='hidden' class='login-record'>
            <div class='login-record__verify'>
              <div class='login-record__verify__icon'>
                <img src='../../images/icons/mic.svg'>
              </div>
              <p>Clique no microfone para iniciar o reconhecimento</p>
            </div>
            
          </div>
        <div>
      </div>
    </main>
  `;

  elements.body.innerHTML = markup;
}