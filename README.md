# DEXAI.ro - Dicționar Românesc cu Inteligență Artificială 🧠🇷🇴

Un dicționar colaborativ românesc alimentat de inteligență artificială, unde utilizatorii descoperă cuvinte noi, câștigă puncte și contribuie la cel mai mare dicționar românesc colaborativ.

## 🌟 Caracteristici

- **Căutare inteligentă de cuvinte** cu generare automată de definiții prin GPT-4o
- **Gamificare** - primești puncte pentru descoperirea de cuvinte noi
- **Clasament în timp real** - competiție între utilizatori
- **Definiții complete** - sinonime, antonime, etimologie, exemple de utilizare
- **Contribuții comunitare** - adaugă exemple, sinonime, raportează erori
- **Autentificare Google** - acces rapid și sigur

## 🛠️ Stack Tehnologic

- **Framework**: Next.js 15+ (App Router)
- **Styling**: Tailwind CSS 3
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth (Google Provider)
- **AI**: Azure OpenAI GPT-4o
- **Language**: TypeScript
- **Deployment**: Vercel (recomandat)

## 📁 Structura Proiectului

```
dexai/
├── app/                      # Next.js App Router
│   ├── api/                  # API Routes
│   │   ├── search/           # Endpoint căutare cuvinte
│   │   └── leaderboard/      # Endpoint clasament
│   ├── cuvant/[slug]/        # Pagină detalii cuvânt
│   ├── top/                  # Pagină clasament complet
│   ├── user/[uid]/           # Pagină profil utilizator
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Homepage
│   └── globals.css           # Global styles
├── components/               # React Components
│   ├── SearchBar.tsx
│   ├── LeaderboardTable.tsx
│   ├── WordHeader.tsx
│   ├── DefinitionsList.tsx
│   ├── SynonymsBlock.tsx
│   ├── ContributionsCard.tsx
│   ├── UserAvatar.tsx
│   ├── WordOfTheDay.tsx
│   └── StatsCard.tsx
├── lib/                      # Utilities & Services
│   ├── firebase.ts           # Firebase client config
│   ├── firebase-admin.ts     # Firebase Admin SDK
│   ├── azure-ai.ts           # Azure OpenAI integration
│   ├── normalize-word.ts     # Word normalization utilities
│   ├── points.ts             # Gamification logic
│   ├── validation.ts         # Zod schemas
│   ├── utils.ts              # General utilities
│   └── auth-context.tsx      # Authentication context
├── types/                    # TypeScript definitions
│   └── index.ts
└── .env.example              # Environment variables template
```

## 🚀 Pornire Rapidă

### 1. Clonează repository-ul

```bash
git clone https://github.com/your-username/dexai.git
cd dexai
```

### 2. Instalează dependențele

```bash
npm install
# sau
pnpm install
# sau
yarn install
```

### 3. Configurează variabilele de mediu

Copiază `.env.example` în `.env.local` și completează valorile:

```bash
cp .env.example .env.local
```

Editează `.env.local` cu credențialele tale:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin (JSON escapate)
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}

# Azure OpenAI
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_KEY=your_key
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4o

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
MAX_DAILY_DISCOVERIES=50
```

### 4. Configurează Firebase

1. Creează un proiect pe [Firebase Console](https://console.firebase.google.com/)
2. Activează Authentication cu Google Provider
3. Creează o bază de date Firestore
4. Descarcă Service Account Key pentru Firebase Admin SDK
5. Configurează regulile Firestore (vezi mai jos)

### 5. Configurează Azure OpenAI

1. Creează un resurse Azure OpenAI
2. Deploy modelul GPT-4o
3. Copiază endpoint-ul și API key-ul

### 6. Pornește aplicația

```bash
npm run dev
```

Aplicația va rula la `http://localhost:3000`

## 🔥 Reguli Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Words collection
    match /words/{wordId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
    }
    
    // Contributions collection
    match /contributions/{contributionId} {
      allow read: if true;
      allow create: if request.auth != null;
    }
    
    // Search logs
    match /searchLogs/{logId} {
      allow read: if false;
      allow create: if true;
    }
    
    // Flags
    match /flags/{flagId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
    }
  }
}
```

## 📊 Structura Bazei de Date

### Collection: `users`
- `uid`: string (User ID)
- `displayName`: string
- `photoURL`: string | null
- `email`: string
- `createdAt`: timestamp
- `totalPoints`: number
- `dailyPoints`: number
- `wordsDiscovered`: number
- `lastLoginAt`: timestamp

### Collection: `words`
- `id`: string (normalized word)
- `lemma`: string
- `display`: string
- `partOfSpeech`: string
- `definitions`: array
- `examples`: array
- `synonyms`: array
- `antonyms`: array
- `relatedWords`: array
- `pronunciation`: string
- `syllables`: array
- `etymology`: string
- `tags`: array
- `createdAt`: timestamp
- `createdBy`: 'ai' | 'user' | 'import'
- `createdByUserId`: string
- `verified`: boolean

### Collection: `contributions`
- `userId`: string
- `wordId`: string
- `type`: 'discovery' | 'example_add' | 'synonym_add' | 'antonym_add'
- `points`: number
- `createdAt`: timestamp

## 🎮 Sistemul de Gamificare

### Puncte acordate:
- **+1 punct**: Descoperirea unui cuvânt nou valid
- **+0.5 puncte**: Adăugare de exemplu bun
- **+0.5 puncte**: Adăugare de sinonim/antonim valid
- **0 puncte**: Raportare de eroare (important pentru calitate)

### Reguli anti-spam:
- Limită de **50 descoperiri/zi** per utilizator
- Confidence AI minim de **0.7** pentru cuvinte noi
- Rate limiting: max **5 descoperiri/minut**
- Verificare duplicate per utilizator

## 🔐 Securitate

- Autentificare obligatorie pentru puncte și contribuții
- Validare server-side a tuturor input-urilor
- Rate limiting pe API-uri
- Sanitizare automată a conținutului generat de utilizatori
- Firebase Admin SDK pentru operațiuni sensibile

## 📈 Optimizări

- **SSR** pentru SEO (pagini cuvinte și homepage)
- **Client-side caching** pentru căutări recente
- **Indexed queries** în Firestore pentru performance
- **CDN** pentru asset-uri statice
- **Lazy loading** pentru componente non-critice

## 🚀 Deployment

### Vercel (Recomandat)

```bash
npm run build
vercel deploy
```

Setează variabilele de mediu în Vercel Dashboard.

### Docker (Opțional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🧪 Testing

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build test
npm run build
```

## 📝 Roadmap

- [ ] Sistem de moderare pentru cuvinte
- [ ] Export/backup automat Firestore
- [ ] PWA support pentru offline
- [ ] Telemetrie și analytics
- [ ] API public pentru dezvoltatori
- [ ] Mobile app (React Native)
- [ ] Învățare prin spaced repetition
- [ ] Integrare cu alte dicționare

## 🤝 Contribuții

Contribuțiile sunt binevenite! Te rugăm să:
1. Fork repository-ul
2. Creează un branch pentru feature-ul tău
3. Commit cu mesaje clare
4. Push și creează un Pull Request

## 📄 Licență

MIT License - vezi [LICENSE](LICENSE) pentru detalii.

## 👥 Echipa

Dezvoltat cu ❤️ pentru limba română.

## 📞 Contact

Pentru întrebări și suport: contact@dexai.ro

---

**DEXAI.ro** - Descoperă limba română cu ajutorul inteligenței artificiale! 🇷🇴✨
