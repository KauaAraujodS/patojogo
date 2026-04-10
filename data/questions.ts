export type QuizLevel = "beginner" | "intermediate" | "advanced";

export type QuizLevelSlug = "iniciante" | "intermediario" | "avancado";

export type QuizQuestionType =
  | "multiple-choice"
  | "image-identification"
  | "true-false"
  | "matching"
  | "ordering"
  | "open-ended";

export type QuizReviewFilter = "all" | "correct" | "incorrect" | "skipped";

export type QuizCategory =
  | "fissuras"
  | "corrosao"
  | "infiltracao"
  | "descolamento"
  | "outros";

export type QuizAnswerValue =
  | number
  | boolean
  | string
  | number[]
  | Array<[number, number]>
  | null;

export type QuizQuestion = {
  id: string;
  level: QuizLevel;
  type: QuizQuestionType;
  category: QuizCategory;
  difficulty: 1 | 2 | 3 | 4 | 5;
  question: string;
  options?: string[];
  correctAnswer?: number | boolean | string | number[];
  pairs?: Array<{ left: string; right: string }>;
  correctPairs?: Array<[number, number]>;
  items?: string[];
  correctOrder?: number[];
  image?: string | null;
  illustration?: string | null;
  explanation: string;
  references?: string[];
  points: number;
  coinReward: number;
  hints?: string[];
  tags: string[];
  keywords?: string[];
  minLength?: number;
};

export type QuizCategoryProgress = {
  accuracy: number;
  correct: number;
  total: number;
};

export type QuizCompletedQuestion = {
  attemptDate: string;
  earnedCoins: number;
  earnedPoints: number;
  hintsUsed: number;
  isCorrect: boolean;
  questionCategory: QuizCategory;
  questionId: string;
  questionType: QuizQuestionType;
  skipped: boolean;
  timeSpent: number;
  userAnswer: QuizAnswerValue;
};

export type QuizLevelProgress = {
  averageAccuracy: number;
  bestScore: number;
  categoryStats: Partial<Record<QuizCategory, QuizCategoryProgress>>;
  completedCount: number;
  completedQuestions: QuizCompletedQuestion[];
  completionPercentage: number;
  correctCount: number;
  incorrectCount: number;
  lastAttemptDate: string | null;
  skippedCount: number;
  totalCoins: number;
  totalQuestions: number;
  totalScore: number;
};

export type QuizProgressSnapshot = {
  achievements: QuizAchievement[];
  levelProgress: Record<QuizLevel, QuizLevelProgress>;
  unlockedLevels: QuizLevel[];
  userId: string;
};

export type QuizReviewItem = {
  correctAnswerLabel?: string;
  explanation: string;
  isCorrect: boolean;
  questionId: string;
  questionText: string;
  selectedAnswerLabel: string;
  type: QuizQuestionType;
};

export type QuizAchievement = {
  description: string;
  icon: string;
  id: string;
  label: string;
  unlockedAt: string;
};

export type QuizAttemptSummary = {
  accuracy: number;
  bestCategory: string | null;
  categoryToReview: string | null;
  correctCount: number;
  earnedCoins: number;
  earnedPoints: number;
  incorrectCount: number;
  level: QuizLevel;
  skippedCount: number;
  stars: number;
  timePerQuestion: number;
  totalQuestions: number;
  totalTimeInSeconds: number;
};

export type QuizAttemptRecord = {
  achievements: QuizAchievement[];
  answers: QuizCompletedQuestion[];
  completedAt: string;
  id: string;
  level: QuizLevel;
  reviewItems: QuizReviewItem[];
  startedAt: string;
  status: "completed" | "abandoned";
  summary: QuizAttemptSummary;
};

export type QuizFeedbackState = {
  correctAnswerLabel?: string;
  earnedCoins: number;
  earnedPoints: number;
  isCorrect: boolean;
  mode: "correct" | "incorrect" | "skipped";
  question: QuizQuestion;
  selectedAnswerLabel: string;
};

export type QuizLevelConfig = {
  accent: string;
  buttonGradient: string;
  description: string;
  icon: string;
  label: string;
  pointsPerCorrect: number;
  questionCount: number;
  questionTypes: string[];
  requiredAccuracy: number | null;
  rewardText: string;
  slug: QuizLevelSlug;
};

export const quizLevelOrder: QuizLevel[] = [
  "beginner",
  "intermediate",
  "advanced",
];

export const quizLevelConfigs: Record<QuizLevel, QuizLevelConfig> = {
  beginner: {
    accent: "#10B981",
    buttonGradient: "from-[#10B981] via-[#0fa36d] to-[#059669]",
    description:
      "Conceitos basicos, leitura visual simples e primeiros contatos com patologias estruturais.",
    icon: "🌱",
    label: "Iniciante",
    pointsPerCorrect: 5,
    questionCount: 30,
    questionTypes: [
      "Multipla escolha",
      "Identificacao visual",
      "Verdadeiro ou falso",
    ],
    requiredAccuracy: null,
    rewardText: "Ate 150 pontos e 60 moedas",
    slug: "iniciante",
  },
  intermediate: {
    accent: "#F59E0B",
    buttonGradient: "from-[#F59E0B] via-[#e58a07] to-[#D97706]",
    description:
      "Analise moderada, leitura tecnica e interpretacao de manifestacoes patologicas mais amplas.",
    icon: "⚡",
    label: "Intermediario",
    pointsPerCorrect: 10,
    questionCount: 30,
    questionTypes: [
      "Multipla escolha",
      "Verdadeiro ou falso",
      "Associacao",
      "Imagem",
    ],
    requiredAccuracy: 70,
    rewardText: "Ate 300 pontos e 150 moedas",
    slug: "intermediario",
  },
  advanced: {
    accent: "#8B5CF6",
    buttonGradient: "from-[#8B5CF6] via-[#a347dc] to-[#DC2626]",
    description:
      "Diagnostico tecnico, leitura de cenarios reais e raciocinio mais proximo de laudos.",
    icon: "🔥",
    label: "Avancado",
    pointsPerCorrect: 20,
    questionCount: 30,
    questionTypes: [
      "Analise de caso",
      "Ordenacao",
      "Discursiva",
      "Diagnostico multiplo",
    ],
    requiredAccuracy: 80,
    rewardText: "Ate 600 pontos e 300 moedas",
    slug: "avancado",
  },
};

type QuestionDraft = Omit<
  QuizQuestion,
  "coinReward" | "illustration" | "image" | "points"
> & {
  coinReward?: number;
  points?: number;
  visual?: {
    mode?: "image" | "illustration";
    subtitle: string;
    title: string;
  };
};

const levelRewards = {
  advanced: {
    coinReward: 10,
    points: 20,
  },
  beginner: {
    coinReward: 2,
    points: 5,
  },
  intermediate: {
    coinReward: 5,
    points: 10,
  },
} satisfies Record<QuizLevel, { coinReward: number; points: number }>;

const visualPalette = {
  advanced: ["#8B5CF6", "#DC2626"],
  beginner: ["#10B981", "#059669"],
  intermediate: ["#F59E0B", "#D97706"],
} satisfies Record<QuizLevel, [string, string]>;

function createQuizVisual(
  level: QuizLevel,
  title: string,
  subtitle: string,
) {
  const [startColor, endColor] = visualPalette[level];
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="960" height="540" viewBox="0 0 960 540" fill="none">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="${startColor}"/>
          <stop offset="100%" stop-color="${endColor}"/>
        </linearGradient>
      </defs>
      <rect width="960" height="540" rx="36" fill="url(#bg)"/>
      <rect x="42" y="42" width="876" height="456" rx="28" fill="rgba(8,12,34,0.18)" stroke="rgba(255,255,255,0.28)"/>
      <circle cx="162" cy="164" r="62" fill="rgba(255,255,255,0.16)"/>
      <path d="M128 196c18-34 36-68 54-102M182 196l-54-54" stroke="rgba(255,255,255,0.85)" stroke-width="16" stroke-linecap="round"/>
      <text x="252" y="188" fill="white" font-family="Arial, sans-serif" font-size="56" font-weight="700">${title}</text>
      <text x="252" y="246" fill="rgba(255,255,255,0.88)" font-family="Arial, sans-serif" font-size="30">${subtitle}</text>
      <rect x="252" y="304" width="420" height="92" rx="22" fill="rgba(255,255,255,0.12)"/>
      <text x="284" y="358" fill="rgba(255,255,255,0.92)" font-family="Arial, sans-serif" font-size="28">Leitura visual do quiz guiado</text>
      <text x="42" y="496" fill="rgba(255,255,255,0.74)" font-family="Arial, sans-serif" font-size="24">PatoJOGO • Patologias estruturais</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function createQuestion({
  coinReward,
  points,
  visual,
  ...draft
}: QuestionDraft): QuizQuestion {
  const visualSource = visual
    ? createQuizVisual(draft.level, visual.title, visual.subtitle)
    : null;

  return {
    ...draft,
    coinReward: coinReward ?? levelRewards[draft.level].coinReward,
    illustration: visual?.mode === "illustration" ? visualSource : null,
    image: !visual || visual.mode === "image" ? visualSource : null,
    points: points ?? levelRewards[draft.level].points,
  };
}

const beginnerQuestions: QuizQuestion[] = [
  createQuestion({
    id: "BEG-001",
    level: "beginner",
    type: "image-identification",
    category: "fissuras",
    difficulty: 1,
    question: "Identifique a patologia mostrada na imagem:",
    options: [
      "Fissura estrutural vertical",
      "Eflorescencia superficial",
      "Descolamento de pintura",
      "Corrosao de armadura",
    ],
    correctAnswer: 0,
    explanation:
      "Fissuras verticais mais abertas pedem atencao porque podem indicar sobrecarga, recalque ou concentracao de tensoes.",
    hints: [
      "Observe a direcao predominante da abertura.",
      "Fissuras verticais costumam merecer inspecao mais cuidadosa.",
    ],
    tags: ["fissura", "visual", "vertical"],
    visual: {
      subtitle: "Abertura linear em elemento vertical",
      title: "Fissura vertical",
    },
  }),
  createQuestion({
    id: "BEG-002",
    level: "beginner",
    type: "true-false",
    category: "infiltracao",
    difficulty: 1,
    question:
      "A infiltracao em estruturas de concreto pode favorecer a corrosao das armaduras.",
    correctAnswer: true,
    explanation:
      "A agua leva oxigenio e agentes agressivos ate o aco, facilitando o processo corrosivo.",
    hints: ["Pense na relacao entre umidade e ferrugem."],
    tags: ["infiltracao", "corrosao", "conceito"],
  }),
  createQuestion({
    id: "BEG-003",
    level: "beginner",
    type: "multiple-choice",
    category: "fissuras",
    difficulty: 1,
    question: "Qual situacao costuma gerar fissuras por retracao em revestimentos?",
    options: [
      "Secagem rapida com cura inadequada",
      "Corrosao profunda das armaduras",
      "Recalque diferencial da fundacao",
      "Lixiviacao de pasta cimenticia",
    ],
    correctAnswer: 0,
    explanation:
      "Quando a argamassa perde agua rapido demais e nao recebe cura adequada, a retracao superficial favorece fissuras finas.",
    hints: [
      "Pense no que acontece logo apos a aplicacao do revestimento.",
      "Ambiente quente e seco acelera esse mecanismo.",
    ],
    tags: ["retracao", "cura", "revestimento"],
    visual: {
      mode: "illustration",
      subtitle: "Cura ruim e evaporacao acelerada",
      title: "Retracao inicial",
    },
  }),
  createQuestion({
    id: "BEG-004",
    level: "beginner",
    type: "multiple-choice",
    category: "descolamento",
    difficulty: 1,
    question:
      "Quando um revestimento apresenta som cavo e perda de aderencia, a patologia mais provavel e:",
    options: [
      "Carbonatacao",
      "Descolamento",
      "Segregacao",
      "Lixiviacao",
    ],
    correctAnswer: 1,
    explanation:
      "Som cavo, destacamento e perda de aderencia sao sinais tipicos de descolamento entre camadas.",
    hints: ["O problema esta ligado a aderencia do revestimento."],
    tags: ["descolamento", "som-cavo", "aderencia"],
  }),
  createQuestion({
    id: "BEG-005",
    level: "beginner",
    type: "image-identification",
    category: "outros",
    difficulty: 1,
    question: "A imagem representa mais provavelmente qual patologia?",
    options: [
      "Eflorescencia",
      "Trinca estrutural",
      "Segregacao",
      "Recalque diferencial",
    ],
    correctAnswer: 0,
    explanation:
      "Eflorescencia aparece como deposito esbranquicado na superficie devido a migracao de sais soluveis.",
    hints: [
      "O aspecto branco lembra po ou cristais.",
      "A umidade costuma participar do processo.",
    ],
    tags: ["eflorescencia", "umidade", "visual"],
    visual: {
      subtitle: "Depositos esbranquicados na superficie",
      title: "Eflorescencia",
    },
  }),
  createQuestion({
    id: "BEG-006",
    level: "beginner",
    type: "multiple-choice",
    category: "infiltracao",
    difficulty: 1,
    question: "Qual causa e muito comum para infiltracao em lajes expostas?",
    options: [
      "Falha de impermeabilizacao",
      "Excesso de cobrimento de armadura",
      "Baixa altura do pe-direito",
      "Uso de cimento de alta resistencia",
    ],
    correctAnswer: 0,
    explanation:
      "Impermeabilizacao deficiente permite a entrada de agua e acelera outras manifestacoes patologicas.",
    hints: ["O problema costuma comecar na camada de protecao da agua."],
    tags: ["infiltracao", "laje", "impermeabilizacao"],
  }),
  createQuestion({
    id: "BEG-007",
    level: "beginner",
    type: "true-false",
    category: "fissuras",
    difficulty: 1,
    question: "Toda fissura fina em reboco significa problema estrutural.",
    correctAnswer: false,
    explanation:
      "Muitas fissuras finas em revestimento decorrem de retracao, variacao termica ou execucao, e nao necessariamente de falha estrutural.",
    hints: ["Nem toda abertura compromete a estrutura."],
    tags: ["fissuras", "reboco", "conceito"],
  }),
  createQuestion({
    id: "BEG-008",
    level: "beginner",
    type: "image-identification",
    category: "fissuras",
    difficulty: 2,
    question: "A abertura inclinada ao lado da janela sugere principalmente:",
    options: [
      "Movimentacao ou concentracao de tensoes",
      "Eflorescencia",
      "Bolha de pintura",
      "Segregacao de concreto",
    ],
    correctAnswer: 0,
    explanation:
      "Fissuras inclinadas proximas a vaos podem indicar movimentacao diferencial, concentracao de tensoes ou detalhamento inadequado.",
    hints: [
      "A localizacao perto da abertura importa.",
      "O angulo da fissura ajuda no diagnostico.",
    ],
    tags: ["fissura", "abertura", "tensoes"],
    visual: {
      subtitle: "Fissura diagonal junto ao vao",
      title: "Abertura inclinada",
    },
  }),
  createQuestion({
    id: "BEG-009",
    level: "beginner",
    type: "multiple-choice",
    category: "corrosao",
    difficulty: 2,
    question: "Um sinal inicial muito comum de corrosao das armaduras e:",
    options: [
      "Mancha ferruginosa na superficie",
      "Melhora da aderencia do concreto",
      "Brilho intenso no revestimento",
      "Reducao do peso da estrutura",
    ],
    correctAnswer: 0,
    explanation:
      "Manchas de ferrugem e pequenas fissuras longitudinais podem ser os primeiros sinais visiveis da corrosao.",
    hints: ["Pense no aspecto visual de uma armadura oxidando."],
    tags: ["corrosao", "ferrugem", "sinais"],
    visual: {
      mode: "illustration",
      subtitle: "Primeiros indicios na superficie",
      title: "Mancha ferruginosa",
    },
  }),
  createQuestion({
    id: "BEG-010",
    level: "beginner",
    type: "image-identification",
    category: "descolamento",
    difficulty: 1,
    question: "A bolha e o destacamento vistos na imagem indicam mais provavelmente:",
    options: [
      "Descolamento por umidade",
      "Carbonatacao profunda",
      "Lixiviacao de pasta",
      "Recalque de fundacao",
    ],
    correctAnswer: 0,
    explanation:
      "Umidade aprisionada e perda de aderencia podem gerar bolhas, destacamento de pintura e desplacamento superficial.",
    hints: [
      "A agua atras da camada de pintura e um gatilho frequente.",
      "Bolhas nao costumam ser sintoma de fundacao.",
    ],
    tags: ["bolha", "pintura", "umidade"],
    visual: {
      subtitle: "Pintura levantada e destacada",
      title: "Bolha e desplacamento",
    },
  }),
  createQuestion({
    id: "BEG-011",
    level: "beginner",
    type: "multiple-choice",
    category: "fissuras",
    difficulty: 1,
    question: "Em termos visuais, uma trinca tende a apresentar:",
    options: [
      "Abertura maior que uma fissura fina",
      "Apenas deposito branco",
      "Som cavo ao toque",
      "Mudanca de pH visivel",
    ],
    correctAnswer: 0,
    explanation:
      "Na linguagem de obra, trinca costuma ser percebida como abertura mais expressiva que uma fissura superficial.",
    hints: ["A comparacao aqui e principalmente visual."],
    tags: ["trinca", "fissura", "abertura"],
  }),
  createQuestion({
    id: "BEG-012",
    level: "beginner",
    type: "true-false",
    category: "outros",
    difficulty: 1,
    question: "Eflorescencia normalmente compromete a capacidade resistente da estrutura por si so.",
    correctAnswer: false,
    explanation:
      "A eflorescencia costuma ser um indicio de umidade e migracao de sais, mas nao significa automaticamente perda resistente.",
    hints: ["Ela serve mais como alerta de caminho de agua."],
    tags: ["eflorescencia", "durabilidade", "conceito"],
  }),
  createQuestion({
    id: "BEG-013",
    level: "beginner",
    type: "image-identification",
    category: "infiltracao",
    difficulty: 1,
    question: "Manchas escuras e descascamento perto do rodape indicam:",
    options: [
      "Infiltracao por umidade",
      "Recalque diferencial",
      "Carbonatacao acelerada",
      "Excesso de cobrimento",
    ],
    correctAnswer: 0,
    explanation:
      "Umidade ascendente ou infiltracao lateral costumam gerar manchas, mofo e destacamento perto do rodape.",
    hints: ["Observe a regiao da parede afetada."],
    tags: ["rodape", "umidade", "infiltracao"],
    visual: {
      subtitle: "Manchas e descascamento na base da parede",
      title: "Umidade no rodape",
    },
  }),
  createQuestion({
    id: "BEG-014",
    level: "beginner",
    type: "multiple-choice",
    category: "fissuras",
    difficulty: 1,
    question: "Qual pratica ajuda a reduzir fissuras por retracao plastica?",
    options: [
      "Cura adequada apos a execucao",
      "Retirar agua de amassamento no meio da cura",
      "Eliminar juntas de movimentacao",
      "Diminuir cobrimento da armadura",
    ],
    correctAnswer: 0,
    explanation:
      "A cura adequada reduz a perda rapida de agua e diminui a retracao inicial do material.",
    hints: ["A resposta esta ligada a manter umidade controlada."],
    tags: ["cura", "retracao", "prevencao"],
  }),
  createQuestion({
    id: "BEG-015",
    level: "beginner",
    type: "multiple-choice",
    category: "descolamento",
    difficulty: 2,
    question: "Uma causa comum de descolamento de revestimento e:",
    options: [
      "Base mal preparada ou sem aderencia",
      "pH alto do concreto novo",
      "Excesso de cobrimento da armadura",
      "Altura pequena da viga",
    ],
    correctAnswer: 0,
    explanation:
      "Quando a base nao e preparada adequadamente, a aderencia cai e o revestimento pode destacar.",
    hints: ["Pense no contato entre base e argamassa."],
    tags: ["descolamento", "base", "aderencia"],
  }),
  createQuestion({
    id: "BEG-016",
    level: "beginner",
    type: "image-identification",
    category: "fissuras",
    difficulty: 2,
    question: "O padrao de fissuras mapeadas da imagem esta mais associado a:",
    options: [
      "Retracao ou movimentacao superficial",
      "Armadura exposta",
      "Recalque brusco de fundacao",
      "Ataque quimico por cloretos",
    ],
    correctAnswer: 0,
    explanation:
      "Fissuras em mapa geralmente aparecem por retracao, variacoes termicas ou dano superficial disseminado.",
    hints: [
      "O desenho lembra pequenas placas irregulares.",
      "Nem sempre esse padrao aponta dano estrutural direto.",
    ],
    tags: ["mapeadas", "retracao", "superficial"],
    visual: {
      subtitle: "Rede distribuida de pequenas aberturas",
      title: "Fissuras mapeadas",
    },
  }),
  createQuestion({
    id: "BEG-017",
    level: "beginner",
    type: "true-false",
    category: "infiltracao",
    difficulty: 1,
    question:
      "A presenca de agua pode transportar sais e contribuir para eflorescencia.",
    correctAnswer: true,
    explanation:
      "A agua dissolve e carrega sais soluveis. Quando evapora na superficie, esses sais cristalizam e formam eflorescencia.",
    hints: ["A umidade e a ponte que leva o sal ate a superficie."],
    tags: ["agua", "sais", "eflorescencia"],
  }),
  createQuestion({
    id: "BEG-018",
    level: "beginner",
    type: "multiple-choice",
    category: "infiltracao",
    difficulty: 2,
    question:
      "Qual medida simples costuma ajudar no controle de infiltracao em areas expostas?",
    options: [
      "Manter impermeabilizacao e vedacoes em bom estado",
      "Reduzir o numero de pilares",
      "Aumentar apenas a espessura da pintura",
      "Trocar o tipo de agregado do concreto endurecido",
    ],
    correctAnswer: 0,
    explanation:
      "Vedacoes, arremates e impermeabilizacao conservados dificultam a entrada de agua e retardam patologias associadas.",
    hints: ["Pense em manutencao preventiva contra agua."],
    tags: ["impermeabilizacao", "vedacao", "prevencao"],
  }),
  createQuestion({
    id: "BEG-019",
    level: "beginner",
    type: "image-identification",
    category: "corrosao",
    difficulty: 2,
    question: "Armadura aparente com ferrugem indica principalmente:",
    options: [
      "Corrosao com perda do cobrimento",
      "Eflorescencia leve",
      "Segregacao estetica sem risco",
      "Apenas sujeira superficial",
    ],
    correctAnswer: 0,
    explanation:
      "Quando a armadura fica exposta e oxidada, houve perda de cobrimento ou destacamento do concreto, exigindo avaliacao tecnica.",
    hints: [
      "A ferrugem mostra que o aco perdeu protecao.",
      "O cobrimento nao esta cumprindo totalmente seu papel.",
    ],
    tags: ["corrosao", "armadura", "cobrimento"],
    visual: {
      subtitle: "Aco aparente e oxidado no concreto",
      title: "Armadura exposta",
    },
  }),
  createQuestion({
    id: "BEG-020",
    level: "beginner",
    type: "multiple-choice",
    category: "corrosao",
    difficulty: 2,
    question:
      "Quando a carbonatacao avanca no concreto, o efeito mais importante para o aco e:",
    options: [
      "Reducao da alcalinidade protetora",
      "Aumento automatico do cobrimento",
      "Secagem completa da estrutura",
      "Fechamento de fissuras existentes",
    ],
    correctAnswer: 0,
    explanation:
      "A carbonatacao reduz o pH e diminui a protecao natural da armadura contra corrosao.",
    hints: ["A palavra-chave e alcalinidade."],
    tags: ["carbonatacao", "ph", "corrosao"],
    visual: {
      mode: "illustration",
      subtitle: "Queda do pH protetivo do concreto",
      title: "Avanco da carbonatacao",
    },
  }),
  createQuestion({
    id: "BEG-021",
    level: "beginner",
    type: "image-identification",
    category: "descolamento",
    difficulty: 1,
    question:
      "A imagem de pintura estufada e descascando aponta para qual problema mais provavel?",
    options: [
      "Umidade e perda de aderencia",
      "Falta de cobrimento de armadura",
      "Recalque diferencial",
      "Ataque por sulfatos",
    ],
    correctAnswer: 0,
    explanation:
      "Pintura estufada e descascando normalmente esta ligada a umidade, pressao de vapor e perda de aderencia da camada.",
    hints: ["O problema costuma estar por tras da pintura."],
    tags: ["pintura", "umidade", "aderencia"],
    visual: {
      subtitle: "Pelicula levantada e descascando",
      title: "Pintura estufada",
    },
  }),
  createQuestion({
    id: "BEG-022",
    level: "beginner",
    type: "multiple-choice",
    category: "fissuras",
    difficulty: 2,
    question:
      "A ausencia de juntas de movimentacao em elementos longos favorece principalmente:",
    options: [
      "Fissuracao por movimentacao termica",
      "Melhor aderencia do revestimento",
      "Aumento do pH do concreto",
      "Formacao de eflorescencia sem agua",
    ],
    correctAnswer: 0,
    explanation:
      "Sem juntas adequadas, deformacoes termicas e retracoes podem se concentrar e gerar fissuras.",
    hints: ["Pense na dilatacao e contracao ao longo do tempo."],
    tags: ["juntas", "termica", "fissuras"],
  }),
  createQuestion({
    id: "BEG-023",
    level: "beginner",
    type: "true-false",
    category: "descolamento",
    difficulty: 1,
    question:
      "Som cavo ao toque pode indicar perda de aderencia entre camadas de revestimento.",
    correctAnswer: true,
    explanation:
      "O som cavo e um indicio de descolamento ou vazio sob o revestimento.",
    hints: ["A resposta esta ligada ao estado da aderencia."],
    tags: ["som-cavo", "descolamento", "revestimento"],
  }),
  createQuestion({
    id: "BEG-024",
    level: "beginner",
    type: "multiple-choice",
    category: "infiltracao",
    difficulty: 1,
    question:
      "Ao notar uma mancha de umidade em parede, a primeira acao tecnica mais sensata e:",
    options: [
      "Investigar a origem da agua",
      "Pintar imediatamente a area",
      "Demolir a parede inteira",
      "Aumentar a ventilacao sem inspecao",
    ],
    correctAnswer: 0,
    explanation:
      "Antes de reparar o acabamento, e essencial localizar a origem da agua para evitar recorrencia.",
    hints: ["Corrigir o sintoma sem achar a causa nao resolve."],
    tags: ["inspecao", "umidade", "origem"],
  }),
  createQuestion({
    id: "BEG-025",
    level: "beginner",
    type: "image-identification",
    category: "fissuras",
    difficulty: 2,
    question: "A fissura horizontal em alvenaria da imagem sugere mais provavelmente:",
    options: [
      "Movimentacao diferencial ou deformacao localizada",
      "Eflorescencia superficial",
      "Bolha de pintura",
      "Corrosao invisivel do aco",
    ],
    correctAnswer: 0,
    explanation:
      "Fissuras horizontais podem estar ligadas a deformacao de apoio, acomodacao de elementos ou movimentacao diferenciada.",
    hints: ["O sentido da abertura ajuda a interpretar a origem."],
    tags: ["horizontal", "alvenaria", "movimentacao"],
    visual: {
      subtitle: "Abertura linear acompanhando a fiada",
      title: "Fissura horizontal",
    },
  }),
  createQuestion({
    id: "BEG-026",
    level: "beginner",
    type: "multiple-choice",
    category: "outros",
    difficulty: 1,
    question:
      "Depositos brancos cristalinos sobre a superficie sao conhecidos como:",
    options: [
      "Eflorescencia",
      "Lascamento",
      "Recalque",
      "Segregacao",
    ],
    correctAnswer: 0,
    explanation:
      "Os cristais brancos indicam sais que migraram com a agua e se depositaram na superficie.",
    hints: ["A palavra comeca com 'eflo'."],
    tags: ["eflorescencia", "cristais", "visual"],
  }),
  createQuestion({
    id: "BEG-027",
    level: "beginner",
    type: "image-identification",
    category: "fissuras",
    difficulty: 2,
    question: "Fissuras concentradas nos cantos de uma abertura costumam indicar:",
    options: [
      "Concentracao de tensoes",
      "Apenas poeira aderida",
      "Corrosao generalizada do aco",
      "Segregacao do agregado",
    ],
    correctAnswer: 0,
    explanation:
      "Cantos de portas e janelas sao regioes de concentracao de tensoes e merecem detalhamento adequado.",
    hints: ["O canto e uma regiao classica de concentracao de tensoes."],
    tags: ["cantos", "abertura", "tensoes"],
    visual: {
      subtitle: "Aberturas surgindo a partir do canto",
      title: "Fissura em canto",
    },
  }),
  createQuestion({
    id: "BEG-028",
    level: "beginner",
    type: "true-false",
    category: "corrosao",
    difficulty: 2,
    question:
      "Produtos de corrosao ocupam volume maior que o aco original e podem fissurar o cobrimento.",
    correctAnswer: true,
    explanation:
      "A expansao dos produtos de corrosao gera pressao interna, favorecendo fissuras e destacamento do cobrimento.",
    hints: ["Ferrugem expandida exerce pressao no concreto."],
    tags: ["corrosao", "expansao", "cobrimento"],
  }),
  createQuestion({
    id: "BEG-029",
    level: "beginner",
    type: "multiple-choice",
    category: "descolamento",
    difficulty: 2,
    question:
      "Em fachadas revestidas, a falta de chapisco ou preparo ruim da base pode causar:",
    options: [
      "Descolamento do revestimento",
      "Aumento do pH interno",
      "Reducao da umidade externa",
      "Recalque da fundacao",
    ],
    correctAnswer: 0,
    explanation:
      "Sem rugosidade e ponte de aderencia adequadas, o revestimento perde ancoragem e pode destacar.",
    hints: ["A resposta esta ligada a aderencia entre camadas."],
    tags: ["fachada", "chapisco", "aderencia"],
  }),
  createQuestion({
    id: "BEG-030",
    level: "beginner",
    type: "image-identification",
    category: "corrosao",
    difficulty: 2,
    question:
      "A perda localizada do cobrimento com concreto lascado na imagem esta ligada a:",
    options: [
      "Corrosao da armadura com desplacamento",
      "Eflorescencia superficial",
      "Apenas falha estetica de pintura",
      "Retracao plastica leve",
    ],
    correctAnswer: 0,
    explanation:
      "Quando o aco corroi, seus produtos aumentam de volume e podem provocar fissuras e lascamento do cobrimento.",
    hints: [
      "O dano mostra a camada externa se desprendendo.",
      "A armadura costuma estar por tras desse quadro.",
    ],
    tags: ["desplacamento", "corrosao", "cobrimento"],
    visual: {
      subtitle: "Concreto lascado e perda de cobrimento",
      title: "Desplacamento por corrosao",
    },
  }),
];
const intermediateQuestions: QuizQuestion[] = [
  createQuestion({
    id: "INT-001",
    level: "intermediate",
    type: "multiple-choice",
    category: "corrosao",
    difficulty: 3,
    question:
      "Qual faixa de pH do concreto protege melhor as armaduras contra corrosao?",
    options: [
      "pH entre 5 e 7",
      "pH entre 8 e 10",
      "pH entre 12 e 13",
      "pH nao influencia",
    ],
    correctAnswer: 2,
    explanation:
      "O concreto altamente alcalino cria uma camada passivadora no aco. A queda do pH remove essa protecao.",
    hints: [
      "Pense na alcalinidade do cimento Portland.",
      "Carbonatacao e o processo que derruba esse pH.",
    ],
    references: ["NBR 6118", "HELENE, Manual de Reparo"],
    tags: ["corrosao", "ph", "alcalinidade"],
    visual: {
      mode: "illustration",
      subtitle: "Faixa alcalina protege o aco",
      title: "pH protetivo",
    },
  }),
  createQuestion({
    id: "INT-002",
    level: "intermediate",
    type: "matching",
    category: "outros",
    difficulty: 3,
    question: "Associe cada ensaio com sua principal finalidade:",
    pairs: [
      { left: "Pacometria", right: "Posicao e cobrimento das armaduras" },
      { left: "Esclerometria", right: "Resistencia superficial do concreto" },
      { left: "Ultrassom", right: "Homogeneidade interna e vazios" },
      { left: "Fenolftaleina", right: "Profundidade de carbonatacao" },
    ],
    correctPairs: [
      [0, 0],
      [1, 1],
      [2, 2],
      [3, 3],
    ],
    explanation:
      "Cada ensaio nao destrutivo responde uma pergunta especifica durante a inspecao da estrutura.",
    hints: ["Pense no que cada metodo mede no campo."],
    tags: ["ensaios", "diagnostico", "ndt"],
  }),
  createQuestion({
    id: "INT-003",
    level: "intermediate",
    type: "image-identification",
    category: "outros",
    difficulty: 2,
    question: "A mancha branca pulverulenta vista na imagem indica:",
    options: [
      "Eflorescencia",
      "Lascamento por corrosao",
      "Segregacao",
      "Recalque diferencial",
    ],
    correctAnswer: 0,
    explanation:
      "A eflorescencia decorre da migracao de sais soluveis que cristalizam ao atingir a superficie.",
    hints: [
      "A umidade participou do transporte do material.",
      "O aspecto branco e cristalino e decisivo.",
    ],
    tags: ["eflorescencia", "imagem", "sais"],
    visual: {
      subtitle: "Cristalizacao superficial de sais",
      title: "Eflorescencia tecnica",
    },
  }),
  createQuestion({
    id: "INT-004",
    level: "intermediate",
    type: "true-false",
    category: "corrosao",
    difficulty: 2,
    question:
      "A carbonatacao do concreto reduz a alcalinidade e pode deixar a armadura vulneravel.",
    correctAnswer: true,
    explanation:
      "Com a queda do pH, a camada passiva do aco se rompe e a corrosao pode iniciar com mais facilidade.",
    hints: ["A palavra-chave e queda do pH."],
    tags: ["carbonatacao", "corrosao", "durabilidade"],
  }),
  createQuestion({
    id: "INT-005",
    level: "intermediate",
    type: "multiple-choice",
    category: "corrosao",
    difficulty: 3,
    question:
      "Para que a corrosao eletroquimica das armaduras se desenvolva, normalmente sao necessarios:",
    options: [
      "Umidade e oxigenio",
      "Apenas acabamento ceramico",
      "Somente calor excessivo",
      "Baixa resistencia do cimento",
    ],
    correctAnswer: 0,
    explanation:
      "A agua e o oxigenio criam o meio necessario para a corrosao do aco, especialmente quando a passivacao se perde.",
    hints: ["Pense na receita basica para ferrugem."],
    tags: ["corrosao", "mecanismo", "umidade"],
  }),
  createQuestion({
    id: "INT-006",
    level: "intermediate",
    type: "image-identification",
    category: "corrosao",
    difficulty: 3,
    question:
      "A imagem com armadura aparente, manchas ferruginosas e cobrimento destacado representa:",
    options: [
      "Desplacamento por corrosao",
      "Lixiviacao superficial",
      "Fissuracao termica leve",
      "Pintura pulverulenta",
    ],
    correctAnswer: 0,
    explanation:
      "A expansao da corrosao gera fissuras e destacamento do cobrimento, expondo a armadura.",
    hints: ["Observe a combinacao entre ferrugem e perda do cobrimento."],
    tags: ["corrosao", "armadura", "desplacamento"],
    visual: {
      subtitle: "Ferrugem, fissuras e cobrimento solto",
      title: "Corrosao instalada",
    },
  }),
  createQuestion({
    id: "INT-007",
    level: "intermediate",
    type: "matching",
    category: "outros",
    difficulty: 3,
    question: "Associe cada patologia com sua principal causa:",
    pairs: [
      { left: "Corrosao", right: "Umidade e perda de passivacao" },
      { left: "Fissura de retracao", right: "Perda rapida de agua" },
      { left: "Eflorescencia", right: "Migracao de sais soluveis" },
      { left: "Descolamento", right: "Perda de aderencia entre camadas" },
    ],
    correctPairs: [
      [0, 0],
      [1, 1],
      [2, 2],
      [3, 3],
    ],
    explanation:
      "Cada manifestacao tem um mecanismo predominante. Entender a causa principal ajuda a definir o reparo.",
    hints: ["Nao confunda sintoma com mecanismo."],
    tags: ["causas", "matching", "diagnostico"],
  }),
  createQuestion({
    id: "INT-008",
    level: "intermediate",
    type: "multiple-choice",
    category: "corrosao",
    difficulty: 3,
    question:
      "Um cobrimento insuficiente tende a aumentar principalmente o risco de:",
    options: [
      "Corrosao das armaduras",
      "Reduzir qualquer chance de fissura",
      "Melhorar a durabilidade do concreto",
      "Eliminar a penetracao de agua",
    ],
    correctAnswer: 0,
    explanation:
      "Menor cobrimento facilita a entrada de agentes agressivos e reduz a protecao fisica das armaduras.",
    hints: ["A espessura da camada de concreto importa para a durabilidade."],
    tags: ["cobrimento", "durabilidade", "corrosao"],
  }),
  createQuestion({
    id: "INT-009",
    level: "intermediate",
    type: "image-identification",
    category: "corrosao",
    difficulty: 3,
    question:
      "A superficie tratada com fenolftaleina e sem coloracao rosada indica:",
    options: [
      "Regiao carbonatada",
      "Concreto em pH alto",
      "Presenca de eflorescencia",
      "Apenas umidade superficial",
    ],
    correctAnswer: 0,
    explanation:
      "A fenolftaleina fica rosada em meio alcalino. A ausencia de cor sugere concreto carbonatado naquela profundidade.",
    hints: [
      "Lembre como a fenolftaleina reage ao pH.",
      "Area sem cor costuma indicar queda de alcalinidade.",
    ],
    tags: ["fenolftaleina", "carbonatacao", "ensaio"],
    visual: {
      subtitle: "Ensaio para frente de carbonatacao",
      title: "Fenolftaleina",
    },
  }),
  createQuestion({
    id: "INT-010",
    level: "intermediate",
    type: "true-false",
    category: "outros",
    difficulty: 2,
    question:
      "Eflorescencia costuma indicar que existe ou existiu caminho de umidade na estrutura.",
    correctAnswer: true,
    explanation:
      "Sem transporte de agua, os sais soluveis dificilmente migram ate a superficie para cristalizar.",
    hints: ["A agua e o veiculo do processo."],
    tags: ["eflorescencia", "umidade", "conceito"],
  }),
  createQuestion({
    id: "INT-011",
    level: "intermediate",
    type: "multiple-choice",
    category: "outros",
    difficulty: 3,
    question: "Qual ensaio e mais apropriado para localizar armaduras e medir cobrimento?",
    options: [
      "Pacometria",
      "Esclerometria",
      "Ultrassom",
      "Extracao de testemunho",
    ],
    correctAnswer: 0,
    explanation:
      "Pacometria e usada para localizar barras e estimar o cobrimento do concreto.",
    hints: ["O nome do ensaio aparece muito em laudos de cobrimento."],
    tags: ["pacometria", "cobrimento", "ensaio"],
  }),
  createQuestion({
    id: "INT-012",
    level: "intermediate",
    type: "image-identification",
    category: "descolamento",
    difficulty: 3,
    question:
      "Placas ceramicas destacadas e ocas na fachada sugerem principalmente:",
    options: [
      "Descolamento por perda de aderencia",
      "Carbonatacao profunda",
      "Corrosao generalizada do concreto",
      "Somente sujeira acumulada",
    ],
    correctAnswer: 0,
    explanation:
      "Destacamento de placas costuma estar ligado a aderencia insuficiente, movimentacao termica ou execucao inadequada.",
    hints: ["O problema esta ligado ao sistema de colagem ou movimentacao."],
    tags: ["ceramica", "fachada", "descolamento"],
    visual: {
      subtitle: "Revestimento ceramico soltando da fachada",
      title: "Ceramica descolada",
    },
  }),
  createQuestion({
    id: "INT-013",
    level: "intermediate",
    type: "multiple-choice",
    category: "outros",
    difficulty: 3,
    question:
      "Fissuras diagonais em alvenaria junto a apoios podem estar relacionadas a:",
    options: [
      "Recalque diferencial",
      "Apenas falha de pintura",
      "Lavagem recente da fachada",
      "Excesso de vibracao no concreto endurecido",
    ],
    correctAnswer: 0,
    explanation:
      "Movimentacao diferencial dos apoios ou fundacoes e uma causa comum de fissuras inclinadas em alvenarias.",
    hints: ["O problema costuma vir de baixo para cima."],
    tags: ["recalque", "fissuras", "apoios"],
    visual: {
      mode: "illustration",
      subtitle: "Aberturas diagonais partindo do apoio",
      title: "Sinal de recalque",
    },
  }),
  createQuestion({
    id: "INT-014",
    level: "intermediate",
    type: "matching",
    category: "outros",
    difficulty: 3,
    question: "Associe a manifestacao ao ensaio mais util para investigar o caso:",
    pairs: [
      { left: "Cobrimento incerto", right: "Pacometria" },
      { left: "Duvida sobre homogeneidade", right: "Ultrassom" },
      { left: "Resistencia superficial baixa", right: "Esclerometria" },
      { left: "Suspeita de carbonatacao", right: "Fenolftaleina" },
    ],
    correctPairs: [
      [0, 0],
      [1, 1],
      [2, 2],
      [3, 3],
    ],
    explanation:
      "A relacao entre manifestacao e ensaio ajuda a montar um plano de diagnostico mais eficiente.",
    hints: ["Cada ensaio responde a uma pergunta bem especifica."],
    tags: ["ensaios", "planejamento", "diagnostico"],
  }),
  createQuestion({
    id: "INT-015",
    level: "intermediate",
    type: "true-false",
    category: "corrosao",
    difficulty: 3,
    question:
      "Ataque por cloretos pode iniciar corrosao mesmo antes da carbonatacao atingir a armadura.",
    correctAnswer: true,
    explanation:
      "Cloretos conseguem romper a camada passiva do aco, mesmo em concreto ainda alcalino.",
    hints: ["Cloreto e um mecanismo agressivo independente da carbonatacao total."],
    tags: ["cloretos", "corrosao", "durabilidade"],
  }),
  createQuestion({
    id: "INT-016",
    level: "intermediate",
    type: "multiple-choice",
    category: "descolamento",
    difficulty: 3,
    question:
      "Em fachadas, ciclos termicos e fixacao inadequada favorecem qual patologia?",
    options: [
      "Descolamento",
      "Eflorescencia interna",
      "Segregacao fresca",
      "Cura incompleta de vigas prontas",
    ],
    correctAnswer: 0,
    explanation:
      "Movimentacoes termicas repetidas e aderencia deficiente aumentam o risco de destacamento em revestimentos de fachada.",
    hints: ["A resposta envolve perda de aderencia com o tempo."],
    tags: ["fachada", "termica", "descolamento"],
  }),
  createQuestion({
    id: "INT-017",
    level: "intermediate",
    type: "image-identification",
    category: "outros",
    difficulty: 3,
    question: "O aspecto de ninhos e vazios internos aparentes indica:",
    options: [
      "Segregacao ou concretagem deficiente",
      "Apenas carbonatacao",
      "Pintura empolada",
      "Eflorescencia pontual",
    ],
    correctAnswer: 0,
    explanation:
      "Vazios, ninhos de brita e falta de pasta indicam segregacao ou adensamento insuficiente durante a concretagem.",
    hints: ["O defeito nasceu na execucao do concreto."],
    tags: ["segregacao", "ninho", "execucao"],
    visual: {
      subtitle: "Vazios e agregados sem pasta suficiente",
      title: "Ninho de brita",
    },
  }),
  createQuestion({
    id: "INT-018",
    level: "intermediate",
    type: "multiple-choice",
    category: "corrosao",
    difficulty: 3,
    question:
      "Ao encontrar armadura exposta e oxidada, qual etapa tecnica vem antes da recomposicao da superficie?",
    options: [
      "Diagnosticar, remover concreto solto e tratar o aco",
      "Pintar imediatamente a regiao",
      "Adicionar apenas argamassa estetica",
      "Molhar o elemento continuamente por dias",
    ],
    correctAnswer: 0,
    explanation:
      "Sem remover material deteriorado e tratar a armadura, o reparo tende a falhar rapidamente.",
    hints: ["Reparo duravel exige preparar bem a base."],
    tags: ["reparo", "corrosao", "tratamento"],
  }),
  createQuestion({
    id: "INT-019",
    level: "intermediate",
    type: "matching",
    category: "outros",
    difficulty: 3,
    question: "Associe cada patologia a uma medida preventiva principal:",
    pairs: [
      { left: "Eflorescencia", right: "Controlar umidade e percolacao" },
      { left: "Corrosao", right: "Garantir cobrimento e durabilidade" },
      { left: "Retracao", right: "Executar cura adequada" },
      { left: "Descolamento", right: "Preparar bem a base e a aderencia" },
    ],
    correctPairs: [
      [0, 0],
      [1, 1],
      [2, 2],
      [3, 3],
    ],
    explanation:
      "A prevencao eficiente ataca o mecanismo de origem: agua, cobrimento, cura ou aderencia.",
    hints: ["Ligacao entre mecanismo e medida preventiva."],
    tags: ["prevencao", "matching", "durabilidade"],
  }),
  createQuestion({
    id: "INT-020",
    level: "intermediate",
    type: "true-false",
    category: "fissuras",
    difficulty: 2,
    question:
      "Impermeabilizacao sozinha corrige definitivamente uma fissura estrutural ativa.",
    correctAnswer: false,
    explanation:
      "Se a fissura tem causa estrutural ativa, apenas vedar a superficie nao elimina o mecanismo gerador.",
    hints: ["Tratar o sintoma nao basta quando a causa continua atuando."],
    tags: ["fissura", "reparo", "conceito"],
  }),
  createQuestion({
    id: "INT-021",
    level: "intermediate",
    type: "image-identification",
    category: "infiltracao",
    difficulty: 2,
    question: "Bolhas e pintura empurrada para fora na imagem sugerem:",
    options: [
      "Pressao de vapor e umidade",
      "Carbonatacao profunda",
      "Recalque diferencial",
      "Segregacao de concreto",
    ],
    correctAnswer: 0,
    explanation:
      "A umidade pode gerar pressao sob a pintura, formando bolhas e destacamento superficial.",
    hints: ["A agua esta agindo por tras do acabamento."],
    tags: ["umidade", "pintura", "pressao-vapor"],
    visual: {
      subtitle: "Camada superficial empurrada de dentro para fora",
      title: "Bolhas por umidade",
    },
  }),
  createQuestion({
    id: "INT-022",
    level: "intermediate",
    type: "multiple-choice",
    category: "corrosao",
    difficulty: 3,
    question:
      "Qual produto e tradicionalmente utilizado para identificar frente de carbonatacao no concreto?",
    options: [
      "Fenolftaleina",
      "Cloreto de sodio",
      "Betume asfaltico",
      "Cal hidratada",
    ],
    correctAnswer: 0,
    explanation:
      "A fenolftaleina muda de cor em meio alcalino e ajuda a visualizar a profundidade carbonatada.",
    hints: ["E o mesmo indicador citado em laudos de pH do concreto."],
    tags: ["fenolftaleina", "carbonatacao", "indicador"],
  }),
  createQuestion({
    id: "INT-023",
    level: "intermediate",
    type: "image-identification",
    category: "infiltracao",
    difficulty: 2,
    question: "Mancha escura com mofo na parede indica principalmente:",
    options: [
      "Infiltracao ou condensacao persistente",
      "Corrosao das armaduras",
      "Segregacao do concreto",
      "Expansao termica do aco",
    ],
    correctAnswer: 0,
    explanation:
      "Mancha escura, mofo e cheiro tipico costumam apontar para umidade recorrente no elemento.",
    hints: ["Observe a combinacao entre mancha e colonizacao biologica."],
    tags: ["mofo", "umidade", "parede"],
    visual: {
      subtitle: "Superficie manchada com colonizacao biologica",
      title: "Mofo por umidade",
    },
  }),
  createQuestion({
    id: "INT-024",
    level: "intermediate",
    type: "multiple-choice",
    category: "outros",
    difficulty: 3,
    question:
      "Qual acao ajuda a prevenir o reaparecimento de eflorescencia apos limpeza?",
    options: [
      "Reduzir a entrada e o caminho de agua",
      "Aplicar tinta sem secagem da base",
      "Aumentar a quantidade de sais no elemento",
      "Abrir fissuras para ventilacao",
    ],
    correctAnswer: 0,
    explanation:
      "Se a umidade continuar transportando sais, a eflorescencia volta mesmo apos limpeza superficial.",
    hints: ["Sem resolver a agua, o sal volta."],
    tags: ["eflorescencia", "prevencao", "umidade"],
  }),
  createQuestion({
    id: "INT-025",
    level: "intermediate",
    type: "matching",
    category: "outros",
    difficulty: 3,
    question: "Associe cada sintoma ao diagnostico mais provavel:",
    pairs: [
      { left: "Som cavo no revestimento", right: "Descolamento" },
      { left: "Cristais brancos", right: "Eflorescencia" },
      { left: "Ferrugem aparente", right: "Corrosao" },
      { left: "Mancha umida no rodape", right: "Infiltracao" },
    ],
    correctPairs: [
      [0, 0],
      [1, 1],
      [2, 2],
      [3, 3],
    ],
    explanation:
      "Leitura correta do sintoma acelera a triagem de campo e evita intervencoes superficiais sem diagnostico.",
    hints: ["Associe o efeito visivel ao mecanismo mais conhecido."],
    tags: ["sintomas", "matching", "triagem"],
  }),
  createQuestion({
    id: "INT-026",
    level: "intermediate",
    type: "true-false",
    category: "outros",
    difficulty: 2,
    question:
      "Ensaio de ultrassom pode ajudar a avaliar homogeneidade e identificar vazios internos no concreto.",
    correctAnswer: true,
    explanation:
      "Velocidade e comportamento da onda ultrassonica ajudam a inferir descontinuidades e variacao interna do material.",
    hints: ["O ultrassom enxerga o interior sem demolir."],
    tags: ["ultrassom", "homogeneidade", "ensaio"],
  }),
  createQuestion({
    id: "INT-027",
    level: "intermediate",
    type: "multiple-choice",
    category: "corrosao",
    difficulty: 3,
    question:
      "Qual efeito mecanico da corrosao costuma gerar fissuras longitudinais no cobrimento?",
    options: [
      "Expansao dos produtos de corrosao",
      "Reducao da massa do ar ambiente",
      "Secagem instantanea do concreto",
      "Aumento da rugosidade superficial da pintura",
    ],
    correctAnswer: 0,
    explanation:
      "Os produtos de corrosao ocupam maior volume que o aco original e comprimem o cobrimento ate fissura-lo.",
    hints: ["A ferrugem expande e pressiona o concreto."],
    tags: ["corrosao", "expansao", "fissuras"],
  }),
  createQuestion({
    id: "INT-028",
    level: "intermediate",
    type: "image-identification",
    category: "corrosao",
    difficulty: 3,
    question:
      "O dano visivel na borda da laje, com manchas e perda localizada do concreto, indica:",
    options: [
      "Corrosao com destacamento de cobrimento",
      "Eflorescencia sem risco",
      "Apenas falha de pintura",
      "Recalque diferencial do solo",
    ],
    correctAnswer: 0,
    explanation:
      "Bordas expostas sao sensiveis a agua e agentes agressivos. A corrosao leva ao destacamento do concreto protetor.",
    hints: ["Observe ferrugem, perda de concreto e exposicao do aco."],
    tags: ["laje", "borda", "corrosao"],
    visual: {
      subtitle: "Borda de laje com perda de cobrimento",
      title: "Dano em borda",
    },
  }),
  createQuestion({
    id: "INT-029",
    level: "intermediate",
    type: "multiple-choice",
    category: "descolamento",
    difficulty: 3,
    question:
      "Qual condicao favorece o descolamento de argamassa ou revestimento em fachadas?",
    options: [
      "Base sem preparo e movimentacao termica",
      "Concreto com pH alto recem-lancado",
      "Uso de juntas de movimentacao",
      "Cura eficiente da argamassa",
    ],
    correctAnswer: 0,
    explanation:
      "Aderencia deficiente e variacoes dimensionais repetidas aumentam o risco de destacamento em fachadas.",
    hints: ["A resposta junta aderencia ruim e variacao termica."],
    tags: ["fachada", "aderencia", "termica"],
  }),
  createQuestion({
    id: "INT-030",
    level: "intermediate",
    type: "true-false",
    category: "fissuras",
    difficulty: 3,
    question:
      "Fissuras mapeadas podem aparecer tanto por retracao superficial quanto em cenarios de corrosao mais distribuida, dependendo do contexto.",
    correctAnswer: true,
    explanation:
      "O padrao mapeado precisa ser lido junto com outros sintomas, pois pode ter origem superficial ou estar associado a dano mais amplo.",
    hints: ["O contexto visual e historico do elemento importa."],
    tags: ["fissuras", "mapeadas", "contexto"],
  }),
];
const advancedQuestions: QuizQuestion[] = [
  createQuestion({
    id: "ADV-001",
    level: "advanced",
    type: "multiple-choice",
    category: "corrosao",
    difficulty: 5,
    question:
      "Uma laje de 20 anos apresenta manchas ferruginosas, fissuras mapeadas, armaduras expostas e lascamento. Qual sequencia de eventos e a mais provavel?",
    options: [
      "Fissuras, infiltracao, carbonatacao, corrosao, lascamento",
      "Carbonatacao, corrosao, expansao, fissuras, lascamento",
      "Infiltracao, corrosao, fissuras, carbonatacao, lascamento",
      "Lascamento, infiltracao, fissuras, corrosao, carbonatacao",
    ],
    correctAnswer: 1,
    explanation:
      "A carbonatacao remove a passivacao, a corrosao se instala, os produtos expansivos fissuram o cobrimento e por fim ocorre o lascamento.",
    hints: [
      "Pense no dano quimico antes do dano aparente.",
      "A ferrugem expandida gera tensoes internas.",
    ],
    references: ["HELENE, Manual de Reparo", "NBR 6118"],
    tags: ["corrosao", "sequencia", "diagnostico"],
    visual: {
      mode: "illustration",
      subtitle: "Manchas, fissuras e cobrimento perdido",
      title: "Cadeia de corrosao",
    },
  }),
  createQuestion({
    id: "ADV-002",
    level: "advanced",
    type: "ordering",
    category: "corrosao",
    difficulty: 4,
    question:
      "Ordene corretamente as etapas tecnicas de reparo de uma estrutura com corrosao de armaduras:",
    items: [
      "Remocao do concreto deteriorado",
      "Limpeza e tratamento das armaduras",
      "Aplicacao de ponte de aderencia",
      "Recomposicao com graute ou argamassa",
      "Aplicacao de revestimento protetor",
      "Inspecao preliminar e projeto de reparo",
    ],
    correctOrder: [5, 0, 1, 2, 3, 4],
    explanation:
      "Primeiro vem o diagnostico e o projeto. Depois entram remocao, preparo do aco, recomposicao e protecao final.",
    hints: [
      "Nao existe reparo serio sem diagnostico previo.",
      "Protecao final vem depois da recomposicao.",
    ],
    tags: ["reparo", "procedimento", "corrosao"],
    visual: {
      mode: "illustration",
      subtitle: "Fluxo tecnico do reparo estrutural",
      title: "Sequencia de reparo",
    },
  }),
  createQuestion({
    id: "ADV-003",
    level: "advanced",
    type: "open-ended",
    category: "fissuras",
    difficulty: 4,
    question:
      "Descreva as diferencas entre fissuracao estrutural e nao estrutural em elementos de concreto.",
    explanation:
      "A resposta esperada deve separar causas ligadas a solicitacoes e seguranca estrutural de causas ligadas a retracao, variacao termica e acabamento.",
    keywords: ["carga", "retracao", "gravidade", "estrutural"],
    minLength: 50,
    points: 30,
    coinReward: 10,
    tags: ["fissuracao", "diagnostico", "discursiva"],
    visual: {
      mode: "illustration",
      subtitle: "Comparacao entre causas e gravidade",
      title: "Estrutural x nao estrutural",
    },
  }),
  createQuestion({
    id: "ADV-004",
    level: "advanced",
    type: "multiple-choice",
    category: "outros",
    difficulty: 5,
    question:
      "Em um quadro com recalque diferencial, qual indicio reforca mais a necessidade de investigacao estrutural imediata?",
    options: [
      "Fissuras finas superficiais em pintura",
      "Portas emperrando e fissuras inclinadas em alvenaria",
      "Pequena mancha de umidade proxima ao rodape",
      "Eflorescencia pontual em parede externa",
    ],
    correctAnswer: 1,
    explanation:
      "Fissuras inclinadas associadas a deformacao funcional, como travamento de esquadrias, aumentam a suspeita de movimentacao estrutural significativa.",
    hints: [
      "Busque o sintoma que mostra alteracao funcional do edificio.",
      "Recalque costuma produzir sinais combinados, nao isolados.",
    ],
    tags: ["recalque", "movimentacao", "gravidade"],
    visual: {
      mode: "illustration",
      subtitle: "Fissuras inclinadas e esquadrias travadas",
      title: "Indicio de recalque",
    },
  }),
  createQuestion({
    id: "ADV-005",
    level: "advanced",
    type: "image-identification",
    category: "corrosao",
    difficulty: 4,
    question:
      "Ao observar manchas ferruginosas, fissuras longitudinais e perda de cobrimento no mesmo painel, a prioridade diagnostica e:",
    options: [
      "Avaliar extensao da corrosao e risco de perda de secao do aco",
      "Reaplicar pintura sem remover concreto",
      "Apenas lavar a superficie e liberar o uso",
      "Ignorar, pois o dano e so estetico",
    ],
    correctAnswer: 0,
    explanation:
      "Quando ha armadura comprometida, o foco deve ser entender profundidade, perda de secao, causa da corrosao e necessidade de escoramento ou reparo.",
    hints: ["A pergunta nao e sobre acabamento, e sobre seguranca."],
    tags: ["corrosao", "prioridade", "avaliacao"],
    visual: {
      subtitle: "Sinais combinados de corrosao ativa",
      title: "Painel com dano",
    },
  }),
  createQuestion({
    id: "ADV-006",
    level: "advanced",
    type: "matching",
    category: "outros",
    difficulty: 4,
    question: "Associe a patologia ao mecanismo predominante:",
    pairs: [
      { left: "Lixiviacao", right: "Dissolucao e arraste de compostos da pasta" },
      { left: "Segregacao", right: "Separacao entre pasta e agregados" },
      { left: "Carbonatacao", right: "Reacao com CO2 e queda de pH" },
      { left: "Recalque diferencial", right: "Movimentacao desigual de apoios" },
    ],
    correctPairs: [
      [0, 0],
      [1, 1],
      [2, 2],
      [3, 3],
    ],
    explanation:
      "Entender o mecanismo dominante melhora o diagnostico e evita reparos superficiais sem tratar a origem.",
    hints: ["Associe cada patologia ao processo fisico ou quimico que a sustenta."],
    tags: ["mecanismos", "matching", "patologias"],
  }),
  createQuestion({
    id: "ADV-007",
    level: "advanced",
    type: "ordering",
    category: "outros",
    difficulty: 4,
    question: "Ordene as etapas corretas de uma inspecao estrutural bem conduzida:",
    items: [
      "Vistoria inicial e levantamento visual",
      "Definicao dos ensaios necessarios",
      "Execucao de ensaios e coleta de dados",
      "Analise estrutural e interpretacao",
      "Emissao do laudo tecnico",
    ],
    correctOrder: [0, 1, 2, 3, 4],
    explanation:
      "Primeiro observa-se o quadro, depois define-se o plano de ensaios, executa-se a coleta, interpreta-se e por fim formaliza-se o laudo.",
    hints: ["Nao se escreve laudo antes de analisar os dados."],
    tags: ["inspecao", "laudo", "ordem"],
    visual: {
      mode: "illustration",
      subtitle: "Fluxo tecnico de investigacao",
      title: "Etapas da inspecao",
    },
  }),
  createQuestion({
    id: "ADV-008",
    level: "advanced",
    type: "true-false",
    category: "corrosao",
    difficulty: 4,
    question: "A carbonatacao do concreto e um processo irreversivel.",
    correctAnswer: true,
    explanation:
      "Depois de consumida a reserva alcalina naquela zona, nao se restabelece espontaneamente a condicao original de passivacao.",
    hints: ["A reserva alcalina nao volta sozinha."],
    tags: ["carbonatacao", "irreversivel", "durabilidade"],
  }),
  createQuestion({
    id: "ADV-009",
    level: "advanced",
    type: "multiple-choice",
    category: "corrosao",
    difficulty: 5,
    question:
      "Em ambiente marinho, a iniciacao de corrosao pode ocorrer precocemente principalmente por:",
    options: [
      "Penetracao de cloretos ate a armadura",
      "Ausencia completa de oxigenio",
      "Aumento espontaneo do cobrimento",
      "Reducao da temperatura interna do concreto",
    ],
    correctAnswer: 0,
    explanation:
      "Cloretos rompem a camada passiva do aco e aceleram a corrosao, especialmente em estruturas proximas ao mar.",
    hints: [
      "O agente agressivo principal vem do ambiente salino.",
      "Ele consegue atuar mesmo antes da carbonatacao total.",
    ],
    tags: ["cloretos", "ambiente-marinho", "corrosao"],
  }),
  createQuestion({
    id: "ADV-010",
    level: "advanced",
    type: "image-identification",
    category: "outros",
    difficulty: 4,
    question: "A imagem com agregados aparentes e falta de pasta indica:",
    options: [
      "Segregacao ou concretagem mal adensada",
      "Apenas desgaste estetico da pintura",
      "Eflorescencia sem umidade",
      "Recalque diferencial da fundacao",
    ],
    correctAnswer: 0,
    explanation:
      "Quando a pasta nao envolve adequadamente os agregados ou o adensamento e insuficiente, surgem vazios e segregacao.",
    hints: ["O defeito nasceu na etapa de lancamento e adensamento."],
    tags: ["segregacao", "adensamento", "execucao"],
    visual: {
      subtitle: "Agregados expostos e vazios internos",
      title: "Segregacao",
    },
  }),
  createQuestion({
    id: "ADV-011",
    level: "advanced",
    type: "open-ended",
    category: "corrosao",
    difficulty: 5,
    question:
      "Explique como diferenciar um quadro de corrosao por carbonatacao de um quadro iniciado por cloretos.",
    explanation:
      "A resposta deve citar queda de pH, frente de carbonatacao, ambiente agressivo, teores de cloreto e comportamento de iniciacao da corrosao.",
    keywords: ["ph", "carbonatacao", "cloretos", "passivacao"],
    minLength: 60,
    points: 30,
    coinReward: 10,
    tags: ["corrosao", "carbonatacao", "cloretos", "discursiva"],
    visual: {
      mode: "illustration",
      subtitle: "Comparacao entre mecanismos de iniciacao",
      title: "Corrosao comparada",
    },
  }),
  createQuestion({
    id: "ADV-012",
    level: "advanced",
    type: "multiple-choice",
    category: "descolamento",
    difficulty: 4,
    question:
      "Ao investigar destacamento de revestimento em fachada, qual sequencia inicial e mais coerente?",
    options: [
      "Mapear areas ocas, avaliar aderencia e checar movimentacao/umidade",
      "Somente repor as pecas destacadas",
      "Pintar a fachada para esconder o dano",
      "Executar pacometria em todos os elementos",
    ],
    correctAnswer: 0,
    explanation:
      "Mapeamento, verificacao da aderencia e leitura do mecanismo predominante orientam o reparo correto em fachadas.",
    hints: ["Antes de reparar, entenda a extensao e a causa do destacamento."],
    tags: ["fachada", "descolamento", "inspecao"],
  }),
  createQuestion({
    id: "ADV-013",
    level: "advanced",
    type: "matching",
    category: "outros",
    difficulty: 4,
    question: "Associe o ensaio ao tipo de decisao tecnica que ele apoia:",
    pairs: [
      { left: "Pacometria", right: "Definir cobrimento e posicao das barras" },
      { left: "Ultrassom", right: "Investigar descontinuidades internas" },
      { left: "Esclerometria", right: "Triar resistencia superficial" },
      { left: "Teste de cloretos", right: "Avaliar risco de corrosao por sais" },
    ],
    correctPairs: [
      [0, 0],
      [1, 1],
      [2, 2],
      [3, 3],
    ],
    explanation:
      "Laudos consistentes escolhem ensaios conforme a pergunta tecnica que precisa ser respondida.",
    hints: ["Nao basta saber o nome do ensaio; pense na decisao que ele suporta."],
    tags: ["ensaio", "decisao", "laudo"],
  }),
  createQuestion({
    id: "ADV-014",
    level: "advanced",
    type: "ordering",
    category: "infiltracao",
    difficulty: 4,
    question:
      "Ordene a sequencia coerente para recuperar uma cobertura com infiltracao recorrente:",
    items: [
      "Identificar o caminho de entrada da agua",
      "Corrigir caimentos, juntas e pontos de entrada",
      "Refazer ou reparar a impermeabilizacao",
      "Executar teste de estanqueidade",
      "Recompor os acabamentos internos danificados",
    ],
    correctOrder: [0, 1, 2, 3, 4],
    explanation:
      "Primeiro identifica-se a origem, depois corrige-se o sistema, testa-se estanqueidade e so entao recompõe-se o acabamento.",
    hints: ["Acabamento interno fica por ultimo."],
    tags: ["cobertura", "infiltracao", "procedimento"],
    visual: {
      mode: "illustration",
      subtitle: "Diagnostico antes da recomposicao",
      title: "Recuperacao da cobertura",
    },
  }),
  createQuestion({
    id: "ADV-015",
    level: "advanced",
    type: "true-false",
    category: "outros",
    difficulty: 4,
    question:
      "Recalque diferencial pode redistribuir esforcos e afetar tanto alvenarias quanto elementos estruturais.",
    correctAnswer: true,
    explanation:
      "A movimentacao desigual dos apoios altera o caminho das cargas e gera sintomas em varios elementos do sistema construtivo.",
    hints: ["Os efeitos nao se limitam ao acabamento."],
    tags: ["recalque", "esforcos", "apoios"],
  }),
  createQuestion({
    id: "ADV-016",
    level: "advanced",
    type: "multiple-choice",
    category: "outros",
    difficulty: 4,
    question:
      "A lixiviacao em concreto esta associada principalmente a:",
    options: [
      "Dissolucao e arraste de compostos soluveis da pasta",
      "Apenas aquecimento excessivo do aco",
      "Expansao dos agregados secos",
      "Ausencia de cobrimento sobre armaduras",
    ],
    correctAnswer: 0,
    explanation:
      "A passagem de agua pode dissolver componentes da pasta cimenticia, deixando vazios, erosao e perda de coesao local.",
    hints: ["A agua em movimento e parte fundamental do fenomeno."],
    tags: ["lixiviacao", "pasta", "erosao"],
  }),
  createQuestion({
    id: "ADV-017",
    level: "advanced",
    type: "image-identification",
    category: "outros",
    difficulty: 4,
    question:
      "Ao ler a imagem com fissuras, manchas e degradacao superficial combinadas, qual diagnostico inicial e mais prudente?",
    options: [
      "Quadro multipatologico que exige investigacao integrada",
      "Apenas necessidade de repintura",
      "Somente retracao plastica sem relevancia",
      "Defeito isolado de acabamento",
    ],
    correctAnswer: 0,
    explanation:
      "Quando diferentes sintomas coexistem, o diagnostico nao deve focar num unico efeito visual; e preciso integrar mecanismos e ensaios.",
    hints: ["Mais de um sintoma costuma significar mais de um mecanismo ou cadeia de causas."],
    tags: ["multipatologico", "integrado", "laudo"],
    visual: {
      subtitle: "Sintomas combinados exigindo leitura global",
      title: "Quadro multipatologico",
    },
  }),
  createQuestion({
    id: "ADV-018",
    level: "advanced",
    type: "multiple-choice",
    category: "outros",
    difficulty: 5,
    question:
      "Quando varias patologias aparecem simultaneamente, a melhor estrategia de laudo e:",
    options: [
      "Priorizar mecanismos-raiz e hierarquizar risco e urgencia",
      "Descrever apenas o sintoma mais vistoso",
      "Ignorar os sinais de menor gravidade aparente",
      "Reparar tudo apenas com argamassa e pintura",
    ],
    correctAnswer: 0,
    explanation:
      "Laudos tecnicos consistentes priorizam causas-raiz, nivel de risco, necessidade de escoramento e plano de investigacao ou reparo.",
    hints: ["Um bom laudo organiza prioridades, nao so descreve defeitos."],
    tags: ["laudo", "prioridade", "risco"],
  }),
  createQuestion({
    id: "ADV-019",
    level: "advanced",
    type: "matching",
    category: "outros",
    difficulty: 4,
    question: "Associe o material de reparo ao uso mais adequado:",
    pairs: [
      { left: "Graute estrutural", right: "Recomposicao localizada de secoes" },
      { left: "Argamassa polimerica", right: "Reparo superficial e cobrimento" },
      { left: "Ponte de aderencia", right: "Ligacao entre substrato e reparo" },
      { left: "Revestimento protetor", right: "Barreira final contra agentes agressivos" },
    ],
    correctPairs: [
      [0, 0],
      [1, 1],
      [2, 2],
      [3, 3],
    ],
    explanation:
      "Cada material participa de uma etapa especifica. Usar o produto certo no momento errado compromete o reparo.",
    hints: ["Pense no papel funcional de cada material."],
    tags: ["materiais", "reparo", "matching"],
  }),
  createQuestion({
    id: "ADV-020",
    level: "advanced",
    type: "ordering",
    category: "outros",
    difficulty: 4,
    question:
      "Ordene corretamente as etapas de validacao apos um reparo estrutural importante:",
    items: [
      "Inspecao visual final",
      "Verificacao dimensional e de cobrimento",
      "Ensaios complementares quando previstos",
      "Registro fotografico e documental",
      "Plano de monitoramento/manutencao",
    ],
    correctOrder: [0, 1, 2, 3, 4],
    explanation:
      "O fechamento tecnico do reparo deve verificar conformidade, documentar a intervencao e orientar manutencao futura.",
    hints: ["Documentacao vem antes do encerramento do caso."],
    tags: ["validacao", "monitoramento", "reparo"],
    visual: {
      mode: "illustration",
      subtitle: "Fechamento tecnico apos intervencao",
      title: "Pos-reparo",
    },
  }),
  createQuestion({
    id: "ADV-021",
    level: "advanced",
    type: "image-identification",
    category: "corrosao",
    difficulty: 5,
    question:
      "Em uma viga com armadura aparente, perda de cobrimento e manchas ferruginosas extensas, qual e o risco mais importante?",
    options: [
      "Reducao da secao resistente da armadura e destacamento progressivo",
      "Somente mancha superficial sem impacto tecnico",
      "Apenas necessidade de nova pintura decorativa",
      "Melhora espontanea da aderencia interna",
    ],
    correctAnswer: 0,
    explanation:
      "Corrosao extensa pode reduzir secao de aco, comprometer aderencia e levar a perdas progressivas do concreto de cobrimento.",
    hints: ["A prioridade aqui e estrutural, nao estetica."],
    tags: ["viga", "corrosao", "risco"],
    visual: {
      subtitle: "Viga com corrosao instalada",
      title: "Risco estrutural",
    },
  }),
  createQuestion({
    id: "ADV-022",
    level: "advanced",
    type: "true-false",
    category: "corrosao",
    difficulty: 4,
    question:
      "Pintar a superficie de um elemento com corrosao ativa, sem tratar o substrato, resolve o problema de durabilidade.",
    correctAnswer: false,
    explanation:
      "Sem remover concreto deteriorado, tratar o aco e recompor corretamente o sistema, a patologia continua ativa sob a pintura.",
    hints: ["Acabamento sem tratamento de causa e maquiagem."],
    tags: ["corrosao", "reparo", "conceito"],
  }),
  createQuestion({
    id: "ADV-023",
    level: "advanced",
    type: "multiple-choice",
    category: "corrosao",
    difficulty: 5,
    question:
      "Em um elemento com fissuras mapeadas, manchas ferruginosas e pequenos destacamentos, qual hipotese merece investigacao prioritariamente?",
    options: [
      "Corrosao distribuida das armaduras",
      "Apenas retracao superficial inocua",
      "Somente sujeira ambiental",
      "Falha de ventilacao do ambiente",
    ],
    correctAnswer: 0,
    explanation:
      "A associacao entre ferrugem, fissuras e destacamentos sugere que o quadro pode ter avancado para corrosao ativa e distribuida.",
    hints: ["A ferrugem muda totalmente a leitura do quadro mapeado."],
    tags: ["fissuras", "corrosao", "prioridade"],
  }),
  createQuestion({
    id: "ADV-024",
    level: "advanced",
    type: "image-identification",
    category: "outros",
    difficulty: 5,
    question:
      "As fissuras inclinadas em paredes, associadas a portas desalinhadas, indicam mais fortemente:",
    options: [
      "Recalque diferencial de fundacao",
      "Somente falha de pintura",
      "Carbonatacao localizada",
      "Segregacao na concretagem da laje",
    ],
    correctAnswer: 0,
    explanation:
      "Quando ha fissuras inclinadas e perda de prumo/funcionalidade das esquadrias, o recalque diferencial entra forte no diagnostico.",
    hints: ["A deformacao funcional reforca a hipotese de fundacao."],
    tags: ["recalque", "alvenaria", "esquadria"],
    visual: {
      subtitle: "Fissuras inclinadas e portas desalinhadas",
      title: "Recalque diferencial",
    },
  }),
  createQuestion({
    id: "ADV-025",
    level: "advanced",
    type: "multiple-choice",
    category: "outros",
    difficulty: 5,
    question:
      "Ao hierarquizar riscos em um laudo, qual criterio deve pesar mais no topo da lista?",
    options: [
      "Impacto potencial sobre seguranca e estabilidade",
      "Facilidade de esconder o defeito com acabamento",
      "Cor mais chamativa da manifestacao",
      "Quantidade de fotos tiradas do problema",
    ],
    correctAnswer: 0,
    explanation:
      "Laudos tecnicos priorizam risco a seguranca, progressividade da deterioracao e urgencia de intervencao.",
    hints: ["Risco estrutural e de uso vem antes de estetica."],
    tags: ["laudo", "risco", "seguranca"],
  }),
  createQuestion({
    id: "ADV-026",
    level: "advanced",
    type: "matching",
    category: "outros",
    difficulty: 4,
    question: "Associe a evidencia de campo ao estagio mais provavel da deterioracao:",
    pairs: [
      { left: "Mancha ferruginosa discreta", right: "Inicio de corrosao aparente" },
      { left: "Fissura longitudinal no cobrimento", right: "Expansao dos produtos de corrosao" },
      { left: "Armadura exposta", right: "Perda do cobrimento protetor" },
      { left: "Lascamento amplo", right: "Estagio avancado com desprendimento" },
    ],
    correctPairs: [
      [0, 0],
      [1, 1],
      [2, 2],
      [3, 3],
    ],
    explanation:
      "A leitura do estagio de dano ajuda a estimar urgencia, escopo de ensaios e tipo de reparo necessarios.",
    hints: ["Pense na progressao visual do dano corrosivo."],
    tags: ["estagios", "corrosao", "matching"],
  }),
  createQuestion({
    id: "ADV-027",
    level: "advanced",
    type: "ordering",
    category: "outros",
    difficulty: 4,
    question: "Ordene o fluxo coerente de elaboracao de um laudo tecnico de patologia:",
    items: [
      "Definicao do objeto e escopo",
      "Vistoria e registro das manifestacoes",
      "Ensaios e levantamentos complementares",
      "Analise das causas e dos riscos",
      "Recomendacoes tecnicas e conclusao",
    ],
    correctOrder: [0, 1, 2, 3, 4],
    explanation:
      "Um laudo robusto precisa partir de escopo claro, coleta adequada, interpretacao tecnica e conclusoes justificadas.",
    hints: ["As recomendacoes aparecem so depois da analise."],
    tags: ["laudo", "ordem", "metodologia"],
    visual: {
      mode: "illustration",
      subtitle: "Sequencia logica do documento tecnico",
      title: "Laudo patologico",
    },
  }),
  createQuestion({
    id: "ADV-028",
    level: "advanced",
    type: "true-false",
    category: "corrosao",
    difficulty: 4,
    question:
      "Um revestimento protetor de alta performance substitui a remocao do concreto solto em reparos de corrosao.",
    correctAnswer: false,
    explanation:
      "Se existe concreto deteriorado e aco comprometido, o substrato precisa ser saneado antes da protecao final.",
    hints: ["Protecao final nao substitui preparacao do sistema."],
    tags: ["corrosao", "reparo", "revestimento"],
  }),
  createQuestion({
    id: "ADV-029",
    level: "advanced",
    type: "multiple-choice",
    category: "corrosao",
    difficulty: 5,
    question:
      "Em concreto contaminado por cloretos, qual abordagem costuma ser mais coerente do que apenas repintar a superficie?",
    options: [
      "Diagnosticar contaminacao, remover zonas comprometidas e definir reparo/protecao adequados",
      "Aplicar tinta impermeavel e encerrar o caso",
      "Aumentar a ventilacao do ambiente",
      "Molhar a estrutura para reduzir sais",
    ],
    correctAnswer: 0,
    explanation:
      "Cloretos no concreto exigem diagnostico, eventual remocao localizada, reparo e barreiras apropriadas para controlar recorrencia.",
    hints: ["Quando o agente agressivo esta no concreto, a solucao precisa ser mais profunda."],
    tags: ["cloretos", "reparo", "estrategia"],
  }),
  createQuestion({
    id: "ADV-030",
    level: "advanced",
    type: "open-ended",
    category: "outros",
    difficulty: 5,
    question:
      "Explique por que um quadro multipatologico exige hierarquizacao de risco antes da escolha do reparo.",
    explanation:
      "A resposta deve abordar risco a seguranca, progressividade, causa-raiz, necessidade de ensaios e sequenciamento tecnico de intervencoes.",
    keywords: ["risco", "causa", "seguranca", "prioridade"],
    minLength: 60,
    points: 30,
    coinReward: 10,
    tags: ["multipatologico", "risco", "discursiva"],
    visual: {
      mode: "illustration",
      subtitle: "Leitura de prioridade tecnica em danos combinados",
      title: "Hierarquia de risco",
    },
  }),
];

export const questionBank: QuizQuestion[] = [
  ...beginnerQuestions,
  ...intermediateQuestions,
  ...advancedQuestions,
];
