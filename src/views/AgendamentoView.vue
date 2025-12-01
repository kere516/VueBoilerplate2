<template>
  <div class="agendamento-page">
    <header>
      <nav>
        <div class="logo">🏖️ BEACH TIME</div>
        <div class="nav-actions">
          <button class="btn-voltar" @click="$router.push('/home')">← Voltar</button>
          <span class="user-name">👤 {{ currentUser?.name }}</span>
          <button class="btn-logout" @click="handleLogout">Deslogar</button>
        </div>
      </nav>
    </header>

    <div class="agendamento-container">
      <h1 class="page-title">📅 {{ currentUser?.isAdmin ? 'Visualização de Agendamentos' : 'Agendamento de Quadras' }}</h1>

      <template v-if="!currentUser?.isAdmin">
        <section class="quadras-section">
          <h2>Selecione as Quadras</h2>
          <div class="quadras-grid">
            <div
              v-for="quadra in quadras"
              :key="quadra.id"
              class="quadra-card"
              :class="{ selected: selectedQuadras.includes(quadra.id) }"
              @click="toggleQuadra(quadra.id)"
            >
              <div class="quadra-checkbox">
                <input
                  type="checkbox"
                  :checked="selectedQuadras.includes(quadra.id)"
                  @change="toggleQuadra(quadra.id)"
                >
              </div>
              <h3>{{ quadra.nome }}</h3>
              <p>Clique para selecionar</p>
            </div>
          </div>
        </section>

        <section class="calendario-section">
          <h2>Selecione Data e Horário</h2>

          <div class="week-navigation">
            <button @click="previousWeek" class="btn-nav">← Semana Anterior</button>
            <span class="week-display">{{ formatWeekRange() }}</span>
            <button @click="nextWeek" class="btn-nav">Próxima Semana →</button>
          </div>

          <div class="calendario-grid">
            <div class="day-header">Horário</div>
            <div
              v-for="day in weekDays"
              :key="day.date"
              class="day-header"
            >
              <div class="day-name">{{ day.dayName }}</div>
              <div class="day-date">{{ day.dateStr }}</div>
            </div>

            <template v-for="hora in horarios" :key="hora">
              <div class="time-slot">{{ formatHour(hora) }}</div>
              <div
                v-for="day in weekDays"
                :key="`${day.date}-${hora}`"
                class="slot-cell"
                :class="getSlotClass(day.date, hora)"
                @click="selectSlot(day.date, hora)"
              >
                <div class="slot-content">
                  <div class="slot-price">R$ {{ getPrice(hora).toFixed(2) }}</div>
                  <div class="slot-status">{{ getSlotStatus(day.date, hora) }}</div>
                </div>
              </div>
            </template>
          </div>
        </section>

        <section v-if="selectedSlot" class="resumo-section">
          <h2>Resumo do Agendamento</h2>
          <div class="resumo-card">
            <div class="resumo-item">
              <strong>Data:</strong> {{ formatDate(selectedSlot.date) }}
            </div>
            <div class="resumo-item">
              <strong>Horário:</strong> {{ formatHour(selectedSlot.hora) }}
            </div>
            <div class="resumo-item">
              <strong>Quadras:</strong> {{ getSelectedQuadrasNames() }}
            </div>
            <div class="resumo-item">
              <strong>Preço por quadra:</strong> R$ {{ getPrice(selectedSlot.hora).toFixed(2) }}
            </div>
            <div class="resumo-item total">
              <strong>Total:</strong> R$ {{ calculateTotal().toFixed(2) }}
            </div>

            <div class="observacoes">
              <label>Observações (opcional):</label>
              <textarea
                v-model="observacoes"
                placeholder="Digite suas observações aqui..."
                rows="3"
              ></textarea>
            </div>

            <button
              class="btn-confirmar"
              @click="confirmarAgendamento"
              :disabled="isLoading || selectedQuadras.length === 0"
            >
              {{ isLoading ? 'Processando...' : 'Confirmar Agendamento' }}
            </button>
          </div>
        </section>
      </template>

      <section class="meus-agendamentos-section">
   <div class="section-header">
     <h2>{{ currentUser?.isAdmin ? 'Agendamentos Confirmados' : 'Meus Agendamentos' }}</h2>
     
     <button 
       @click="limparHistorico" 
       class="btn-limpar-historico"
       :disabled="loadingAgendamentos || agendamentos.length === 0"
     >
       🗑️ Limpar Histórico
     </button>
   </div>
   
   <div v-if="loadingAgendamentos" class="loading">Carregando...</div>
   <div v-else-if="agendamentos.length === 0" class="no-agendamentos">
     <p>{{ currentUser?.isAdmin ? 'Nenhum agendamento confirmado no sistema.' : 'Você ainda não possui agendamentos.' }}</p>
   </div>
   <div v-else class="agendamentos-list">
     <div
       v-for="agendamento in agendamentos"
       :key="agendamento.id"
       class="agendamento-card"
       :class="{ cancelado: agendamento.status === 'cancelado' }"
     >
       <div class="agendamento-info">
         <div v-if="currentUser?.isAdmin" class="agendamento-usuario">
           👤 Cliente: <strong>{{ agendamento.userName || 'Usuário Desconhecido' }}</strong>
         </div>
         <div class="agendamento-date">{{ formatDate(agendamento.data) }} - {{ formatHour(agendamento.hora) }}</div>
         <div class="agendamento-quadras">{{ agendamento.quadraNomes.join(', ') }}</div>
         <div class="agendamento-price">R$ {{ agendamento.precoTotal.toFixed(2) }}</div>
         <div class="agendamento-status">Status: {{ agendamento.status }}</div>
         <div v-if="agendamento.observacoes" class="agendamento-obs">Obs: {{ agendamento.observacoes }}</div>
         
         <button 
           v-if="!currentUser?.isAdmin && agendamento.status === 'confirmado'"
           @click="fazerPagamento(agendamento)"
           class="btn-pagamento"
         >
           💳 Faça o Pagamento
         </button>
       </div>
       <div class="agendamento-actions">
         <button
           v-if="!currentUser?.isAdmin && agendamento.status === 'confirmado'"
           @click="cancelarAgendamento(agendamento.id)"
           class="btn-cancelar"
         >
           Cancelar
         </button>
       </div>
     </div>
   </div>
 </section>
    </div>

    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h3>{{ modalTitle }}</h3>
        <p>{{ modalMessage }}</p>
        <button @click="closeModal" class="btn-modal">OK</button>
      </div>
    </div>
  </div>
</template>

<script>
import dbService from '@/services/db.js'

export default {
  name: 'AgendamentoView',
  data() {
    return {
      currentUser: null,
      quadras: [
        { id: 1, nome: 'Quadra Crescer' },
        { id: 2, nome: 'Quadra Exata' },
        { id: 3, nome: 'Quadra Fórmula Animal' },
        { id: 4, nome: 'Quadra Laisa Borges' },
        { id: 5, nome: 'Quadra Tron'},
        { id: 6, nome: 'Quadra 60 Minutos'},
      ],
      selectedQuadras: [],
      currentWeekStart: new Date(),
      horarios: [16, 17, 18, 19, 20, 21, 22],
      selectedSlot: null,
      observacoes: '',
      agendamentos: [],
      todosAgendamentos: [],
      loadingAgendamentos: false,
      isLoading: false,
      showModal: false,
      modalTitle: '',
      modalMessage: ''
    }
  },

  computed: {
    weekDays() {
      const days = []
      const start = new Date(this.currentWeekStart)

      for (let i = 0; i < 7; i++) {
        const date = new Date(start)
        date.setDate(start.getDate() + i)

        days.push({
          date: date.toISOString().split('T')[0],
          dayName: date.toLocaleDateString('pt-BR', { weekday: 'short' }),
          dateStr: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
        })
      }

      return days
    }
  },

  async mounted() {
    await this.verifyAuth()
    await this.loadAgendamentos()
    this.setCurrentWeek()
  },

  methods: {
    async verifyAuth() {
      const user = this.getFromLocalStorage('user')
      if (!user) {
        this.$router.push('/auth')
        return
      }
      this.currentUser = user
    },

    getFromLocalStorage(key) {
      try {
        const data = localStorage.getItem(key)
        return data ? JSON.parse(data) : null
      } catch (error) {
        console.error('Erro ao ler do localStorage:', error)
        return null
      }
    },

    async loadAgendamentos() {
  this.loadingAgendamentos = true

  try {
    if (this.currentUser.isAdmin) {
      const todosAgendamentos = await dbService.getAllAgendamentos()
      const confirmados = todosAgendamentos.filter(ag => ag.status === 'confirmado')
      
      const agendamentosComNomes = await Promise.all(
        confirmados.map(async (ag) => {
          try {
            const user = await dbService.getUserById(ag.userId)
            return {
              ...ag,
              userName: user ? user.name : 'Usuário Desconhecido'
            }
          } catch (error) {
            return {
              ...ag,
              userName: 'Usuário Desconhecido'
            }
          }
        })
      )

      this.agendamentos = agendamentosComNomes.sort((a, b) => {
        const dateA = new Date(a.data + 'T' + a.hora)
        const dateB = new Date(b.data + 'T' + b.hora)
        return dateB - dateA
      })

      this.todosAgendamentos = todosAgendamentos
    } 
    else {
      const userAgendamentos = await dbService.getAgendamentosByUserId(this.currentUser.id)
      
      this.agendamentos = userAgendamentos.sort((a, b) => {
        const dateA = new Date(a.data + 'T' + a.hora)
        const dateB = new Date(b.data + 'T' + b.hora)
        return dateB - dateA
      })

      this.todosAgendamentos = await dbService.getAllAgendamentos()
    }
  } catch (error) {
    console.error('Erro ao carregar agendamentos:', error)
    this.showErrorModal('Erro', 'Não foi possível carregar os agendamentos')
    this.agendamentos = []
    this.todosAgendamentos = []
  } finally {
    this.loadingAgendamentos = false
  }
},
    
    isSlotOccupied(date, hora) {
      if (this.selectedQuadras.length === 0) return false

      const horaString = `${hora.toString().padStart(2, '0')}:00`

      return this.todosAgendamentos.some(ag => {
        if (ag.data === date && ag.hora === horaString && ag.status === 'confirmado') {
          return ag.quadraIds.some(quadraId => this.selectedQuadras.includes(quadraId))
        }
        return false
      })
    },

    async confirmarAgendamento() {
      if (!this.selectedSlot || this.selectedQuadras.length === 0) return

      this.isLoading = true

      try {
        const horaString = `${this.selectedSlot.hora.toString().padStart(2, '0')}:00`
        
        const hasConflict = await dbService.checkConflict(
          this.selectedSlot.date, 
          horaString, 
          this.selectedQuadras
        )

        if (hasConflict) {
          this.showErrorModal('Erro no agendamento', 'Uma ou mais quadras já estão ocupadas neste horário.')
          return
        }

        const novoAgendamento = {
          id: Date.now().toString(),
          userId: this.currentUser.id,
          quadraIds: [...this.selectedQuadras],
          quadraNomes: this.selectedQuadras.map(id =>
            this.quadras.find(q => q.id === id)?.nome
          ),
          data: this.selectedSlot.date,
          hora: horaString,
          precoTotal: this.calculateTotal(),
          observacoes: this.observacoes,
          status: 'confirmado',
          criadoEm: new Date().toISOString()
        }

        await dbService.createAgendamento(novoAgendamento)

        this.showSuccessModal('Agendamento confirmado!', 'Seu agendamento foi realizado com sucesso.')

        this.selectedSlot = null
        this.selectedQuadras = []
        this.observacoes = ''

        await this.loadAgendamentos()
      } catch (error) {
        console.error('Erro ao confirmar agendamento:', error)
        this.showErrorModal('Erro no agendamento', 'Erro ao processar agendamento')
      } finally {
        this.isLoading = false
      }
    },

    async limparHistorico() {
  const mensagem = this.currentUser.isAdmin
    ? 'Isso irá deletar TODOS os agendamentos que já passaram. Confirma?'
    : 'Isso irá deletar seus agendamentos cancelados e que já passaram. Confirma?'
  
  if (!confirm(mensagem)) return

  this.isLoading = true

  try {
    let deletados = 0

    if (this.currentUser.isAdmin) {
      deletados = await dbService.limparHistoricoGeral()
    } else {
      deletados = await dbService.limparHistoricoUsuario(this.currentUser.id)
    }

    this.showSuccessModal(
      'Histórico limpo!', 
      `${deletados} agendamento(s) foram deletados.`
    )

    await this.loadAgendamentos()
  } catch (error) {
    console.error('Erro ao limpar histórico:', error)
    this.showErrorModal('Erro', 'Não foi possível limpar o histórico')
  } finally {
    this.isLoading = false
  }
},

fazerPagamento(agendamento) {
  const userName = this.currentUser.name
  const quadras = agendamento.quadraNomes.join(', ')
  const data = this.formatDate(agendamento.data)
  const hora = agendamento.hora
  const valor = agendamento.precoTotal.toFixed(2)
  
  const message = `Olá! Meu nome é ${userName}.

Gostaria de saber as formas de pagamento para o seguinte agendamento:

📅 Data: ${data}
🕐 Horário: ${hora}
🏐 Quadra(s): ${quadras}
💰 Valor: R$ ${valor}

Aguardo retorno!`
  
  const whatsapp = '5586995797982'
  const url = `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`
  window.open(url, '_blank')
},

    async cancelarAgendamento(agendamentoId) {
      if (!confirm('Tem certeza que deseja cancelar este agendamento?')) return

      try {
        const agendamento = await dbService.getAgendamentoById(agendamentoId)
        
        if (agendamento) {
          agendamento.status = 'cancelado'
          await dbService.updateAgendamento(agendamento)

          this.showSuccessModal('Agendamento cancelado', 'Seu agendamento foi cancelado com sucesso.')
          
          await this.loadAgendamentos()
        }
      } catch (error) {
        console.error('Erro ao cancelar agendamento:', error)
        this.showErrorModal('Erro ao cancelar', 'Erro ao cancelar agendamento')
      }
    },

    toggleQuadra(quadraId) {
      const index = this.selectedQuadras.indexOf(quadraId)
      if (index > -1) {
        this.selectedQuadras.splice(index, 1)
      } else {
        this.selectedQuadras.push(quadraId)
      }
    },

    getSelectedQuadrasNames() {
      return this.selectedQuadras
        .map(id => this.quadras.find(q => q.id === id)?.nome)
        .join(', ')
    },

    setCurrentWeek() {
      const today = new Date()
      const dayOfWeek = today.getDay()
      const diff = today.getDate() - dayOfWeek
      this.currentWeekStart = new Date(today.setDate(diff))
    },

    previousWeek() {
      const newStart = new Date(this.currentWeekStart)
      newStart.setDate(newStart.getDate() - 7)
      this.currentWeekStart = newStart
    },

    nextWeek() {
      const newStart = new Date(this.currentWeekStart)
      newStart.setDate(newStart.getDate() + 7)
      this.currentWeekStart = newStart
    },

    formatWeekRange() {
      const start = new Date(this.currentWeekStart)
      const end = new Date(start)
      end.setDate(start.getDate() + 6)

      return `${start.toLocaleDateString('pt-BR')} - ${end.toLocaleDateString('pt-BR')}`
    },

    selectSlot(date, hora) {
      if (this.selectedQuadras.length === 0) {
        this.showErrorModal('Selecione as quadras', 'Por favor, selecione pelo menos uma quadra antes de escolher o horário.')
        return
      }
      
      if (this.isSlotOccupied(date, hora)) {
        this.showErrorModal('Horário indisponível', 'Uma ou mais quadras selecionadas já estão ocupadas neste horário.')
        return
      }

      this.selectedSlot = { date, hora }
    },

    getSlotClass(date, hora) {
      if (this.selectedQuadras.length === 0) return 'disabled'

      const isOccupied = this.isSlotOccupied(date, hora)
      const isSelected = this.selectedSlot &&
        this.selectedSlot.date === date &&
        this.selectedSlot.hora === hora

      return {
        available: !isOccupied,
        unavailable: isOccupied,
        selected: isSelected,
        disabled: this.selectedQuadras.length === 0
      }
    },

    getSlotStatus(date, hora) {
      if (this.selectedQuadras.length === 0) return 'Selecione quadras'
      
      if (this.isSlotOccupied(date, hora)) {
        return 'Ocupado'
      }
      
      return 'Disponível'
    },

    formatHour(hora) {
      if (typeof hora === 'string') return hora
      return `${hora.toString().padStart(2, '0')}:00`
    },

    formatDate(dateStr) {
      return new Date(dateStr + 'T00:00:00').toLocaleDateString('pt-BR')
    },

    getPrice(hora) {
      const horaNum = typeof hora === 'string' ? parseInt(hora) : hora
      return horaNum >= 16 && horaNum < 18 ? 40.00 : 50.00
    },

    calculateTotal() {
      if (!this.selectedSlot) return 0
      return this.getPrice(this.selectedSlot.hora) * this.selectedQuadras.length
    },

    showSuccessModal(title, message) {
      this.modalTitle = title
      this.modalMessage = message
      this.showModal = true
    },

    showErrorModal(title, message) {
      this.modalTitle = title
      this.modalMessage = message
      this.showModal = true
    },

    closeModal() {
      this.showModal = false
    },

    handleLogout() {
      if (confirm('Deseja realmente deslogar?')) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        this.$router.push('/auth')
      }
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

.agendamento-usuario {
  background: #e3f2fd;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  margin-bottom: 0.8rem;
  color: #1976d2;
  font-size: 0.95rem;
  border-left: 3px solid #1976d2;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.btn-limpar-historico {
  background: linear-gradient(to right, #ff6b6b, #ee5a52);
  color: white;
  border: none;
  padding: 0.7rem 1.5rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-limpar-historico:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 107, 107, 0.3);
}

.btn-limpar-historico:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.agendamento-usuario {
  background: #e3f2fd;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  margin-bottom: 0.8rem;
  color: #1976d2;
  font-size: 0.95rem;
  border-left: 3px solid #1976d2;
}

.btn-pagamento {
  background: linear-gradient(to right, #25D366, #20BA5A);
  color: white;
  border: none;
  padding: 0.7rem 1.2rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 1rem;
  width: 100%;
}

.btn-pagamento:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(37, 211, 102, 0.3);
}

.agendamento-page {
  min-height: 100vh;
  background: #f5f5f5;
}

header {
  background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%);
  color: white;
  padding: 1.5rem 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

nav {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.8rem;
  font-weight: bold;
  background: linear-gradient(135deg, #ff9933 0%, #ffb366 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-voltar {
  background: transparent;
  color: #ff9933;
  border: 1px solid #ff9933;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-voltar:hover {
  background: #ff9933;
  color: white;
}

.user-name {
  color: #ff9933;
  font-weight: 600;
}

.btn-logout {
  background: transparent;
  color: #ff6b6b;
  border: 1px solid #ff6b6b;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-logout:hover {
  background: #ff6b6b;
  color: white;
}

.agendamento-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.page-title {
  text-align: center;
  color: #1a1a1a;
  margin-bottom: 3rem;
  font-size: 2.5rem;
}

section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
}

section h2 {
  color: #1a1a1a;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.quadras-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.quadra-card {
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.quadra-card:hover {
  border-color: #ff9933;
}

.quadra-card.selected {
  border-color: #ff9933;
  background: #fff3e0;
}

.quadra-checkbox {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}

.week-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.btn-nav {
  background: #ff9933;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-nav:hover {
  background: #e88820;
}

.week-display {
  font-weight: 600;
  font-size: 1.1rem;
}

.calendario-grid {
  display: grid;
  grid-template-columns: 100px repeat(7, 1fr);
  gap: 1px;
  background: #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.day-header {
  background: #1a1a1a;
  color: white;
  padding: 1rem;
  text-align: center;
  font-weight: 600;
}

.time-slot {
  background: #f8f8f8;
  padding: 1rem;
  text-align: center;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slot-cell {
  background: white;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.3s;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slot-cell.available {
  background: #e8f5e8;
  border-left: 4px solid #4caf50;
}

.slot-cell.unavailable {
  background: #ffebee;
  border-left: 4px solid #f44336;
  cursor: not-allowed;
}

.slot-cell.selected {
  background: #fff3e0;
  border-left: 4px solid #ff9933;
}

.slot-cell.disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.slot-content {
  text-align: center;
}

.slot-price {
  font-weight: 600;
  color: #1a1a1a;
  font-size: 0.9rem;
}

.slot-status {
  font-size: 0.8rem;
  color: #666;
}

.resumo-card {
  background: #f8f8f8;
  padding: 2rem;
  border-radius: 8px;
  border-left: 4px solid #ff9933;
}

.resumo-item {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.resumo-item.total {
  font-size: 1.3rem;
  color: #ff9933;
  border-top: 1px solid #e0e0e0;
  padding-top: 1rem;
  margin-top: 1rem;
}

.observacoes {
  margin: 1.5rem 0;
}

.observacoes label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.observacoes textarea {
  width: 100%;
  padding: 0.8rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-family: inherit;
  resize: vertical;
}

.btn-confirmar {
  background: linear-gradient(to right, #4caf50, #45a049);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  width: 100%;
}

.btn-confirmar:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(76, 175, 80, 0.3);
}

.btn-confirmar:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.agendamentos-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.agendamento-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: #f8f8f8;
  border-radius: 8px;
  border-left: 4px solid #4caf50;
}

.agendamento-card.cancelado {
  border-left-color: #f44336;
  opacity: 0.7;
}

.agendamento-info {
  flex: 1;
}

.agendamento-date {
  font-weight: 600;
  font-size: 1.1rem;
  color: #1a1a1a;
}

.agendamento-quadras {
  color: #666;
  margin: 0.5rem 0;
}

.agendamento-price {
  font-weight: 600;
  color: #ff9933;
  font-size: 1.1rem;
}

.agendamento-status {
  margin-top: 0.5rem;
  color: #666;
}

.agendamento-obs {
  margin-top: 0.5rem;
  font-style: italic;
  color: #888;
  font-size: 0.9rem;
}

.btn-cancelar {
  background: transparent;
  color: #f44336;
  border: 1px solid #f44336;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-cancelar:hover {
  background: #f44336;
  color: white;
}

.loading, .no-agendamentos {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  max-width: 400px;
  width: 90%;
}

.modal-content h3 {
  margin-bottom: 1rem;
  color: #1a1a1a;
}

.modal-content p {
  margin-bottom: 2rem;
  color: #666;
}

.btn-modal {
  background: #ff9933;
  color: white;
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
}

@media (max-width: 768px) {
  .calendario-grid {
    grid-template-columns: 80px repeat(7, 1fr);
    font-size: 0.8rem;
  }

  .quadras-grid {
    grid-template-columns: 1fr;
  }

  .week-navigation {
    flex-direction: column;
    gap: 1rem;
  }

  .agendamento-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style>