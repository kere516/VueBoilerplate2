# Sistema de Agendamento - Beach Time

## ✅ Implementação Completa

### Funcionalidades Implementadas

#### 1. **6 Quadras Disponíveis**
- ✅ Quadra Crescer
- ✅ Quadra Exata
- ✅ Quadra Fórmula Animal
- ✅ Quadra Laisa Borges
- ✅ Quadra Tron
- ✅ Quadra 60 Minutos

#### 2. **Sistema de Preços por Horário**
- ✅ **16:00 às 18:00**: R$ 40,00 por quadra
- ✅ **Demais horários**: R$ 50,00 por quadra
- ✅ Cálculo automático do total (preço × número de quadras)

#### 3. **Calendário Semanal Interativo**
- ✅ Navegação por semanas (anterior/próxima)
- ✅ Visualização de 7 dias por semana
- ✅ Horários de 8:00 às 23:00
- ✅ Interface responsiva

#### 4. **Sistema de Cores por Disponibilidade**
- 🟢 **Verde**: Horário disponível
- 🔴 **Vermelho**: Horário ocupado/indisponível
- 🟡 **Amarelo**: Horário selecionado
- ⚫ **Cinza**: Nenhuma quadra selecionada

#### 5. **Seleção Múltipla de Quadras**
- ✅ Checkbox para cada quadra
- ✅ Seleção simultânea de múltiplas quadras
- ✅ Verificação de disponibilidade para todas as quadras selecionadas
- ✅ Preço total calculado automaticamente

#### 6. **Armazenamento LocalStorage**
- ✅ Todos os agendamentos salvos no navegador (cache)
- ✅ Dados persistem entre sessões
- ✅ Sistema 100% offline para agendamentos
- ✅ Autenticação via backend (token)

## Arquitetura do Sistema

### 🗂️ Armazenamento Híbrido

#### **LocalStorage (Agendamentos)**
```javascript
localStorage.getItem('agendamentos')  // Array de agendamentos
localStorage.getItem('user')          // Dados do usuário logado
localStorage.getItem('token')         // Token de autenticação
```

#### **Backend/Banco de Dados (Demais funcionalidades)**
- ✅ Autenticação de usuários
- ✅ Sistema de avisos
- ✅ Gerenciamento de usuários
- ✅ Validação de tokens

## Como Usar o Sistema

### 1. **Acesso**
```
http://localhost:5173/agendamento
```
*Requer login prévio*

### 2. **Fluxo de Agendamento**
1. **Selecionar Quadras**: Clique nas quadras desejadas (múltipla seleção)
2. **Navegar no Calendário**: Use os botões para mudar de semana
3. **Escolher Horário**: Clique em um slot verde (disponível)
4. **Revisar Resumo**: Verifique data, horário, quadras e preço total
5. **Adicionar Observações**: Campo opcional para comentários
6. **Confirmar**: Clique em "Confirmar Agendamento"

### 3. **Gerenciar Agendamentos**
- Visualizar todos os seus agendamentos
- Cancelar agendamentos confirmados (muda status para "cancelado")
- Dados salvos no navegador

## Características Técnicas

### Frontend (Vue.js)
- **Componente**: `AgendamentoView.vue`
- **Roteamento**: `/agendamento` (protegido)
- **Autenticação**: Requer token JWT válido
- **Armazenamento**: LocalStorage para agendamentos
- **Responsivo**: Funciona em desktop e mobile

### LocalStorage - Estrutura de Dados

#### Agendamento Individual
```javascript
{
  id: "1732567890123",              // Timestamp único
  userId: 1,                         // ID do usuário logado
  quadraIds: [1, 2],                // IDs das quadras selecionadas
  quadraNomes: ["Quadra 1", "Quadra 2"],
  data: "2025-11-25",               // Data no formato YYYY-MM-DD
  hora: "16:00",                    // Horário no formato HH:00
  precoTotal: 80.00,                // Preço calculado
  observacoes: "Aniversário",       // Opcional
  status: "confirmado",             // confirmado | cancelado
  criadoEm: "2025-11-25T14:30:00Z" // ISO timestamp
}
```

### Backend (Node.js/Express)
- **Porta**: `http://localhost:3001`
- **Autenticação**: JWT tokens
- **Endpoints Ativos**:
  - `POST /api/auth/login` - Login
  - `POST /api/auth/register` - Cadastro
  - `GET /api/auth/verify` - Validar token
  - `GET /api/avisos` - Listar avisos
  - `POST /api/avisos` - Criar aviso (admin)
  - `DELETE /api/avisos/:id` - Deletar aviso (admin)

### Regras de Negócio
1. **Horário de Funcionamento**: 8:00 às 23:00
2. **Preços Diferenciados**: 
   - 16:00-18:00: R$ 40,00/quadra
   - Demais horários: R$ 50,00/quadra
3. **Seleção Múltipla**: Permite agendar várias quadras simultaneamente
4. **Verificação de Conflitos**: Impede agendamentos sobrepostos no LocalStorage
5. **Cancelamento**: Usuários podem cancelar (status muda para "cancelado")
6. **Filtro por Usuário**: Cada usuário vê apenas seus agendamentos

## Segurança e Validações

### LocalStorage
- ✅ Filtragem por `userId` - usuário só vê seus agendamentos
- ✅ Validação de disponibilidade antes de confirmar
- ✅ Verificação de conflitos de horário
- ✅ IDs únicos baseados em timestamp
- ✅ Status de agendamento (confirmado/cancelado)

### Frontend
- ✅ Verificação de autenticação via token
- ✅ Redirecionamento para login se não autenticado
- ✅ Validação de formulários
- ✅ Feedback visual de estados (loading, erro, sucesso)
- ✅ Confirmação para cancelamentos
- ✅ Interface intuitiva e responsiva

### Backend (Apenas Autenticação)
- ✅ JWT tokens com expiração
- ✅ Senhas criptografadas (bcrypt)
- ✅ Middleware de autenticação
- ✅ Validação de permissões (admin)

## Vantagens do LocalStorage

### ✅ Prós
- **Performance**: Sem latência de rede
- **Offline First**: Funciona sem internet
- **Simplicidade**: Menos dependências
- **Desenvolvimento Rápido**: Sem necessidade de banco de dados
- **Custo Zero**: Sem infraestrutura de servidor para agendamentos

### ⚠️ Limitações
- **Dados Locais**: Agendamentos não sincronizam entre dispositivos
- **Limite de Armazenamento**: ~5-10MB por domínio
- **Sem Backup**: Limpar cache apaga dados
- **Conflitos**: Dois usuários podem agendar o mesmo horário
- **Sem Analytics**: Dificulta relatórios administrativos

## Navegação no Sistema

### Menu Principal (HomeView.vue)
```
Início | Avisos | Quadras | 📅 Agendamento | Cardápio | Contato
```

### Fluxo de Rotas
```
/auth → /home → /agendamento
  ↑                    ↓
  └────── (logout) ────┘
```

## Próximos Passos (Opcional)

### Migração para Backend
Se decidir migrar agendamentos para banco de dados:

1. **Criar Tabela de Agendamentos**
```sql
CREATE TABLE agendamentos (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  quadra_ids INTEGER[],
  data DATE,
  hora TIME,
  preco_total DECIMAL(10,2),
  observacoes TEXT,
  status VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);
```

2. **Criar Endpoints**
```javascript
GET    /api/agendamentos      // Listar
POST   /api/agendamentos      // Criar
DELETE /api/agendamentos/:id  // Cancelar
```

3. **Atualizar Frontend**
- Substituir métodos `getFromLocalStorage` por `fetch()`
- Manter mesma interface/UX

### Melhorias Sugeridas
1. **Notificações**: Email/SMS de confirmação
2. **Pagamentos**: Integração com gateway
3. **Relatórios**: Dashboard administrativo
4. **Recorrência**: Agendamentos semanais/mensais
5. **Lembretes**: Notificações antes do horário
6. **Sincronização**: Backup em nuvem dos agendamentos

### Funcionalidades Avançadas
1. **Bloqueio de Horários**: Admin pode bloquear horários específicos
2. **Preços Dinâmicos**: Diferentes preços por quadra
3. **Promoções**: Descontos especiais
4. **Lista de Espera**: Para horários ocupados
5. **Avaliações**: Sistema de feedback pós-uso

---

## ✅ Status: **SISTEMA COMPLETO E FUNCIONAL**

O sistema de agendamento está 100% implementado e pronto para uso:

### ✨ Implementado
- ✅ 6 quadras disponíveis
- ✅ Calendário semanal interativo
- ✅ Sistema de preços por horário
- ✅ Cores por disponibilidade
- ✅ Seleção múltipla de quadras
- ✅ **Armazenamento em LocalStorage**
- ✅ Interface responsiva e intuitiva
- ✅ Autenticação via backend

### 🔗 Integração
- **Agendamentos**: LocalStorage (cache do navegador)
- **Autenticação**: Backend + JWT
- **Avisos**: Backend + Banco de Dados
- **Usuários**: Backend + Banco de Dados

**Acesse: http://localhost:5173/agendamento**

---

## 📝 Observações Importantes

1. **LocalStorage é volátil**: Limpar cache do navegador apaga os agendamentos
2. **Não há sincronização**: Cada navegador/dispositivo tem seus próprios dados
3. **Conflitos possíveis**: Múltiplos usuários podem reservar o mesmo horário
4. **Ideal para**: Protótipos, MVPs, uso pessoal
5. **Para produção**: Considere migrar para banco de dados

---

**Última atualização**: Novembro 2025