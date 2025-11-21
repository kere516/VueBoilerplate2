<template>
  <div class="auth-page">
    <div class="auth-container" :class="{ 'show-register': isSignUp }">
      
      <div class="auth-form login-form">
        <h2>Sign In</h2>
        
        <div v-if="signInError" class="error-message">
          {{ signInError }}
        </div>
        
        <div class="input-field">
          <i class="fas fa-envelope"></i>
          <input 
            v-model="signInData.email" 
            type="email" 
            placeholder="Email"
            required
          />
        </div>
        
        <div class="input-field">
          <i class="fas fa-lock"></i>
          <input 
            v-model="signInData.password" 
            type="password" 
            placeholder="Senha"
            required
          />
        </div>
        
        <a href="#" class="forgot-link" @click.prevent="handleForgot">Esqueceu sua senha?</a>
        
        <button @click="handleSignIn" class="btn btn-submit">ENTRAR</button>
        
        <p class="toggle-text">
          Não tem conta? 
          <a href="#" @click.prevent="toggleForm">Cadastre-se</a>
        </p>
      </div>

      <div class="auth-form register-form">
        <h2>Crie Sua Conta</h2>
        
        <div v-if="signUpError" class="error-message">
          {{ signUpError }}
        </div>
        <div v-if="signUpSuccess" class="success-message">
          {{ signUpSuccess }}
        </div>
        
        <div class="input-field">
          <i class="fas fa-user"></i>
          <input 
            v-model="signUpData.name" 
            type="text" 
            placeholder="Nome"
            required
          />
        </div>
        
        <div class="input-field">
          <i class="fas fa-envelope"></i>
          <input 
            v-model="signUpData.email" 
            type="email" 
            placeholder="Email"
            required
          />
        </div>
        
        <div class="input-field">
          <i class="fas fa-lock"></i>
          <input 
            v-model="signUpData.password" 
            type="password" 
            placeholder="Senha"
            required
          />
        </div>
        
        <button @click="handleSignUp" class="btn btn-submit">CADASTRAR</button>
        
        <p class="toggle-text">
          Já tem conta? 
          <a href="#" @click.prevent="toggleForm">Entrar</a>
        </p>
      </div>

      <div class="overlay-panel">
        <div class="overlay-content">
          <h3 v-if="!isSignUp">Olá, Amigo!</h3>
          <h3 v-else>Bem Vindo de Volta!</h3>
          
          <p v-if="!isSignUp">
            Registre seus dados pessoais para usar todos os recursos do nosso site.
          </p>
          <p v-else>
            Para se conectar, por favor, faça login com suas informações pessoais.
          </p>
          
          <button @click="toggleForm" class="btn btn-toggle">
            {{ isSignUp ? 'ENTRAR' : 'CADASTRAR' }}
          </button>
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
      
      signInData: {
        email: '',
        password: ''
      },
      signUpData: {
        name: '',
        email: '',
        password: ''
      },
      
      signInError: '',
      signUpError: '',
      signUpSuccess: ''
    }
  },
  
  mounted() {
    this.initializeStorage()
    
    const currentUser = localStorage.getItem('beachtime_currentUser')
    if (currentUser) {
      const user = JSON.parse(currentUser)
      if (user.isLoggedIn) {
        this.$router.push('/home')
      }
    }
  },
  
  methods: {
    initializeStorage() {
      if (!localStorage.getItem('beachtime_users')) {
        localStorage.setItem('beachtime_users', JSON.stringify([]))
      }
    },
    
    toggleForm() {
      this.isSignUp = !this.isSignUp
      this.clearMessages()
    },
    
    clearMessages() {
      this.signInError = ''
      this.signUpError = ''
      this.signUpSuccess = ''
    },
    
    getAllUsers() {
      return JSON.parse(localStorage.getItem('beachtime_users') || '[]')
    },
    
    handleSignUp() {
      const { name, email, password } = this.signUpData
      
      if (!name || name.length < 3) {
        this.signUpError = 'Nome deve ter pelo menos 3 caracteres!'
        return
      }
      
      if (!email || !this.isValidEmail(email)) {
        this.signUpError = 'Email inválido!'
        return
      }
      
      if (!password || password.length < 6) {
        this.signUpError = 'Senha deve ter pelo menos 6 caracteres!'
        return
      }
      
      const users = this.getAllUsers()
      if (users.find(user => user.email === email)) {
        this.signUpError = 'Este email já está cadastrado!'
        return
      }
      
      users.push({
        name: name,
        email: email,
        password: password,
        createdAt: new Date().toISOString()
      })
      
      localStorage.setItem('beachtime_users', JSON.stringify(users))
      this.signUpSuccess = 'Cadastro realizado com sucesso!'
      this.signUpError = ''
      this.signUpData = { name: '', email: '', password: '' }
      
      setTimeout(() => {
        this.isSignUp = false
        this.signUpSuccess = ''
      }, 2000)
    },
    
    handleSignIn() {
      const { email, password } = this.signInData

      if (!email || !this.isValidEmail(email)) {
        this.signInError = 'Email inválido!'
        return
      }
      
      if (!password) {
        this.signInError = 'Senha obrigatória!'
        return
      }
      
      const users = this.getAllUsers()
      const user = users.find(u => u.email === email && u.password === password)
      
      if (user) {
        localStorage.setItem('beachtime_currentUser', JSON.stringify({
          name: user.name,
          email: user.email,
          isLoggedIn: true,
          loginTime: new Date().toISOString()
        }))
        
        this.signInData = { email: '', password: '' }
        this.signInError = ''
        
        setTimeout(() => {
          this.$router.push('/home')
        }, 500)
      } else {
        this.signInError = 'Email ou senha incorretos!'
      }
    },
    
    handleForgot() {
      alert('Funcionalidade de recuperação de senha em desenvolvimento!')
    },
    
    isValidEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return re.test(email)
    }
  }
}
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.auth-page {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Poppins', sans-serif;
  padding: 20px;
}

.auth-container {
  position: relative;
  width: 100%;
  max-width: 900px;
  height: 500px;
  background: transparent;
  border-radius: 15px;
  box-shadow: none;
  overflow: hidden;
}

.auth-form {
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  transition: all 0.6s ease-in-out;
  z-index: 10;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  margin-right: 10px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.login-form {
  left: 0;
  opacity: 1;
  z-index: 2;
}

.register-form {
  left: 50%;
  opacity: 0;
  z-index: 1;
}

.auth-container.show-register .login-form {
  left: -50%;
  opacity: 0;
  z-index: 1;
}

.auth-container.show-register .register-form {
  left: 50%;
  opacity: 1;
  z-index: 2;
}

.auth-form h2 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 30px;
  font-weight: 700;
}

.input-field {
  width: 100%;
  display: flex;
  align-items: center;
  background: #eee;
  border: none;
  border-left: 4px solid #FF9933;
  padding: 15px 20px;
  margin: 10px 0;
  border-radius: 5px;
  transition: all 0.3s;
}

.input-field:focus-within {
  border-left-color: #1a1a1a;
  background: #f5f5f5;
  box-shadow: 0 0 5px rgba(255, 153, 51, 0.2);
}

.input-field i {
  color: #FF9933;
  margin-right: 10px;
  font-size: 1rem;
}

.input-field input {
  background: none;
  border: none;
  outline: none;
  flex: 1;
  font-size: 1rem;
  color: #333;
  font-family: 'Poppins', sans-serif;
}

.input-field input::placeholder {
  color: #999;
}

.forgot-link {
  align-self: flex-start;
  color: #FF9933;
  text-decoration: none;
  font-size: 0.85rem;
  margin: 10px 0 20px 0;
  transition: color 0.3s;
  cursor: pointer;
}

.forgot-link:hover {
  color: #1a1a1a;
  text-decoration: underline;
}

.btn {
  border: none;
  border-radius: 20px;
  padding: 12px 50px;
  font-weight: 600;
  font-size: 0.9rem;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s;
  font-family: 'Poppins', sans-serif;
}

.btn-submit {
  background: #FF9933;
  color: white;
  width: 100%;
  margin: 15px 0;
}

.btn-submit:hover {
  background: #1a1a1a;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 153, 51, 0.3);
}

.btn-submit:active {
  transform: translateY(0);
}

.toggle-text {
  margin-top: 20px;
  color: #999;
  font-size: 0.9rem;
  text-align: center;
}

.toggle-text a {
  color: #FF9933;
  text-decoration: none;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.3s;
}

.toggle-text a:hover {
  color: #1a1a1a;
  text-decoration: underline;
}

.overlay-panel {
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  background: linear-gradient(135deg, #FF9933 0%, #1a1a1a 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  border-radius: 0 15px 15px 0;
  transition: all 0.6s ease-in-out;
  z-index: 5;
}

.auth-container.show-register .overlay-panel {
  left: 0;
  border-radius: 15px 0 0 15px;
}

.overlay-content {
  text-align: center;
  padding: 40px;
}

.overlay-content h3 {
  font-size: 1.8rem;
  margin-bottom: 20px;
  font-weight: 700;
}

.overlay-content p {
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 30px;
  opacity: 0.9;
}

.btn-toggle {
  background: transparent;
  color: white;
  border: 2px solid white;
}

.btn-toggle:hover {
  background: white;
  color: #667eea;
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 12px 15px;
  border-radius: 5px;
  margin-bottom: 20px;
  font-size: 0.9rem;
  width: 100%;
  text-align: center;
  border-left: 4px solid #c33;
}

.success-message {
  background: #efe;
  color: #3c3;
  padding: 12px 15px;
  border-radius: 5px;
  margin-bottom: 20px;
  font-size: 0.9rem;
  width: 100%;
  text-align: center;
  border-left: 4px solid #3c3;
}

@media (max-width: 768px) {
  .auth-container {
    height: auto;
    min-height: 600px;
  }

  .auth-form {
    position: relative;
    width: 100%;
    left: 0 !important;
    opacity: 1 !important;
    z-index: 1 !important;
    padding: 30px 20px;
    min-height: 400px;
  }

  .register-form {
    display: none;
  }

  .auth-container.show-register .login-form {
    display: none;
  }

  .auth-container.show-register .register-form {
    display: flex;
    position: relative;
    left: 0;
    opacity: 1;
    z-index: 1;
  }

  .overlay-panel {
    display: none;
  }

  .auth-form h2 {
    font-size: 1.5rem;
    margin-bottom: 20px;
  }

  .input-field {
    padding: 12px 15px;
    margin: 8px 0;
  }

  .btn-submit {
    padding: 10px 40px;
  }

  .toggle-text {
    margin-top: 15px;
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .auth-page {
    padding: 10px;
  }

  .auth-container {
    border-radius: 10px;
  }

  .auth-form {
    padding: 20px;
  }

  .auth-form h2 {
    font-size: 1.3rem;
  }

  .input-field {
    font-size: 0.9rem;
  }
}
</style>