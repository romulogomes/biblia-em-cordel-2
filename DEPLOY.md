# Bíblia em Cordel — Guia de Deploy

Este projeto tem **dois alvos de deploy**:

- **Web** (`artifacts/web`) — site estático servido via Replit Deployments (ou qualquer host estático).
- **Mobile** (`artifacts/mobile`) — app Expo / React Native, publicado na App Store (iOS) e Google Play (Android) via EAS Build.

---

## 1. Pré-requisitos (uma vez só, na sua máquina)

Você precisa ter instalado:

- **Node.js 20+** — [nodejs.org](https://nodejs.org)
- **pnpm 9+** — `npm install -g pnpm`

Depois, descompacte o zip e instale as dependências:

```bash
unzip biblia-em-cordel.zip -d biblia-em-cordel
cd biblia-em-cordel
pnpm install
```

A primeira instalação demora 3-5 minutos (baixa Expo SDK + React Native).

---

## 2. Rodar localmente

### Web (preview rápido no navegador)

```bash
cd artifacts/web
PORT=3000 BASE_PATH=/ pnpm run dev
```

Abre em [http://localhost:3000](http://localhost:3000).

> A primeira vez demora ~30s porque ele faz o build do Expo Web. Mudanças no código exigem reiniciar o comando.

### Mobile (preview no celular via Expo Go)

```bash
cd artifacts/mobile
pnpm exec expo start
```

Aparece um QR code no terminal. Baixe o app **Expo Go** no celular ([App Store](https://apps.apple.com/app/expo-go/id982107779) / [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)) e escaneie.

---

## 3. Deploy do **Web**

Você tem 3 opções, em ordem de facilidade:

### Opção A — Replit Deployments (mais simples)

Como você já fez o deploy daqui, **já está no ar**. Toda vez que quiser republicar com mudanças, basta reabrir o projeto no Replit e clicar em "**Publish**" novamente.

### Opção B — Vercel / Netlify / Cloudflare Pages

1. Suba o projeto pra GitHub.
2. Conecte o repositório no [Vercel](https://vercel.com) (ou Netlify).
3. Configure:
   - **Build command**: `pnpm install && pnpm --filter @workspace/web run build`
   - **Output directory**: `artifacts/web/dist/public`
   - **Root directory**: deixe vazio (raiz do repo).

### Opção C — qualquer host estático (S3, Nginx, etc.)

```bash
pnpm --filter @workspace/web run build
```

Pega tudo que está em `artifacts/web/dist/public/` e joga no servidor estático. Configure SPA fallback (qualquer rota desconhecida → `/index.html`).

> **Importante:** o app foi configurado com `experiments.baseUrl = "/web"` em `artifacts/mobile/app.json`. Se for hospedar na **raiz do domínio** (ex: `biblia.com.br/`), abra esse arquivo e troque `"baseUrl": "/web"` por `"baseUrl": "/"`, depois rode o build de novo.

---

## 4. Deploy do **Mobile** (App Store + Google Play)

### 4.1 Crie as contas (uma vez só)

| Conta | Custo | Onde |
|---|---|---|
| **Apple Developer** | US$ 99/ano | [developer.apple.com/programs](https://developer.apple.com/programs) |
| **Google Play Console** | US$ 25 (único) | [play.google.com/console](https://play.google.com/console) |
| **Expo (EAS)** | Grátis | [expo.dev/signup](https://expo.dev/signup) |

### 4.2 Logue no EAS

```bash
cd artifacts/mobile
npx eas-cli login           # usa sua conta Expo
npx eas-cli init            # cria/vincula o projeto na sua conta Expo
```

O `eas init` cria um `projectId` único e adiciona em `app.json` (faça commit dessa mudança).

### 4.3 Verifique o `app.json`

Abra `artifacts/mobile/app.json` e confirme:

- `"bundleIdentifier": "com.bibliaemcordel.app"` (iOS) — **se já existir esse ID na App Store, troque pra algo único como `com.seusobrenome.bibliaemcordel`**.
- `"package": "com.bibliaemcordel.app"` (Android) — mesma regra acima.

### 4.4 Build na nuvem do EAS (~15-20 min cada)

```bash
# Build de produção
npx eas-cli build -p ios --profile production
npx eas-cli build -p android --profile production
```

Na primeira vez ele vai te perguntar:

- **iOS**: "Generate a new Apple Distribution Certificate?" → **Yes**. Depois pede pra você logar com sua conta Apple Developer (faça login no terminal). Ele cria certificado, perfil de provisionamento, tudo automático.
- **Android**: "Generate a new Android Keystore?" → **Yes**. Ele cria a keystore e guarda na nuvem do EAS (super importante — **nunca perca** essa keystore, sem ela você não consegue mais atualizar o app no Play).

Quando terminar, ele mostra um link `https://expo.dev/accounts/.../builds/...` com os arquivos prontos:
- iOS: `.ipa`
- Android: `.aab`

### 4.5 Submeter pras lojas

```bash
npx eas-cli submit -p ios --latest
npx eas-cli submit -p android --latest
```

- **iOS**: pede credenciais da App Store Connect. Sobe o `.ipa` automaticamente. Depois você entra em [appstoreconnect.apple.com](https://appstoreconnect.apple.com), vai na build que apareceu, preenche descrição/screenshots/política de privacidade e clica em "Submit for Review". A Apple revisa em **1-3 dias**.
- **Android**: na primeira submissão você precisa criar o app no [Play Console](https://play.google.com/console) primeiro (preencher descrição, screenshots, content rating, política de privacidade). Depois o `eas submit` joga o `.aab` na faixa **internal testing**. De lá você promove pra produção. Google geralmente aprova em **algumas horas**.

### 4.6 Atualizar versão (toda vez que for relançar)

Antes de cada novo build de produção, abra `artifacts/mobile/app.json` e incremente:

- `"version": "1.0.0"` → `"1.0.1"` (mostrado na loja, semantic versioning)

O `eas.json` está com `"autoIncrement": true` na produção, então o `buildNumber` (iOS) e `versionCode` (Android) sobem automáticos. Você só precisa mexer no `version`.

---

## 5. Material que as lojas pedem (prepare antes)

Para ambas as lojas você vai precisar:

- **Ícone**: já está em `artifacts/mobile/assets/images/icon.png` (1024×1024, ok pras duas lojas).
- **Screenshots**:
  - **iOS**: pelo menos 1 do iPhone 6.7" (1290×2796) e 1 do iPhone 6.5" (1242×2688). Tira no simulador ou num iPhone real.
  - **Android**: pelo menos 2 screenshots de telefone (mín 320px no menor lado, máx 3840px).
- **Descrição curta** (Android, 80 caracteres máx) e **descrição longa** (4000 caracteres).
- **Política de privacidade**: URL pública obrigatória. Como o app **não coleta dados** (só armazena marcadores no celular), pode ser uma página simples dizendo isso. Existem geradores grátis tipo [app-privacy-policy-generator.firebaseapp.com](https://app-privacy-policy-generator.firebaseapp.com).
- **Classificação etária** (questionário no Play Console / App Store Connect — bem rápido).
- **Conta de e-mail de suporte**.

---

## 6. Estrutura do projeto (referência rápida)

```
biblia-em-cordel/
├── artifacts/
│   ├── mobile/         # App Expo (fonte da verdade — código compartilhado entre mobile e web)
│   │   ├── app/        # Telas (expo-router)
│   │   ├── components/
│   │   ├── constants/  # bibleData.ts (40 livros AT, 880 capítulos)
│   │   ├── app.json    # ← ajustes de iOS/Android aqui
│   │   └── eas.json    # ← perfis de build EAS
│   ├── web/            # Wrapper que faz expo export -p web e serve estático
│   ├── api-server/     # API Express (não usada no app cordel, parte do scaffold)
│   └── mockup-sandbox/ # Sandbox de design (uso interno)
├── lib/                # Bibliotecas compartilhadas (não usadas pelo cordel)
├── package.json
└── pnpm-workspace.yaml
```

> O `api-server`, `mockup-sandbox` e `lib/*` vieram do template do monorepo. **Você pode deletar tudo isso** se quiser deixar o repositório só com o que importa pro app cordel — basta apagar essas pastas e remover do `pnpm-workspace.yaml`.

---

## 7. Comandos úteis

```bash
# Typecheck do projeto inteiro
pnpm run typecheck

# Build do web pra produção
pnpm --filter @workspace/web run build

# Limpar caches (se algo estranho acontecer)
rm -rf node_modules artifacts/*/node_modules artifacts/web/dist artifacts/mobile/.expo
pnpm install

# Atualizar Expo SDK (cuidado, pode quebrar coisas)
cd artifacts/mobile
npx expo install --fix
```

---

## 8. Suporte / dúvidas

- Documentação Expo: [docs.expo.dev](https://docs.expo.dev)
- EAS Build: [docs.expo.dev/build/introduction](https://docs.expo.dev/build/introduction)
- Submeter pra App Store: [docs.expo.dev/submit/ios](https://docs.expo.dev/submit/ios)
- Submeter pro Google Play: [docs.expo.dev/submit/android](https://docs.expo.dev/submit/android)
