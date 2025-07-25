# Frontend Coordenador App

> Aplicativo mobile desenvolvido com **Expo** para Android e iOS, permitindo agendamento de reuniões, login de alunos e professores e integração com o backend.

---

## 🚀 Visão Geral

Este repositório contém o cliente mobile do **Coordenador App**, com funcionalidades:

- Autenticação (login, registro, confirmação por e-mail)
- Requisições às rotas do backend (Meetings, Schedule, Users)
- Perfil de usuário (aluno/professor) com permissões
- Upload de arquivos (ex: avatar) e visualização de logos
- Agendamento de horários e notificações in-app

---

## 🛠 Tecnologias e Ferramentas

- **React Native** com **Expo SDK 48+**
- **TypeScript**
- **React Navigation** (stack e bottom-tabs)
- **Axios** para chamadas HTTP
- **Context API** ou **Redux Toolkit** (conforme implementado)
- **Expo EAS** para builds e publicação

---

## 📁 Estrutura do Projeto

```plaintext
src/
├─ assets/           # Imagens, fontes e ícones
├─ components/       # Componentes reutilizáveis
├─ hooks/            # Custom hooks
├─ navigation/       # Pilhas e abas de navegação
├─ screens/          # Telas (Login, Home, Profile, Meeting, Schedule, Settings)
├─ services/         # Configuração do Axios e chamadas de API
├─ store/            # (Redux) Slices e store configuration
├─ utils/            # Utilitários e helper functions
└─ App.tsx           # Ponto de entrada do Expo
```

---

## 📥 Instalação e Setup Local

1. Clone o repositório:
   ```bash
   git clone https://github.com/SergioRPAguiar/coordenador-app.git
   cd coordenador-app
   ```
2. Instale dependências:
   ```bash
   yarn install
   # ou
   npm install
   ```
3. Configure as variáveis de ambiente em um arquivo `app.config.js` ou `.env` (conforme projeto):
   ```js
   export default {
     expo: {
       name: 'CoordenadorApp',
       slug: 'coordenador-app',
       extra: {
         apiUrl: process.env.API_URL || 'http://localhost:3000',
       },
       // outras configurações...
     }
   }
   ```
4. Inicie o servidor Metro:
   ```bash
   expo start
   ```

---

## 🔨 Scripts Básicos

| Comando                         | Descrição                               |
| ------------------------------- | --------------------------------------- |
| `expo start`                    | Abre o Metro Bundler                    |
| `expo run:android`              | Constrói e roda no dispositivo/emulador |
| `expo run:ios`                  | Constrói e abre no simulador iOS        |
| `eas build --platform android`  | Build de APK/AAB via EAS                |
| `eas build --platform ios`      | Build de IPA via EAS                    |
| `eas submit --platform android` | Publica no Google Play                  |
| `eas submit --platform ios`     | Publica no App Store Connect            |

---

## 📱 Gerando APK e AAB Android

1. Configure seu `eas.json` com credenciais e profiles:
   ```json
   {
     "build": {
       "production": {
         "android": { "buildType": "apk" },
         "ios": { "simulator": false }
       }
     }
   }
   ```
2. Faça login no EAS:
   ```bash
   eas login
   ```
3. Rode o build Android:
   ```bash
   eas build --platform android --profile production
   ```
4. Ao finalizar, baixe o .apk ou .aab pelo link fornecido.

---

## 🍏 Gerando IPA e Publicando iOS

1. No `eas.json`, defina:
   ```json
   "ios": {
     "production": {
       "buildType": "archive",
       "credentialsSource": "remote"
     }
   }
   ```
2. Faça login no Apple:
   ```bash
   eas login
   eas credentials
   ```
3. Build para iOS:
   ```bash
   eas build --platform ios --profile production
   ```
4. Após sucesso, envie para a App Store:
   ```bash
   eas submit --platform ios
   ```

---

## 🎨 Customização de Tema

- Altere cores em `src/theme` (ou onde definido)
- Importe fontes em `assets/fonts` e registre no `App.tsx`

---

## 🧪 Testes

*(Se aplicável: Jest, Detox, etc.)*

---

## 🤝 Contribuição

1. Fork do projeto
2. Nova branch: `git checkout -b feat/minha-feature`
3. Commit e push
4. Abra um Pull Request

---

## 📝 Licença

MIT © Sergio Aguiar

---

> Aproveite o desenvolvimento e consulte o backend para detalhes de API! 🚀

