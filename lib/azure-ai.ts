import { AzureOpenAI } from 'openai';
import { z } from 'zod';
import type { AIWordResponse } from '@/types';

// Initialize Azure OpenAI client
const azureOpenAI = new AzureOpenAI({
    apiKey: process.env.AZURE_OPENAI_API_KEY!,
    endpoint: process.env.AZURE_OPENAI_ENDPOINT!,
    apiVersion: '2024-08-01-preview',
    deployment: process.env.AZURE_OPENAI_DEPLOYMENT_NAME!,
});

// Zod schema for validating AI responses
const AIWordSchema = z.object({
    lemma: z.string(),
    partOfSpeech: z.string(),
    definitions: z.array(
        z.object({
            shortDef: z.string(),
            longDef: z.string().optional(),
            register: z.string().optional(),
            domain: z.string().optional(),
        })
    ),
    examples: z.array(z.string()),
    synonyms: z.array(z.string()),
    antonyms: z.array(z.string()),
    relatedWords: z.array(z.string()),
    etymology: z.string(),
    pronunciation: z.string(),
    syllables: z.array(z.string()),
    tags: z.array(z.string()),
    forms: z.record(z.string(), z.string()).optional(),
    nounForms: z.object({
        singularIndefinit: z.string().optional(),
        singularDefinit: z.string().optional(),
        pluralIndefinit: z.string().optional(),
        pluralDefinit: z.string().optional(),
        genitivDativSingular: z.string().optional(),
        genitivDativPlural: z.string().optional(),
    }).optional(),
    verbForms: z.object({
        infinitiv: z.string().optional(),
        participiu: z.string().optional(),
        gerunziu: z.string().optional(),
        supin: z.string().optional(),
        indicativPrezent: z.object({
            eu: z.string().optional(),
            tu: z.string().optional(),
            el: z.string().optional(),
            noi: z.string().optional(),
            voi: z.string().optional(),
            ei: z.string().optional(),
        }).optional(),
        indicativImperfect: z.object({
            eu: z.string().optional(),
            tu: z.string().optional(),
            el: z.string().optional(),
            noi: z.string().optional(),
            voi: z.string().optional(),
            ei: z.string().optional(),
        }).optional(),
        indicativPerfectSimplu: z.object({
            eu: z.string().optional(),
            tu: z.string().optional(),
            el: z.string().optional(),
            noi: z.string().optional(),
            voi: z.string().optional(),
            ei: z.string().optional(),
        }).optional(),
        indicativPerfectCompus: z.object({
            eu: z.string().optional(),
            tu: z.string().optional(),
            el: z.string().optional(),
            noi: z.string().optional(),
            voi: z.string().optional(),
            ei: z.string().optional(),
        }).optional(),
        indicativMaiMultCaPerfect: z.object({
            eu: z.string().optional(),
            tu: z.string().optional(),
            el: z.string().optional(),
            noi: z.string().optional(),
            voi: z.string().optional(),
            ei: z.string().optional(),
        }).optional(),
        indicativViitor: z.object({
            eu: z.string().optional(),
            tu: z.string().optional(),
            el: z.string().optional(),
            noi: z.string().optional(),
            voi: z.string().optional(),
            ei: z.string().optional(),
        }).optional(),
        conjunctivPrezent: z.object({
            eu: z.string().optional(),
            tu: z.string().optional(),
            el: z.string().optional(),
            noi: z.string().optional(),
            voi: z.string().optional(),
            ei: z.string().optional(),
        }).optional(),
        conjunctivPerfect: z.object({
            eu: z.string().optional(),
            tu: z.string().optional(),
            el: z.string().optional(),
            noi: z.string().optional(),
            voi: z.string().optional(),
            ei: z.string().optional(),
        }).optional(),
        conditionalPrezent: z.object({
            eu: z.string().optional(),
            tu: z.string().optional(),
            el: z.string().optional(),
            noi: z.string().optional(),
            voi: z.string().optional(),
            ei: z.string().optional(),
        }).optional(),
        conditionalPerfect: z.object({
            eu: z.string().optional(),
            tu: z.string().optional(),
            el: z.string().optional(),
            noi: z.string().optional(),
            voi: z.string().optional(),
            ei: z.string().optional(),
        }).optional(),
        imperativ: z.object({
            tu: z.string().optional(),
            voi: z.string().optional(),
        }).optional(),
    }).optional(),
    adjectiveForms: z.object({
        masculinSingular: z.string().optional(),
        femininSingular: z.string().optional(),
        neutruSingular: z.string().optional(),
        plural: z.string().optional(),
    }).optional(),
    translations: z.array(
        z.object({
            language: z.enum(['en', 'fr', 'es', 'de', 'hu']),
            word: z.string(),
            note: z.string().optional(),
        })
    ).optional(),
    collocations: z.array(
        z.object({
            phrase: z.string(),
            meaning: z.string(),
        })
    ).optional(),
    usageNotes: z.array(
        z.object({
            type: z.enum(['grammar', 'register', 'common_mistake', 'context']),
            note: z.string(),
        })
    ).optional(),
    frequencyLevel: z.enum(['very_rare', 'rare', 'common', 'very_common']).optional(),
    difficultyLevel: z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']).optional(),
    isValid: z.boolean(),
    confidence: z.number().min(0).max(1),
});

const ROMANIAN_WORD_ANALYSIS_PROMPT = `Ești un asistent expert pentru analiză de cuvinte românești. Primești un cuvânt și trebuie să-l analizezi COMPLET și în detaliu.

🎯 PRIORITATE MAXIMĂ - INFORMAȚII COMPREHENSIVE:
Acesta este un dicționar profesional educațional la nivel DEX/Merriam-Webster. Furnizează informații COMPLETE și DETALIATE pentru FIECARE secțiune - NU economisi conținut! Mai mult este mai bine. Scopul este să oferim cea mai completă resursă de învățare a limbii române.

IMPORTANT:
1. Verifică dacă cuvântul este valid în limba română
2. **LEMATIZARE OBLIGATORIE**: Câmpul "lemma" trebuie să conțină ÎNTOTDEAUNA forma de dicționar (lemma):
   - Pentru VERBE: forma de INFINITIV cu "a" (ex: dacă primești "lucrai", returnează lemma="a lucra")
   - Pentru SUBSTANTIVE: forma SINGULAR NOMINATIV (ex: dacă primești "cărți", returnează lemma="carte")
   - Pentru ADJECTIVE: forma MASCULIN SINGULAR (ex: dacă primești "frumoasă", returnează lemma="frumos")
   - Dacă utilizatorul a căutat o formă conjugată/declinată, identifică LEMMA și pune-o în câmpul "lemma"
3. **DEFINIȚII COMPREHENSIVE** (minimum 4-8 definiții):
   - Include TOATE sensurile: primar (cel mai comun), secundar, tehnic, figurativ, arhaic, regional
   - Pentru fiecare definiție:
     * "shortDef": definiție concisă (1 propoziție)
     * "longDef": explicație detaliată și cuprinzătoare (2-4 propoziții) cu exemple de context, nuanțe, și utilizări specifice
   - Listează de la sensuri comune la rare
   - Dacă cuvântul funcționează ca mai multe părți de vorbire, notează în definiții
4. **EXEMPLE DIVERSE** (minimum 12-15 exemple variate):
   - 5-7 exemple uzuale/cotidiene (situații comune de zi cu zi)
   - 2-3 exemple context formal/profesional (birou, business, academic)
   - 2-3 exemple informale/colocviale (conversații relaxate)
   - 2-3 expresii idiomatice cu cuvântul
   - 1-2 exemple literare/poetice (dacă aplicabil)
   - Fiecare exemplu trebuie să fie relevant și ilustrativ
5. **SINONIME COMPREHENSIVE** (minimum 10-15 sinonime):
   - Sinonime exacte/perfecte (primele 3-5)
   - Sinonime apropiate cu nuanțe subtile (următoarele 3-5)
   - Alternative contextuale formal/informal (următoarele 2-4)
   - Notează diferențele de utilizare când este relevant
6. **COLOCAȚII COMPREHENSIVE** (minimum 12-15 colocații cu semnificații):
   - Pentru verbe: 5-8 combinații verb + substantiv, verb + prepoziție (ex: "a lucra din greu", "a lucra la")
   - Pentru substantive: 3-5 combinații adjectiv + substantiv, substantiv + substantiv (ex: "cap mare", "capul mesei")
   - Expresii fixe și locuțiuni: 2-3 (ex: "de la cap la coadă")
   - Idiomuri și expresii populare: 2-3 (ex: "a-și bate capul")
   - Fiecare cu semnificație detaliată și context de utilizare
7. **NOTE DE UTILIZARE DETALIATE** (minimum 8-10 note):
   - 2-3 note GRAMATICALE: reguli de conjugare/declinare, forme neregulate, particularități morfologice
   - 2-3 note de REGISTRU: când folosești formal vs informal, variații regionale, utilizare arhaică
   - 2-3 GREȘELI COMUNE: ce greșesc adesea învățătorii sau vorbitorii nativi
   - 2-3 note CONTEXTUALE: când să folosești/eviți, implicații culturale, pragmatică
8. **ETIMOLOGIE DETALIATĂ**: Include originea (latină, slavă, turcă, etc.), evoluția istorică, împrumuturi din alte limbi, transformări fonetice
9. **TRADUCER COMPREHENSIVE** (toate cele 5 limbi obligatoriu): EN, FR, ES, DE, HU - cu note de context când e necesar
7. Returnează ÎNTOTDEAUNA un JSON valid, exact în acest format
8. Dacă cuvântul nu este valid sau nu este românesc, setează "isValid": false și "confidence": 0.0

EXEMPLE DE LEMATIZARE:
- Utilizator caută "lucrai" → lemma: "a lucra" (verb infinitiv)
- Utilizator caută "lucrează" → lemma: "a lucra" (verb infinitiv)
- Utilizator caută "cărți" → lemma: "carte" (substantiv singular)
- Utilizator caută "frumoasă" → lemma: "frumos" (adjectiv masculin)
- Utilizator caută "a lucra" → lemma: "a lucra" (deja lemma)

Format JSON necesar:
{
  "lemma": "forma de dicționar",
  "partOfSpeech": "substantiv|verb|adjectiv|adverb|pronume|prepozitie|conjunctie|interjectie",
  "definitions": [
    {
      "shortDef": "A efectua o activitate profesională sau muncă fizică",
      "longDef": "A desfășura o activitate profesională remunerată, fie într-un cadru formal (la un angajator), fie independent. Include atât munca intelectuală (birou, proiecte), cât și fizică (construcții, agricultură). Termenul este neutru din punct de vedere al registrului și se aplică în orice context profesional sau educațional. Poate implica și munca temporară, sezonieră sau voluntară.",
      "register": "curent",
      "domain": "general"
    },
    {
      "shortDef": "(despre obiecte, mecanisme) A funcționa, a fi în stare de funcționare",
      "longDef": "Se referă la aparate, mașini, sisteme sau mecanisme care își îndeplinesc funcția pentru care au fost create. Termenul indică starea de operare corectă și eficientă.",
      "register": "curent",
      "domain": "tehnic"
    },
    {
      "shortDef": "(fig.) A elabora, a pregăti ceva complex (plan, strategie)",
      "longDef": "Utilizat în sens figurat pentru a descrie procesul de creare, elaborare sau dezvoltare a unor concepte abstracte precum planuri, strategii, proiecte sau idei. Implică efort intelectual și atenție la detalii.",
      "register": "curent",
      "domain": "abstract"
    },
    {
      "shortDef": "(regional) A prelucra, a modifica materii prime",
      "longDef": "În context meșteșugăresc sau industrial, se referă la transformarea materiilor prime în produse finite prin diferite tehnici de prelucrare.",
      "register": "regional",
      "domain": "meșteșuguri"
    }
  ],
  "examples": [
    "Ea lucrează la o companie multinațională din București.",
    "Trebuie să lucrăm împreună pentru a finaliza proiectul.",
    "Am lucrat toată ziua și sunt obosit.",
    "Lucrează ca inginer software de peste 10 ani.",
    "Copiii lucrează la temele pentru școală.",
    "Compania noastră lucrează cu clienți din toată lumea.",
    "Lucrăm în echipă pentru a atinge obiectivele companiei.",
    "Directorul lucrează la planul strategic pentru următorul an.",
    "În weekend, prefer să nu lucrez deloc.",
    "Calculatorul nu lucrează corect, trebuie reparat.",
    "A lucrat din greu toată viața pentru a-și întreține familia.",
    "Lucrează la negru, fără contract de muncă.",
    "A lucrat overtime pentru a termina raportul.",
    "Nu mai lucra în zadar, nimeni nu apreciază eforturile tale.",
    "Lucrau pământul cu trudă, sperând la o recoltă bună."
  ],
  "synonyms": ["a munci", "a lucra", "a se strădui", "a îndeplini", "a efectua", "a desfășura", "a executa", "a opera", "a activa", "a funcționa", "a deservii", "a sluji", "a presta", "a produce", "a realiza"],
  "antonyms": ["antonim1", "antonim2"],
  "relatedWords": ["cuvânt înrudit1", "cuvânt înrudit2"],
  "etymology": "Etimologia cuvântului",
  "pronunciation": "pronunție fonetică",
  "syllables": ["si", "la", "be"],
  "tags": ["neologism", "argou", etc.],
  "forms": {
    "singular": "forma singular (pentru substantive)",
    "plural": "forma plural (pentru substantive)",
    "infinitiv": "forma infinitiv (pentru verbe)"
  },
  "nounForms": {
    "singularIndefinit": "o carte",
    "singularDefinit": "cartea",
    "pluralIndefinit": "niște cărți",
    "pluralDefinit": "cărțile",
    "genitivDativSingular": "cărții",
    "genitivDativPlural": "cărților"
  },
  "verbForms": {
    "infinitiv": "a lucra",
    "participiu": "lucrat",
    "gerunziu": "lucrând",
    "supin": "de lucrat",
    "indicativPrezent": {
      "eu": "lucrez",
      "tu": "lucrezi",
      "el": "lucrează",
      "noi": "lucrăm",
      "voi": "lucrați",
      "ei": "lucrează"
    },
    "indicativImperfect": {
      "eu": "lucram",
      "tu": "lucrai",
      "el": "lucra",
      "noi": "lucram",
      "voi": "lucrați",
      "ei": "lucrau"
    },
    "indicativPerfectCompus": {
      "eu": "am lucrat",
      "tu": "ai lucrat",
      "el": "a lucrat",
      "noi": "am lucrat",
      "voi": "ați lucrat",
      "ei": "au lucrat"
    },
    "indicativMaiMultCaPerfect": {
      "eu": "lucrasem",
      "tu": "lucrasesși",
      "el": "lucrase",
      "noi": "lucrasem",
      "voi": "lucraserăți",
      "ei": "lucraseră"
    },
    "indicativViitor": {
      "eu": "voi lucra",
      "tu": "vei lucra",
      "el": "va lucra",
      "noi": "vom lucra",
      "voi": "veți lucra",
      "ei": "vor lucra"
    },
    "conjunctivPrezent": {
      "eu": "să lucrez",
      "tu": "să lucrezi",
      "el": "să lucreze",
      "noi": "să lucrăm",
      "voi": "să lucrați",
      "ei": "să lucreze"
    },
    "conditionalPrezent": {
      "eu": "aș lucra",
      "tu": "ai lucra",
      "el": "ar lucra",
      "noi": "am lucra",
      "voi": "ați lucra",
      "ei": "ar lucra"
    },
    "imperativ": {
      "tu": "lucrează!",
      "voi": "lucrați!"
    }
  },
  "adjectiveForms": {
    "masculinSingular": "frumos",
    "femininSingular": "frumoasă",
    "neutruSingular": "frumos",
    "plural": "frumoși / frumoase"
  },
  "translations": [
    {"language": "en", "word": "to work", "note": "general meaning for professional activity"},
    {"language": "en", "word": "to function", "note": "for objects/mechanisms"},
    {"language": "fr", "word": "travailler"},
    {"language": "es", "word": "trabajar"},
    {"language": "de", "word": "arbeiten"},
    {"language": "hu", "word": "dolgozni"}
  ],
  "collocations": [
    {"phrase": "a lucra din greu", "meaning": "A munci intens, cu efort mare și dedicare"},
    {"phrase": "a lucra în echipă", "meaning": "A colabora cu alți oameni pentru un scop comun"},
    {"phrase": "a lucra la negru", "meaning": "A munci fără contract legal sau declarație fiscală"},
    {"phrase": "a lucra overtime", "meaning": "A munci peste programul normal de lucru"},
    {"phrase": "a lucra ca un rob", "meaning": "A munci foarte mult, în condiții dificile sau pentru o remunerație mică"},
    {"phrase": "a lucra cu normă întreagă", "meaning": "A avea contract de muncă pentru program complet (8 ore/zi)"},
    {"phrase": "a lucra de acasă", "meaning": "A desfășura activitatea profesională din locuință (remote work)"},
    {"phrase": "a lucra la proiect", "meaning": "A fi angajat pentru o perioadă determinată pe un proiect specific"},
    {"phrase": "a lucra în ture", "meaning": "A avea program de lucru organizat pe schimburi"},
    {"phrase": "munca de birou", "meaning": "Activitate profesională desfășurată într-un spațiu administrativ"},
    {"phrase": "munca manuală", "meaning": "Activitate care necesită efort fizic și abilități practice"},
    {"phrase": "a lucra în zadar", "meaning": "A depune efort fără rezultate sau recunoaștere"},
    {"phrase": "lucru bine făcut", "meaning": "Activitate executată cu calitate și atenție la detalii"},
    {"phrase": "zi de lucru", "meaning": "Zi în care se desfășoară activitate profesională (nu weekend sau sărbătoare)"},
    {"phrase": "contract de muncă", "meaning": "Document legal care stabilește condițiile angajării"}
  ],
  "usageNotes": [
    {"type": "grammar", "note": "Verb de conjugarea I, regulat. Se conjugă cu auxiliarul 'a avea' la timpurile compuse."},
    {"type": "grammar", "note": "Participiul 'lucrat' se folosește atât în timpuri compuse, cât și ca adjectiv (ex: 'un lucru bine lucrat')."},
    {"type": "grammar", "note": "Gerundiul 'lucrând' exprimă simultaneitate sau mod (ex: 'lucrând intens, a terminat rapid')."},
    {"type": "register", "note": "Neutru din punct de vedere al registrului - se folosește în toate contextele: formal, informal, scris, vorbit."},
    {"type": "register", "note": "Expresia 'a lucra la negru' este informală și are conotații negative (ilegal)."},
    {"type": "register", "note": "În context literar elevat, se preferă 'a munci' sau 'a opera' pentru nuanțe stilistice."},
    {"type": "common_mistake", "note": "Greșeală frecventă: 'am lucruit' în loc de 'am lucrat' (confuzie cu verbele de conjugarea a IV-a)."},
    {"type": "common_mistake", "note": "Atenție la diferența: 'lucru' (substantiv - obiect, activitate) vs 'a lucra' (verb - acțiune)."},
    {"type": "context", "note": "Se folosește pentru orice tip de activitate profesională: intelectuală, fizică, artistică, etc."},
    {"type": "context", "note": "În context tehnic, 'a lucra' pentru mașini/aparate înseamnă 'a funcționa corect' (ex: 'motorul lucrează bine')."}
  ],
    {"type": "register", "note": "notă despre registru (ex: formal/informal, regional)"},
    {"type": "common_mistake", "note": "greșeală comună de evitat"},
    {"type": "context", "note": "context de utilizare"}
  ],
  "frequencyLevel": "very_rare|rare|common|very_common (estimează frecvența în limba română vorbită și scrisă)",
  "difficultyLevel": "A1|A2|B1|B2|C1|C2 (nivel CEFR pentru învățători de limba română)",
  "isValid": true,
  "confidence": 0.95
}

INSTRUCȚIUNI DETALIATE pentru câmpurile noi:

1. DECLENSIONS/CONJUGATIONS (FOARTE IMPORTANT - completează în funcție de partea de vorbire):
   
   Pentru SUBSTANTIVE (folosește "nounForms"):
   - "singularIndefinit": forma cu articol nehotărât (ex: "o carte", "un copil")
   - "singularDefinit": forma cu articol hotărât (ex: "cartea", "copilul")
   - "pluralIndefinit": forma plurală cu articol nehotărât (ex: "niște cărți", "niște copii")
   - "pluralDefinit": forma plurală cu articol hotărât (ex: "cărțile", "copiii")
   - "genitivDativSingular": forma de genitiv-dativ singular (ex: "cărții", "copilului")
   - "genitivDativPlural": forma de genitiv-dativ plural (ex: "cărților", "copiilor")
   
   Pentru VERBE (folosește "verbForms"):
   - "infinitiv": forma de infinitiv (ex: "a lucra", "a merge")
   - "participiu": forma de participiu (ex: "lucrat", "mers")
   - "gerunziu": forma de gerunziu (ex: "lucrând", "mergând")
   - "supin": forma de supin (ex: "de lucrat", "de mers")
   
   MODUL INDICATIV (toate timpurile):
   - "indicativPrezent": {eu, tu, el, noi, voi, ei} - conjugarea la prezent
   - "indicativImperfect": {eu, tu, el, noi, voi, ei} - conjugarea la imperfect
   - "indicativPerfectCompus": {eu, tu, el, noi, voi, ei} - cu auxiliar "a avea" (ex: "am lucrat")
   - "indicativMaiMultCaPerfect": {eu, tu, el, noi, voi, ei} - (ex: "lucrasem")
   - "indicativViitor": {eu, tu, el, noi, voi, ei} - cu auxiliar "a vrea" (ex: "voi lucra")
   - "indicativPerfectSimplu": {eu, tu, el, noi, voi, ei} - OPTIONAL, doar pentru verbe foarte comune (ex: "lucrai")
   
   MODUL CONJUNCTIV:
   - "conjunctivPrezent": {eu, tu, el, noi, voi, ei} - cu "să" (ex: "să lucrez")
   - "conjunctivPerfect": {eu, tu, el, noi, voi, ei} - cu "să" + auxiliar (ex: "să fi lucrat")
   
   MODUL CONDITIONAL:
   - "conditionalPrezent": {eu, tu, el, noi, voi, ei} - cu auxiliar condițional (ex: "aș lucra")
   - "conditionalPerfect": {eu, tu, el, noi, voi, ei} - (ex: "aș fi lucrat")
   
   MODUL IMPERATIV:
   - "imperativ": {tu, voi} - forma de imperativ (ex: "lucrează!", "lucrați!")
   
   IMPORTANT pentru verbe: Generează TOATE timpurile și modurile pentru a oferi conjugare completă!
   
   Pentru ADJECTIVE (folosește "adjectiveForms"):
   - "masculinSingular": forma masculin singular (ex: "frumos", "mare")
   - "femininSingular": forma feminin singular (ex: "frumoasă", "mare")
   - "neutruSingular": forma neutru singular (ex: "frumos", "mare")
   - "plural": forma plurală pentru toate genurile (ex: "frumoși / frumoase", "mari")

2. TRANSLATIONS (obligatoriu pentru toate cuvintele valide):
   - Oferă traduceri precise în toate cele 5 limbi: EN, FR, ES, DE, HU
   - Alege traducerea cea mai comună și potrivită pentru sensul PRINCIPAL
   - Adaugă "note" doar dacă traducerea necesită context (ex: "formal" sau "când se referă la...")

3. COLLOCATIONS (oferă 3-5 expresii comune):
   - Include expresii naturale și frecvente care conțin cuvântul
   - Evită combinații rare sau forțate
   - Exemple: pentru "carte" → "carte de vizită", "la carte", "carte de identitate"

3. USAGENOTES (oferă 2-4 notițe utile):
   - "grammar": informații gramaticale importante (gen, număr, aspect verbal, etc.)
   - "register": specifică dacă e formal/informal, argou, arhaic, regional
   - "common_mistake": greșeli frecvente de evitat (ex: confuzii cu alte cuvinte)
   - "context": în ce contexte se folosește (situații specifice, expresii idiomatice)

4. FREQUENCYLEVEL (estimează realist):
   - "very_common": cuvinte de bază (ex: "a fi", "casă", "bun")
   - "common": cuvinte uzuale (ex: "bibliotecă", "a explica")
   - "rare": cuvinte mai puțin folosite (ex: "melancolic", "a reaminti")
   - "very_rare": cuvinte rare, arhaice, tehnice (ex: "paroxism", "a zădărnici")

5. DIFFICULTYLEVEL (nivel CEFR pentru învățători):
   - A1-A2: cuvinte de bază și comune
   - B1-B2: vocabular intermediar
   - C1-C2: vocabular avansat, abstract, specialized

EXEMPLU: Pentru "cap" - include toate sensurile:
- "Partea superioară a corpului omenesc" (sens principal)
- "Promontoriu, extremitate de uscat" (sens geografic)
- "Capăt, extremitate" (sens general)
- "(fig.) Persoană conducătoare, șef" (sens figurat)

Analizează COMPLET cuvântul următor, incluzând TOATE sensurile sale:`;

export async function analyzeWordWithAI(word: string): Promise<AIWordResponse | null> {
    try {
        const response = await azureOpenAI.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: ROMANIAN_WORD_ANALYSIS_PROMPT,
                },
                {
                    role: 'user',
                    content: word,
                },
            ],
            model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME!,
            temperature: 0.3,
            max_tokens: 16000,
            response_format: { type: 'json_object' },
        });

        const content = response.choices[0]?.message?.content;
        if (!content) {
            console.error('No content in AI response');
            return null;
        }

        // Parse and validate the JSON response
        const parsed = JSON.parse(content);
        const validated = AIWordSchema.parse(parsed);

        return validated as AIWordResponse;
    } catch (error) {
        console.error('Error analyzing word with AI:', error);
        return null;
    }
}

// Rate limiting cache (simple in-memory cache)
const rateLimitCache = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(userId: string, maxRequests: number = 50): boolean {
    const now = Date.now();
    const userLimit = rateLimitCache.get(userId);

    if (!userLimit || userLimit.resetAt < now) {
        // Reset daily at midnight
        const tomorrow = new Date();
        tomorrow.setHours(24, 0, 0, 0);

        rateLimitCache.set(userId, {
            count: 1,
            resetAt: tomorrow.getTime(),
        });
        return true;
    }

    if (userLimit.count >= maxRequests) {
        return false;
    }

    userLimit.count++;
    return true;
}

export function getRemainingRequests(userId: string, maxRequests: number = 50): number {
    const userLimit = rateLimitCache.get(userId);
    if (!userLimit || userLimit.resetAt < Date.now()) {
        return maxRequests;
    }
    return Math.max(0, maxRequests - userLimit.count);
}
