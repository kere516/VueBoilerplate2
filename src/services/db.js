const DB_NAME = 'BeachTimeDB'
const DB_VERSION = 2
const STORES = {
  USERS: 'users',
  AVISOS: 'avisos',
  AGENDAMENTOS: 'agendamentos'
}

class DatabaseService {
  constructor() {
    this.db = null
  }

  async openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => reject(new Error('Erro ao abrir banco de dados'))

      request.onsuccess = (event) => {
        this.db = event.target.result
        resolve(this.db)
      }

      request.onupgradeneeded = (event) => {
        const db = event.target.result

        if (!db.objectStoreNames.contains(STORES.USERS)) {
          const usersStore = db.createObjectStore(STORES.USERS, { 
            keyPath: 'id',
            autoIncrement: true 
          })
          usersStore.createIndex('email', 'email', { unique: true })
        }

        if (!db.objectStoreNames.contains(STORES.AVISOS)) {
          const avisosStore = db.createObjectStore(STORES.AVISOS, { 
            keyPath: 'id',
            autoIncrement: true 
          })
          avisosStore.createIndex('createdAt', 'createdAt', { unique: false })
        }

        if (!db.objectStoreNames.contains(STORES.AGENDAMENTOS)) {
          const agendamentosStore = db.createObjectStore(STORES.AGENDAMENTOS, { 
            keyPath: 'id' 
          })
          agendamentosStore.createIndex('userId', 'userId', { unique: false })
          agendamentosStore.createIndex('data', 'data', { unique: false })
          agendamentosStore.createIndex('status', 'status', { unique: false })
        }
      }
    })
  }

  async ensureDB() {
    if (!this.db) {
      await this.openDB()
    }
    return this.db
  }

  async register(name, email, password) {
    try {
      const db = await this.ensureDB()
      
      const existingUser = await this.getUserByEmail(email)
      if (existingUser) {
        throw new Error('Email já cadastrado')
      }

      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORES.USERS], 'readwrite')
        const store = transaction.objectStore(STORES.USERS)
        
        const user = {
          name,
          email,
          password,
          isAdmin: false,
          createdAt: new Date().toISOString()
        }
        
        const request = store.add(user)

        request.onsuccess = () => {
          user.id = request.result
          resolve(user)
        }

        request.onerror = () => reject(new Error('Erro ao criar usuário'))
      })
    } catch (error) {
      throw error
    }
  }

  async login(email, password) {
    try {
      const user = await this.getUserByEmail(email)
      
      if (!user) {
        throw new Error('Usuário não encontrado')
      }

      if (user.password !== password) {
        throw new Error('Senha incorreta')
      }

      const { password: _, ...userWithoutPassword } = user
      return userWithoutPassword
    } catch (error) {
      throw error
    }
  }

  async getUserByEmail(email) {
    try {
      const db = await this.ensureDB()
      
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORES.USERS], 'readonly')
        const store = transaction.objectStore(STORES.USERS)
        const index = store.index('email')
        
        const request = index.get(email)

        request.onsuccess = () => resolve(request.result || null)
        request.onerror = () => reject(new Error('Erro ao buscar usuário'))
      })
    } catch (error) {
      throw error
    }
  }

  async getUserById(id) {
    try {
      const db = await this.ensureDB()
      
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORES.USERS], 'readonly')
        const store = transaction.objectStore(STORES.USERS)
        
        const request = store.get(id)

        request.onsuccess = () => {
          const user = request.result
          if (user) {
            const { password: _, ...userWithoutPassword } = user
            resolve(userWithoutPassword)
          } else {
            resolve(null)
          }
        }
        request.onerror = () => reject(new Error('Erro ao buscar usuário'))
      })
    } catch (error) {
      throw error
    }
  }

  async createAviso(titulo, descricao, adminId, adminName) {
    try {
      const db = await this.ensureDB()
      
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORES.AVISOS], 'readwrite')
        const store = transaction.objectStore(STORES.AVISOS)
        
        const aviso = {
          titulo,
          descricao,
          adminId,
          adminName,
          createdAt: new Date().toISOString()
        }
        
        const request = store.add(aviso)

        request.onsuccess = () => {
          aviso.id = request.result
          resolve(aviso)
        }

        request.onerror = () => reject(new Error('Erro ao criar aviso'))
      })
    } catch (error) {
      throw error
    }
  }

  async getAllAvisos() {
    try {
      const db = await this.ensureDB()
      
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORES.AVISOS], 'readonly')
        const store = transaction.objectStore(STORES.AVISOS)
        
        const request = store.getAll()

        request.onsuccess = () => {
          const avisos = request.result || []
         
          avisos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          resolve(avisos)
        }

        request.onerror = () => reject(new Error('Erro ao buscar avisos'))
      })
    } catch (error) {
      throw error
    }
  }

  async deleteAviso(id) {
    try {
      const db = await this.ensureDB()
      
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORES.AVISOS], 'readwrite')
        const store = transaction.objectStore(STORES.AVISOS)
        
        const request = store.delete(id)

        request.onsuccess = () => resolve(true)
        request.onerror = () => reject(new Error('Erro ao deletar aviso'))
      })
    } catch (error) {
      throw error
    }
  }

  async createAgendamento(agendamento) {
    try {
      const db = await this.ensureDB()
      
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORES.AGENDAMENTOS], 'readwrite')
        const store = transaction.objectStore(STORES.AGENDAMENTOS)
        
        const request = store.add(agendamento)

        request.onsuccess = () => resolve(agendamento)
        request.onerror = () => reject(new Error('Erro ao criar agendamento'))
      })
    } catch (error) {
      throw error
    }
  }

  async getAllAgendamentos() {
    try {
      const db = await this.ensureDB()
      
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORES.AGENDAMENTOS], 'readonly')
        const store = transaction.objectStore(STORES.AGENDAMENTOS)
        
        const request = store.getAll()

        request.onsuccess = () => resolve(request.result || [])
        request.onerror = () => reject(new Error('Erro ao buscar agendamentos'))
      })
    } catch (error) {
      throw error
    }
  }

  async getAgendamentosByUserId(userId) {
    try {
      const db = await this.ensureDB()
      
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORES.AGENDAMENTOS], 'readonly')
        const store = transaction.objectStore(STORES.AGENDAMENTOS)
        const index = store.index('userId')
        
        const request = index.getAll(userId)

        request.onsuccess = () => resolve(request.result || [])
        request.onerror = () => reject(new Error('Erro ao buscar agendamentos'))
      })
    } catch (error) {
      throw error
    }
  }

  async getAgendamentoById(id) {
    try {
      const db = await this.ensureDB()
      
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORES.AGENDAMENTOS], 'readonly')
        const store = transaction.objectStore(STORES.AGENDAMENTOS)
        
        const request = store.get(id)

        request.onsuccess = () => resolve(request.result || null)
        request.onerror = () => reject(new Error('Erro ao buscar agendamento'))
      })
    } catch (error) {
      throw error
    }
  }

  async updateAgendamento(agendamento) {
    try {
      const db = await this.ensureDB()
      
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORES.AGENDAMENTOS], 'readwrite')
        const store = transaction.objectStore(STORES.AGENDAMENTOS)
        
        const request = store.put(agendamento)

        request.onsuccess = () => resolve(agendamento)
        request.onerror = () => reject(new Error('Erro ao atualizar agendamento'))
      })
    } catch (error) {
      throw error
    }
  }

  async deleteAgendamento(id) {
    try {
      const db = await this.ensureDB()
      
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORES.AGENDAMENTOS], 'readwrite')
        const store = transaction.objectStore(STORES.AGENDAMENTOS)
        
        const request = store.delete(id)

        request.onsuccess = () => resolve(true)
        request.onerror = () => reject(new Error('Erro ao deletar agendamento'))
      })
    } catch (error) {
      throw error
    }
  }

  async checkConflict(data, hora, quadraIds, excludeId = null) {
    try {
      const allAgendamentos = await this.getAllAgendamentos()
      
      return allAgendamentos.some(ag => {
        if (excludeId && ag.id === excludeId) return false
        
        if (ag.data === data && ag.hora === hora && ag.status === 'confirmado') {
          return quadraIds.some(quadraId => ag.quadraIds.includes(quadraId))
        }
        
        return false
      })
    } catch (error) {
      throw error
    }
  }

  async migrateFromLocalStorage() {
    try {
      const existingAgendamentos = await this.getAllAgendamentos()
      if (existingAgendamentos.length === 0) {
        const localStorageData = localStorage.getItem('agendamentos')
        if (localStorageData) {
          const agendamentos = JSON.parse(localStorageData)
          if (Array.isArray(agendamentos)) {
            for (const ag of agendamentos) {
              await this.createAgendamento(ag)
            }
            console.log(`✅ ${agendamentos.length} agendamentos migrados`)
          }
        }
      }

      return true
    } catch (error) {
      console.error('Erro na migração:', error)
      return false
    }
  }

  async clearAllData() {
    try {
      const db = await this.ensureDB()
      
      const stores = [STORES.USERS, STORES.AVISOS, STORES.AGENDAMENTOS]
      
      for (const storeName of stores) {
        await new Promise((resolve, reject) => {
          const transaction = db.transaction([storeName], 'readwrite')
          const store = transaction.objectStore(storeName)
          const request = store.clear()
          
          request.onsuccess = () => resolve()
          request.onerror = () => reject()
        })
      }
      
      console.log('✅ Todos os dados foram limpos')
      return true
    } catch (error) {
      console.error('Erro ao limpar dados:', error)
      return false
    }
  }

async limparHistoricoUsuario(userId) {
  try {
    const agendamentos = await this.getAgendamentosByUserId(userId)
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    
    let deletados = 0
    
    for (const ag of agendamentos) {
      const dataAgendamento = new Date(ag.data + 'T00:00:00')
      const jaPassou = dataAgendamento < hoje
      const foiCancelado = ag.status === 'cancelado'
      
      if (jaPassou || foiCancelado) {
        await this.deleteAgendamento(ag.id)
        deletados++
      }
    }
    
    return deletados
  } catch (error) {
    console.error('Erro ao limpar histórico:', error)
    throw error
  }
}

async limparHistoricoGeral() {
  try {
    const todosAgendamentos = await this.getAllAgendamentos()
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    
    let deletados = 0
    
    for (const ag of todosAgendamentos) {
      const dataAgendamento = new Date(ag.data + 'T00:00:00')
      const jaPassou = dataAgendamento < hoje
      
      if (jaPassou) {
        await this.deleteAgendamento(ag.id)
        deletados++
      }
    }
    
    return deletados
  } catch (error) {
    console.error('Erro ao limpar histórico geral:', error)
    throw error
  }
}

  async createDefaultAdmin() {
    try {
      const adminEmail = 'admin@beachtime.com'
      const existingAdmin = await this.getUserByEmail(adminEmail)
      
      if (!existingAdmin) {
        const db = await this.ensureDB()
        
        return new Promise((resolve, reject) => {
          const transaction = db.transaction([STORES.USERS], 'readwrite')
          const store = transaction.objectStore(STORES.USERS)
          
          const admin = {
            name: 'Administrador',
            email: adminEmail,
            password: 'admin123',
            isAdmin: true,
            createdAt: new Date().toISOString()
          }
          
          const request = store.add(admin)

          request.onsuccess = () => {
            admin.id = request.result
            console.log('✅ Admin criado:', adminEmail, '/ Senha: admin123')
            resolve(admin)
          }

          request.onerror = () => reject(new Error('Erro ao criar admin'))
        })
      }
      
      return existingAdmin
    } catch (error) {
      console.error('Erro ao criar admin:', error)
      return null
    }
  }
}

const dbService = new DatabaseService()

dbService.openDB().then(() => {
  dbService.createDefaultAdmin()
  dbService.migrateFromLocalStorage()
})


export default dbService