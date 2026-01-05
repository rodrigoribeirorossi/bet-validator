# ⚽ Bet Validator - Sistema Validador de Apostas Esportivas

Sistema completo de validação de apostas esportivas com análise matemática, gestão de banca e cálculos de value bet.

![Home Page](https://github.com/user-attachments/assets/bbc1d883-2fcb-4fcd-b226-f2db9874e6ed)

## 🚀 Funcionalidades

### 6 Tipos de Validadores

1. **Resultado 1X2 (Moneyline)** - Validar apostas de resultado final
2. **Over/Under Gols** - Validar apostas de mais/menos gols usando distribuição de Poisson
3. **Ambas Marcam (BTTS)** - Validar se ambos os times marcarão
4. **Handicap Asiático** - Validar apostas com vantagem/desvantagem de gols
5. **Escanteios** - Validar Over/Under em escanteios
6. **Cartões** - Validar Over/Under em cartões (incluindo dados do árbitro)

![Validators Selection](https://github.com/user-attachments/assets/cc896d56-c28e-4826-b0f2-809dce6570ee)

### Cálculos Matemáticos Implementados

Para cada validação, o sistema calcula:

- ✅ **Probabilidade Implícita** - Baseada nas odds oferecidas
- ✅ **Probabilidade Calculada** - Baseada nas estatísticas inseridas
- ✅ **Value Bet** - `Value = (Probabilidade Real × Odds) - 1`
- ✅ **Edge (Vantagem)** - Diferença entre probabilidade calculada e implícita
- ✅ **Odds Justas** - Odds que representam a probabilidade real
- ✅ **Stake Recomendado** - Usando Critério de Kelly (Quarter Kelly)
- ✅ **EV (Expected Value)** - Valor esperado da aposta
- ✅ **ROI Esperado** - Retorno sobre investimento

![Validation Result](https://github.com/user-attachments/assets/7e680c3e-9a04-4680-8ffd-e7c09eaf53a4)

### Gestão de Banca

- Configurar valor da banca
- Registrar depósitos e saques
- Visualizar histórico de transações
- Acompanhar lucro/prejuízo

### Histórico de Validações

- Listar todas as validações anteriores
- Filtrar por tipo de aposta
- Visualizar recomendações e resultados
- Acompanhar apostas ganhas/perdidas

### Interface Moderna

- 🎨 **Tema Claro/Escuro** - Alternância entre temas
- 📱 **Responsivo** - Mobile, tablet e desktop
- ♿ **Acessível** - WCAG 2.1 compliance
- 🎯 **Animações Suaves** - Framer Motion
- 🎨 **Design System** - shadcn/ui + Tailwind CSS

![Dark Theme](https://github.com/user-attachments/assets/2ceb31d2-5195-4539-8824-ede50e0cc5cd)

## 🛠️ Stack Técnica

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** - Componentes acessíveis
- **Radix UI** - Primitivos de UI
- **Framer Motion** - Animações
- **Recharts** - Gráficos
- **Zustand** - Gerenciamento de estado
- **React Hook Form + Zod** - Validação de formulários

## 📦 Instalação

### Pré-requisitos

- Node.js 18.0 ou superior
- npm ou yarn

### Passos de Instalação

1. Clone o repositório:
```bash
git clone https://github.com/rodrigoribeirorossi/bet-validator.git
cd bet-validator
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Execute o servidor de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```

4. Abra [http://localhost:3000](http://localhost:3000) no seu navegador

### Build para Produção

```bash
npm run build
npm start
# ou
yarn build
yarn start
```

## 📖 Como Usar

### 1. Escolha o Validador

Acesse a página de validadores e selecione o tipo de aposta que deseja validar.

### 2. Insira os Dados

Preencha o formulário com:
- Informações dos times
- Odds oferecidas pela casa de apostas
- Estatísticas relevantes (vitórias, derrotas, gols, etc.)
- Valor da sua banca

### 3. Analise o Resultado

O sistema calculará automaticamente:
- Se a aposta tem value positivo
- Quanto você deve apostar (Kelly Criterion)
- Qual o valor esperado (EV)
- Recomendação clara: 🔥 APOSTAR FORTE | ✅ APOSTAR | ⚠️ CAUTELA | ❌ EVITAR

## 🧮 Fórmulas Matemáticas

### Value Bet
```
Value = (Probabilidade_Real × Odds) - 1
Se Value > 0 → É Value Bet
```

### Critério de Kelly (Quarter Kelly)
```
Kelly% = (p × b - q) / b
onde: p = probabilidade real, q = 1-p, b = odds-1
Stake = Banca × (Kelly% / 4)
```

### Distribuição de Poisson (Over/Under)
```
P(X = k) = (e^(-λ) × λ^k) / k!
P(Over n) = 1 - Σ P(X = k) para k de 0 até n
```

## 📁 Estrutura do Projeto

```
bet-validator/
├── app/
│   ├── layout.tsx              # Layout principal
│   ├── page.tsx                # Home/Dashboard
│   ├── validador/              # Páginas de validadores
│   │   ├── page.tsx            # Seleção de validador
│   │   ├── resultado-1x2/      # Validador 1X2
│   │   ├── over-under/         # Validador Over/Under
│   │   ├── btts/               # Validador BTTS
│   │   ├── handicap/           # Validador Handicap
│   │   ├── escanteios/         # Validador Escanteios
│   │   └── cartoes/            # Validador Cartões
│   ├── banca/                  # Gestão de banca
│   └── historico/              # Histórico de validações
├── components/
│   ├── ui/                     # Componentes shadcn/ui
│   ├── layout/                 # Header, Sidebar
│   └── validador/              # Componentes de validação
├── lib/
│   ├── validador.ts            # Lógica de validação
│   └── utils.ts                # Funções utilitárias
├── store/
│   └── index.ts                # Zustand store
└── types/
    └── index.ts                # TypeScript types
```

## 🎯 Próximas Funcionalidades

- [ ] Integração com APIs de estatísticas
- [ ] Gráficos de evolução de banca
- [ ] Exportar histórico para CSV
- [ ] Calculadora de probabilidades avançada
- [ ] Sistema de notificações
- [ ] Múltiplas bancas
- [ ] Comparação de odds entre casas

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abrir um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Autor

**Rodrigo Ribeiro Rossi**

- GitHub: [@rodrigoribeirorossi](https://github.com/rodrigoribeirorossi)

## ⚠️ Aviso Legal

Este sistema é uma ferramenta de análise matemática para fins educacionais. Não incentivamos apostas e não nos responsabilizamos por perdas financeiras. Aposte com responsabilidade.

---

⭐ Se este projeto foi útil para você, considere dar uma estrela no GitHub!
