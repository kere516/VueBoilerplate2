<template>
  <div class="container">
    <div class="card">
      <h1>Entrar</h1>
      
      <div v-if="msgError" class="msg-error">{{ msgError }}</div>
      
      <div class="label-float">
        <input 
          :class="{ 'error-input': msgError }" 
          type="text" 
          v-model="usuario" 
          id="usuario" 
          placeholder=" " 
          required 
          @keyup.enter="entrar"
        /> 
        <label 
          :class="{ 'error-label': msgError }" 
          for="usuario">
          Usuario
        </label>
      </div>
      
      <div class="label-float">
        <input 
          :class="{ 'error-input': msgError }" 
          :type="tipoSenha" 
          v-model="senha" 
          id="senha" 
          placeholder=" " 
          required 
          @keyup.enter="entrar"
        />
        <label 
          :class="{ 'error-label': msgError }" 
          for="senha">
          Senha
        </label>
        <i class="fa fa-eye" aria-hidden="true" @click="toggleSenha"></i> 
      </div>
      
      <div class="justify-center">
        <button @click="entrar">Entrar</button>
      </div>
      
      <div class="justify-center">
        <hr />
      </div>
      
      <p>
        Não tem uma conta?
        <router-link to="/register">
          Cadastre-se
        </router-link>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginView',
  data() {
    return {
      usuario: '',
      senha: '',
      tipoSenha: 'password',
      msgError: '',         
    }
  },
  methods: {
    toggleSenha() {
      this.tipoSenha = this.tipoSenha === 'password' ? 'text' : 'password';
    },
    entrar() {
      this.msgError = '';
      
      const listaUserJSON = localStorage.getItem('listaUser');
      let listaUser = listaUserJSON ? JSON.parse(listaUserJSON) : [];
      
      const userValid = listaUser.find(item => 
        this.usuario === item.userCad && this.senha === item.senhaCad
      );
      
      if (userValid) {
        const mathRandom = Math.random().toString(16).substr(2);
        const token = mathRandom + mathRandom;
        
        localStorage.setItem('token', token);
        
        const userLogado = {
          nome: userValid.nomeCad,
          user: userValid.userCad,
          senha: userValid.senhaCad
        };
        localStorage.setItem('userLogado', JSON.stringify(userLogado));
        
        this.$router.push('/home');
      } else {
        this.msgError = 'Usuário ou senha incorretos';
        this.$nextTick(() => {
          document.querySelector('#usuario').focus();
        });
      }
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');

* {
  margin: 0;
  padding: 0;
  font-family: 'Roboto', sans-serif;
}

.container {
  display: flex;
  justify-content: center;
  width: 100%;
  min-height: 100vh;
  align-items: center;
  background-image: url('/images/quadranoite.png');
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
}

.card {
  background-color: #ffffff80;
  padding: 30px;
  border-radius: 4%;
  box-shadow: 3px 3px 1px 0px #00000060;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #272262;
}

.label-float input {
  width: 100%;
  padding: 5px 5px;
  display: inline-block;
  border: 0;
  border-bottom: 2px solid #272262;
  background-color: transparent;
  outline: none;
  min-width: 180px;
  font-size: 16px;
  transition: all .3s ease-out;
  border-radius: 0;
}

.label-float {
  position: relative;
  padding-top: 13px;
  margin-top: 5%;
  margin-bottom: 5%;
}

.label-float input:focus {
  border-bottom: 2px solid #4038a0;
}

.label-float label {
  color: #272262;
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
  margin-top: 13px;
  transition: all .3s ease-out;
}

.label-float input:focus + label,
.label-float input:valid + label {
  font-size: 13px;
  margin-top: 0;
  color: #4038a0;
}

button {
  background-color: transparent;
  border: 2px solid #272262;
  color: #272262;
  padding: 7px 20px;
  font-weight: bold;
  font-size: 12pt;
  margin-top: 20px;
  border-radius: 4px;
  cursor: pointer;
  outline: none;
  transition: all .4s ease-out;
}

button:hover {
  background-color: #272262;
  color: #fff;
}

.justify-center {
  display: flex;
  justify-content: center;
}

hr {
  margin-top: 10%;
  margin-bottom: 10%;
  width: 60%;
}

p {
  color: #272262;
  font-size: 14pt;
  text-align: center;
}

a {
  color: #7a3077;
  font-weight: bold;
  text-decoration: none;
  transition: all .3s ease-out;
}

a:hover {
  color: #272262;
}

.fa-eye {
  position: absolute;
  top: 15px;
  right: 10px;
  cursor: pointer;
  color: #272262;
}

.msg-error {
  text-align: center;
  color: #ff0000;
  background-color: #ffbbbb;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 15px;
}

.error-input {
  border-color: red !important;
}

.error-label {
  color: red !important;
}
</style>