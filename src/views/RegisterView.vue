<template>
  <div class="container">
    <div class="card">
      <h1>Cadastrar</h1>

      <div v-if="msgError" class="msg-error" v-html="msgError"></div>
      <div v-if="msgSuccess" class="msg-success" v-html="msgSuccess"></div>

      <div class="label-float">
        <input 
          type="text" 
          v-model="nome" 
          :class="{ 
            'error-input': !validacoes.nome.valido && nome.length > 0, 
            'success-input': validacoes.nome.valido 
          }"
          placeholder=" " 
          required 
        />
        <label 
          :class="{ 
            'error-label': !validacoes.nome.valido && nome.length > 0, 
            'success-label': validacoes.nome.valido 
          }"
          for="nome">
          {{ validacoes.nome.label }}
        </label>
      </div>

      <div class="label-float">
        <input 
          type="text" 
          v-model="usuario" 
          :class="{ 
            'error-input': !validacoes.usuario.valido && usuario.length > 0,
            'success-input': validacoes.usuario.valido
          }"
          placeholder=" " 
          required 
        />
        <label 
          :class="{ 
            'error-label': !validacoes.usuario.valido && usuario.length > 0,
            'success-label': validacoes.usuario.valido
          }"
          for="usuario">
          {{ validacoes.usuario.label }}
        </label>
      </div>

      <div class="label-float">
        <input 
          :type="tipoSenha" 
          v-model="senha" 
          :class="{ 
            'error-input': !validacoes.senha.valido && senha.length > 0,
            'success-input': validacoes.senha.valido
          }"
          placeholder=" " 
          required 
        />
        <label 
          :class="{ 
            'error-label': !validacoes.senha.valido && senha.length > 0,
            'success-label': validacoes.senha.valido
          }"
          for="senha">
          {{ validacoes.senha.label }}
        </label>
        <i class="fa fa-eye" aria-hidden="true" @click="toggleSenha('senha')"></i>
      </div>

      <div class="label-float">
        <input 
          :type="tipoConfirmSenha" 
          v-model="confirmSenha" 
          :class="{ 
            'error-input': !validacoes.confirmSenha.valido && confirmSenha.length > 0,
            'success-input': validacoes.confirmSenha.valido && senha.length > 0
          }"
          placeholder=" " 
          required 
        />
        <label 
          :class="{ 
            'error-label': !validacoes.confirmSenha.valido && confirmSenha.length > 0,
            'success-label': validacoes.confirmSenha.valido && senha.length > 0
          }"
          for="confirmSenha">
          {{ validacoes.confirmSenha.label }}
        </label>
        <i class="fa fa-eye" aria-hidden="true" @click="toggleSenha('confirmSenha')"></i>
      </div>

      <div class="justify-center">
        <button @click="cadastrar">Cadastrar</button>
      </div>

      <p class="mt-3">
        Já tem uma conta?
        <router-link to="/login">
          Entrar
        </router-link>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RegisterView',
  data() {
    return {
      nome: '',
      usuario: '',
      senha: '',
      confirmSenha: '',
      tipoSenha: 'password',
      tipoConfirmSenha: 'password',
      msgError: '',
      msgSuccess: '',
    }
  },
  computed: {
    validacoes() {
      const validoNome = this.nome.length > 2;
      const labelNome = validoNome ? 'Nome' : 'Nome *Insira no mínimo 3 caracteres';
      
      const validoUsuario = this.usuario.length > 4;
      const labelUsuario = validoUsuario ? 'Usuário' : 'Usuário *Insira no mínimo 5 caracteres';
      
      const validoSenha = this.senha.length > 5;
      const labelSenha = validoSenha ? 'Senha' : 'Senha *Insira no mínimo 6 caracteres';
      
      const validoConfirmSenha = this.senha === this.confirmSenha && this.senha.length > 0;
      const labelConfirmSenha = validoConfirmSenha ? 'Confirmar Senha' : 'Confirmar Senha *As senhas não conferem';
      
      return {
        nome: { valido: validoNome, label: labelNome },
        usuario: { valido: validoUsuario, label: labelUsuario },
        senha: { valido: validoSenha, label: labelSenha },
        confirmSenha: { valido: validoConfirmSenha, label: labelConfirmSenha },
        formValido: validoNome && validoUsuario && validoSenha && validoConfirmSenha
      };
    }
  },
  methods: {
    toggleSenha(campo) {
      if (campo === 'senha') {
        this.tipoSenha = this.tipoSenha === 'password' ? 'text' : 'password';
      } else if (campo === 'confirmSenha') {
        this.tipoConfirmSenha = this.tipoConfirmSenha === 'password' ? 'text' : 'password';
      }
    },
    cadastrar() {
      this.msgError = '';
      this.msgSuccess = '';
      
      if (this.validacoes.formValido) {
        let listaUser = JSON.parse(localStorage.getItem('listaUser') || '[]');
        
        listaUser.push({
          nomeCad: this.nome,
          userCad: this.usuario,
          senhaCad: this.senha
        });
        
        localStorage.setItem('listaUser', JSON.stringify(listaUser));
        
        this.msgSuccess = '<strong>Cadastrando usuário...</strong>';
        
        this.nome = '';
        this.usuario = '';
        this.senha = '';
        this.confirmSenha = '';
        
        setTimeout(() => {
          this.$router.push('/home');
        }, 3000);
      } else {
        this.msgError = '<strong>Preencha todos os campos corretamente antes de cadastrar</strong>';
        
        if (!this.validacoes.nome.valido) {
          this.$nextTick(() => {
            document.querySelector('input[type="text"]').focus();
          });
        }
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
  background-image: url('/images/quadradia.png');
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
}

.card {
  background-color: #ffffff80;
  padding: 30px;
  border-radius: 4%;
  box-shadow: 3px 3px 1px 0px #00000060;
  width: 400px;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #0d009c;
}

.label-float input {
  width: 100%;
  padding: 5px 5px;
  display: inline-block;
  border: 0;
  border-bottom: 2px solid #0d009c;
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
  color: #0d009c;
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
  border: 2px solid #0d009c;
  color: #0d009c;
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
  background-color: #0d009c;
  color: #fff;
}

.justify-center {
  display: flex;
  justify-content: center;
}

.fa-eye {
  position: absolute;
  top: 15px;
  right: 10px;
  cursor: pointer;
  color: #0d009c;
}

.msg-error {
  text-align: center;
  color: #ff0000;
  background-color: #ffbbbb;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 15px;
}

.msg-success {
  text-align: center;
  color: #00bb00;
  background-color: #bbffbe;
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

.success-input {
  border-color: green !important;
}

.success-label {
  color: green !important;
}

.mt-3 {
  margin-top: 1rem;
  color: #0d009c;
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
  color: #0d009c;
}
</style>