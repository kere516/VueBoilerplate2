<template>
  <div class="auth-page">
    <div class="auth-container" :class="{ 'show-register': isSignUp }">
      <div class="auth-form login-form" v-show="!isSignUp">
        <h2>Login</h2>

        <div v-if="signInError" class="error-message">
          {{ signInError }}
        </div>

        <form @submit.prevent="handleSignIn">
          <div class="input-group">
            <i class="fa fa-envelope"></i>
            <input
              type="email"
              v-model="signInEmail"
              placeholder="Email"
              required
            />
          </div>

          <div class="input-group">
            <i class="fa fa-lock"></i>
            <input
              :type="showSignInPassword ? 'text' : 'password'"
              v-model="signInPassword"
              placeholder="Senha"
              required
            />
            <i
              :class="showSignInPassword ? 'fa fa-eye-slash' : 'fa fa-eye'"
              class="toggle-password"
              @click="showSignInPassword = !showSignInPassword"
            ></i>
          </div>

          <p class="forgot-password">Esqueceu sua senha?</p>

          <button type="submit" class="btn-submit" :disabled="isLoading">
            {{ isLoading ? 'Entrando...' : 'ENTRAR' }}
          </button>

          <p class="switch-text">
            Não tem conta? <a href="#" @click.prevent="isSignUp = true">Cadastre-se</a>
          </p>
        </form>
      </div>

      <div class="auth-form register-form" v-show="isSignUp">
        <h2>Crie Sua Conta</h2>

        <div v-if="signUpError" class="error-message">
          {{ signUpError }}
        </div>

        <div v-if="signUpSuccess" class="success-message">
          {{ signUpSuccess }}
        </div>

        <form @submit.prevent="handleSignUp">
          <div class="input-group">
            <i class="fa fa-user"></i>
            <input
              type="text"
              v-model="signUpName"
              placeholder="Nome"
              required
            />
          </div>

          <div class="input-group">
            <i class="fa fa-envelope"></i>
            <input
              type="email"
              v-model="signUpEmail"
              placeholder="Email"
              required
            />
          </div>

          <div class="input-group">
            <i class="fa fa-lock"></i>
            <input
              :type="showSignUpPassword ? 'text' : 'password'"
              v-model="signUpPassword"
              placeholder="Senha"
              required
              minlength="6"
            />
            <i
              :class="showSignUpPassword ? 'fa fa-eye-slash' : 'fa fa-eye'"
              class="toggle-password"
              @click="showSignUpPassword = !showSignUpPassword"
            ></i>
          </div>

          <button type="submit" class="btn-submit" :disabled="isLoading">
            {{ isLoading ? 'Cadastrando...' : 'CADASTRAR' }}
          </button>

          <p class="switch-text">
            Já tem conta? <a href="#" @click.prevent="isSignUp = false">Entrar</a>
          </p>
        </form>
      </div>

      <div class="overlay-container">
        <div class="overlay">
          <div class="overlay-panel overlay-left">
            <h2>Bem Vindo de Volta!</h2>
            <p>Para se conectar, por favor, faça login com suas informações pessoais.</p>
            <button class="btn-ghost" @click="isSignUp = false">ENTRAR</button>
          </div>

          <div class="overlay-panel overlay-right">
            <h2>Olá, Amigo!</h2>
            <p>Registre seus dados pessoais para usar todos os recursos do nosso site.</p>
            <button class="btn-ghost" @click="isSignUp = true">CADASTRAR</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AuthView',
  data() {
    return {
      isSignUp: false,
      isLoading: false,
      signInEmail: '',
      signInPassword: '',
      showSignInPassword: false,
      signInError: '',
      signUpName: '',
      signUpEmail: '',
      signUpPassword: '',
      showSignUpPassword: false,
      signUpError: '',
      signUpSuccess: ''
    }
  },
  methods: {
    async handleSignIn() {
      this.signInError = ''
      this.isLoading = true

      try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: this.signInEmail,
            password: this.signInPassword
          })
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Erro ao fazer login')
        }

        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))

        this.$router.push('/home')

      } catch (error) {
        this.signInError = error.message
      } finally {
        this.isLoading = false
      }
    },

    async handleSignUp() {
      this.signUpError = ''
      this.signUpSuccess = ''
      this.isLoading = true

      try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: this.signUpName,
            email: this.signUpEmail,
            password: this.signUpPassword
          })
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Erro ao cadastrar')
        }

        this.signUpSuccess = 'Cadastro realizado! Redirecionando para login...'

        this.signUpName = ''
        this.signUpEmail = ''
        this.signUpPassword = ''

        setTimeout(() => {
          this.isSignUp = false
          this.signUpSuccess = ''
        }, 2000)

      } catch (error) {
        this.signUpError = error.message
      } finally {
        this.isLoading = false
      }
    }
  },
  mounted() {
    const token = localStorage.getItem('token')
    if (token) {
      this.$router.push('/home')
    }
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.auth-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 20px;
}

.auth-container {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 14px 28px rgba(0,0,0,0.15), 0 10px 10px rgba(0,0,0,0.1);
  position: relative;
  overflow: hidden;
  width: 900px;
  max-width: 100%;
  min-height: 550px;
}

.auth-form {
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 50px;
}

.login-form {
  left: 0;
  width: 50%;
  z-index: 2;
}

.auth-container.show-register .login-form {
  transform: translateX(100%);
}

.register-form {
  left: 0;
  width: 50%;
  opacity: 0;
  z-index: 1;
}

.auth-container.show-register .register-form {
  transform: translateX(100%);
  opacity: 1;
  z-index: 5;
  animation: show 0.6s;
}

@keyframes show {
  0%, 49.99% {
    opacity: 0;
    z-index: 1;
  }
  50%, 100% {
    opacity: 1;
    z-index: 5;
  }
}

.auth-form h2 {
  font-weight: bold;
  margin-bottom: 30px;
  color: #3a3a3a;
  text-align: center;
  font-size: 2rem;
}

.input-group {
  position: relative;
  margin: 20px 0;
}

.input-group i {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #FF9933;
  font-size: 18px;
}

.input-group .toggle-password {
  left: auto;
  right: 20px;
  cursor: pointer;
  color: #999;
}

.input-group input {
  background: #f0f0f0;
  border: none;
  border-left: 4px solid #FF9933;
  padding: 15px 20px 15px 55px;
  width: 100%;
  font-size: 15px;
  color: #3a3a3a;
}

.input-group input:focus {
  outline: none;
  background: #e8e8e8;
}

.input-group input::placeholder {
  color: #999;
}

.forgot-password {
  color: #FF9933;
  font-size: 14px;
  margin: 10px 0 20px 0;
  cursor: pointer;
  text-align: left;
}

.btn-submit {
  border-radius: 50px;
  border: none;
  background: linear-gradient(to right, #FF9933, #ff7700);
  color: #fff;
  font-size: 14px;
  font-weight: bold;
  padding: 15px 45px;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: all 0.3s ease;
  cursor: pointer;
  width: 100%;
  margin-top: 20px;
}

.btn-submit:hover {
  background: linear-gradient(to right, #ff7700, #FF9933);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 153, 51, 0.3);
}

.btn-submit:active {
  transform: translateY(0);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.switch-text {
  text-align: center;
  margin-top: 20px;
  color: #999;
  font-size: 14px;
}

.switch-text a {
  color: #FF9933;
  text-decoration: none;
  font-weight: bold;
}

.switch-text a:hover {
  text-decoration: underline;
}

.error-message {
  background: #ffebee;
  color: #c62828;
  padding: 12px;
  border-radius: 8px;
  border-left: 4px solid #c62828;
  margin-bottom: 20px;
  text-align: center;
  font-size: 14px;
}

.success-message {
  background: #e8f5e9;
  color: #2e7d32;
  padding: 12px;
  border-radius: 8px;
  border-left: 4px solid #2e7d32;
  margin-bottom: 20px;
  text-align: center;
  font-size: 14px;
}

.overlay-container {
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: transform 0.6s ease-in-out;
  z-index: 100;
}

.auth-container.show-register .overlay-container {
  transform: translateX(-100%);
}

.overlay {
  background: linear-gradient(135deg, #FF9933 0%, #8B5A3C 50%, #3a3a3a 100%);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 0 0;
  color: #fff;
  position: relative;
  left: -100%;
  height: 100%;
  width: 200%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
}

.auth-container.show-register .overlay {
  transform: translateX(50%);
}

.overlay-panel {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 40px;
  text-align: center;
  top: 0;
  height: 100%;
  width: 50%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
}

.overlay-left {
  transform: translateX(-20%);
}

.auth-container.show-register .overlay-left {
  transform: translateX(0);
}

.overlay-right {
  right: 0;
  transform: translateX(0);
}

.auth-container.show-register .overlay-right {
  transform: translateX(20%);
}

.overlay-panel h2 {
  color: #fff;
  margin-bottom: 20px;
  font-size: 1.8rem;
}

.overlay-panel p {
  font-size: 15px;
  font-weight: 300;
  line-height: 24px;
  letter-spacing: 0.3px;
  margin: 20px 0 30px;
}

.btn-ghost {
  background: transparent;
  border: 2px solid #fff;
  color: #fff;
  border-radius: 50px;
  font-size: 13px;
  font-weight: bold;
  padding: 12px 50px;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: all 0.3s ease;
  cursor: pointer;
}

.btn-ghost:hover {
  background: #fff;
  color: #FF9933;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 255, 255, 0.3);
}

.btn-ghost:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .auth-container {
    width: 100%;
    min-height: 600px;
  }

  .auth-form {
    width: 100%;
    padding: 0 30px;
  }

  .login-form {
    left: 0;
  }

  .register-form {
    left: 0;
  }

  .auth-container.show-register .login-form {
    transform: translateX(-100%);
  }

  .overlay-container {
    left: 0;
    width: 100%;
    height: 40%;
    top: auto;
    bottom: 0;
  }

  .overlay {
    left: 0;
    width: 100%;
    height: 200%;
    top: -100%;
    transform: translateY(0);
  }

  .auth-container.show-register .overlay {
    transform: translateY(50%);
  }

  .overlay-panel {
    width: 100%;
    height: 50%;
  }

  .overlay-left {
    transform: translateY(-20%);
  }

  .auth-container.show-register .overlay-left {
    transform: translateY(0);
  }

  .overlay-right {
    top: 50%;
    transform: translateY(0);
  }

  .auth-container.show-register .overlay-right {
    transform: translateY(20%);
  }
}
</style>
