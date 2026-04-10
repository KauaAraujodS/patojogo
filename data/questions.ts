export type QuizLevel = "beginner" | "intermediate" | "advanced";

export type QuizLevelSlug = "iniciante" | "intermediario" | "avancado";

export type QuizQuestionType =
  | "multiple-choice"
  | "image-identification"
  | "true-false"
  | "matching"
  | "ordering"
  | "open-ended";

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
  hintsUsed: number;
  isCorrect: boolean;
  questionId: string;
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
  levelProgress: Record<QuizLevel, QuizLevelProgress>;
  unlockedLevels: QuizLevel[];
  userId: string;
};

export type QuizReviewItem = {
  explanation: string;
  isCorrect: boolean;
  questionId: string;
  questionText: string;
  selectedAnswerLabel: string;
  type: QuizQuestionType;
};

export type QuizAttemptSummary = {
  accuracy: number;
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

// Banco seed inicial. A estrutura ja aceita os 90 itens planejados,
// mas nesta etapa o projeto fica com um conjunto tecnico menor e mais controlado.
export const questionBank: QuizQuestion[] = [
  {
    id: "BEG-001",
    level: "beginner",
    type: "image-identification",
    category: "fissuras",
    difficulty: 1,
    question: "Identifique a patologia mostrada na imagem:",
    image: "/quiz/fissura-vertical-placeholder.png",
    options: [
      "Fissura estrutural",
      "Trinca de retracao",
      "Eflorescencia",
      "Descolamento de reboco",
    ],
    correctAnswer: 0,
    explanation:
      "Uma fissura vertical com abertura mais expressiva costuma indicar problema estrutural ligado a carga ou recalque diferencial.",
    points: 5,
    coinReward: 2,
    hints: [
      "Observe a direcao predominante da abertura.",
      "Fissuras verticais costumam pedir maior atencao estrutural.",
    ],
    tags: ["fissura", "visual", "estrutural"],
  },
  {
    id: "BEG-002",
    level: "beginner",
    type: "true-false",
    category: "infiltracao",
    difficulty: 1,
    question:
      "A infiltracao em estruturas de concreto pode favorecer a corrosao das armaduras.",
    correctAnswer: true,
    explanation:
      "A agua facilita o transporte de agentes agressivos e de oxigenio ate o aco, favorecendo a corrosao.",
    points: 5,
    coinReward: 2,
    tags: ["infiltracao", "corrosao", "conceito"],
  },
  {
    id: "BEG-003",
    level: "beginner",
    type: "multiple-choice",
    category: "fissuras",
    difficulty: 2,
    question: "Qual situacao costuma gerar fissuras por retracao em revestimentos?",
    options: [
      "Secagem rapida e cura inadequada",
      "Corrosao de armaduras profundas",
      "Sobrecarga permanente em pilares",
      "Ataque por sulfatos",
    ],
    correctAnswer: 0,
    explanation:
      "Quando a cura e ruim e a perda de agua ocorre rapido demais, o material retrai e gera fissuras superficiais.",
    points: 5,
    coinReward: 2,
    hints: [
      "Pense no comportamento da argamassa logo apos a aplicacao.",
      "O problema aparece muito em ambientes quentes e secos.",
    ],
    tags: ["retracao", "cura", "revestimento"],
  },
  {
    id: "BEG-004",
    level: "beginner",
    type: "multiple-choice",
    category: "descolamento",
    difficulty: 2,
    question:
      "Quando um revestimento oco e com som cavo aparece na parede, a patologia mais provavel e:",
    options: [
      "Carbonatacao",
      "Descolamento",
      "Segregacao",
      "Lixiviacao",
    ],
    correctAnswer: 1,
    explanation:
      "Som cavo e perda de aderencia sao sinais tipicos de descolamento entre camadas.",
    points: 5,
    coinReward: 2,
    tags: ["descolamento", "revestimento", "aderencia"],
  },
  {
    id: "INT-001",
    level: "intermediate",
    type: "multiple-choice",
    category: "corrosao",
    difficulty: 3,
    question:
      "Qual faixa de pH do concreto tende a proteger melhor as armaduras da corrosao?",
    options: [
      "pH entre 5 e 7",
      "pH entre 8 e 10",
      "pH entre 12 e 13",
      "pH nao interfere",
    ],
    correctAnswer: 2,
    explanation:
      "O concreto alcalino cria uma camada passivadora no aco. Com carbonatacao, essa protecao se perde.",
    points: 10,
    coinReward: 5,
    hints: [
      "Pense na alcalinidade natural do cimento Portland.",
      "A carbonatacao reduz exatamente essa faixa protetiva.",
    ],
    references: ["NBR 6118", "Manual de reparo Helene"],
    tags: ["corrosao", "quimica", "ph"],
  },
  {
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
      "Cada ensaio nao destrutivo responde uma pergunta tecnica diferente durante a inspecao.",
    points: 15,
    coinReward: 7,
    tags: ["ensaios", "inspecao", "ndt"],
  },
  {
    id: "INT-003",
    level: "intermediate",
    type: "image-identification",
    category: "outros",
    difficulty: 3,
    question: "A mancha branca pulverulenta vista na superficie indica, em geral:",
    image: "/quiz/eflorescencia-placeholder.png",
    options: [
      "Desplacamento por corrosao",
      "Eflorescencia",
      "Segregacao de brita",
      "Recalque diferencial",
    ],
    correctAnswer: 1,
    explanation:
      "Eflorescencia ocorre pela migracao de sais soluveis, que cristalizam na superficie apos evaporacao da agua.",
    points: 10,
    coinReward: 5,
    tags: ["eflorescencia", "imagem", "umidade"],
  },
  {
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
    points: 10,
    coinReward: 5,
    tags: ["carbonatacao", "corrosao", "durabilidade"],
  },
  {
    id: "ADV-001",
    level: "advanced",
    type: "multiple-choice",
    category: "corrosao",
    difficulty: 5,
    question:
      "Uma laje apresenta manchas ferruginosas, fissuras mapeadas, armaduras expostas e lascamento. Qual sequencia de eventos e a mais provavel?",
    options: [
      "Fissuras, infiltracao, carbonatacao, corrosao, lascamento",
      "Carbonatacao, corrosao, expansao, fissuras, lascamento",
      "Infiltracao, corrosao, fissuras, carbonatacao, lascamento",
      "Lascamento, infiltracao, fissuras, corrosao, carbonatacao",
    ],
    correctAnswer: 1,
    explanation:
      "A perda da alcalinidade antecede a corrosao. A expansao dos produtos de corrosao gera tensoes internas, fissuras e depois lascamento.",
    points: 20,
    coinReward: 10,
    hints: [
      "Considere a perda da camada passivadora antes do dano aparente.",
      "O volume do produto de corrosao e maior do que o do aco original.",
    ],
    references: ["HELENE, Paulo - Manual de Reparo", "NBR 6118"],
    tags: ["corrosao", "diagnostico", "analise-complexa"],
  },
  {
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
      "O fluxo tecnico correto comeca no diagnostico e projeto. So depois entram remocao, preparo, recomposicao e protecao final.",
    points: 20,
    coinReward: 10,
    tags: ["reparo", "procedimento", "corrosao"],
  },
  {
    id: "ADV-003",
    level: "advanced",
    type: "open-ended",
    category: "fissuras",
    difficulty: 4,
    question:
      "Descreva as diferencas entre fissuracao estrutural e nao estrutural em elementos de concreto.",
    explanation:
      "A resposta esperada deve separar causas ligadas a solicitacoes e seguranca estrutural de causas ligadas a retracao, variacao termica e acabamentos.",
    keywords: ["carga", "retracao", "gravidade", "estrutural"],
    minLength: 50,
    points: 30,
    coinReward: 10,
    tags: ["fissuracao", "diagnostico", "discursiva"],
  },
  {
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
      "Fissuras inclinadas, deformacao funcional e travamento de esquadrias costumam aparecer em cenarios de movimentacao diferencial significativa.",
    points: 20,
    coinReward: 10,
    tags: ["recalque", "diagnostico", "movimentacao"],
  },
];
