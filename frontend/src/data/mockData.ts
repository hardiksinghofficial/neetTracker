export interface MockTest {
  id: number;
  name: string;
  date: string;
  type: string;
  totalScore: number;
  maxScore: number;
  physicsScore: number;
  chemistryScore: number;
  biologyScore: number;
  correctAnswers: number;
  wrongAnswers: number;
  unattempted: number;
  timeTakenMinutes: number;
  estimatedAIR: number;
  percentile: number;
  accuracy: number;
  mistakes: {
    questionNo: number;
    subject: 'Physics' | 'Chemistry' | 'Biology';
    topic: string;
    type: 'Silly Mistake' | 'Concept Gap' | 'Time Pressure' | 'Calculation Error';
    note: string;
  }[];
}

export interface Flashcard {
  id: number;
  subject: 'Physics' | 'Chemistry' | 'Biology';
  topic: string;
  chapter: string;
  front: string;
  back: string;
  subgroup?: 'Botany' | 'Zoology';
  highYield: boolean;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface TimetableEntry {
  id: number;
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  startHour?: number; // 8.0 = 8:00 AM, 10.5 = 10:30 AM
  durationHours?: number;
  duration?: number;
  time?: string;
  isCompleted?: boolean;
  title: string;
  subject: 'Physics' | 'Chemistry' | 'Biology' | 'Mock Test' | 'Revision';
  color?: string;
}

export const MOCK_TESTS_DATA: MockTest[] = [
  {
    id: 1,
    name: 'Allen All India Full Mock #06',
    date: '2024-05-28',
    type: 'Full Mock (720)',
    totalScore: 662,
    maxScore: 720,
    physicsScore: 160,
    chemistryScore: 165,
    biologyScore: 337,
    correctAnswers: 168,
    wrongAnswers: 10,
    unattempted: 2,
    timeTakenMinutes: 174,
    estimatedAIR: 1450,
    percentile: 99.68,
    accuracy: 94.4,
    mistakes: [
      { questionNo: 24, subject: 'Physics', topic: 'Rotational Motion', type: 'Calculation Error', note: 'Used diameter instead of radius for Moment of Inertia' },
      { questionNo: 68, subject: 'Chemistry', topic: 'Electrochemistry', type: 'Concept Gap', note: 'Forgot Nernst equation factor for 2-electron transfer' },
      { questionNo: 112, subject: 'Biology', topic: 'Molecular Genetics', type: 'Silly Mistake', note: 'Misread promoter position on template strand (3 vs 5)' },
    ],
  },
  {
    id: 2,
    name: 'Aakash Grand Mock Test #05',
    date: '2024-05-21',
    type: 'Full Mock (720)',
    totalScore: 645,
    maxScore: 720,
    physicsScore: 152,
    chemistryScore: 160,
    biologyScore: 333,
    correctAnswers: 165,
    wrongAnswers: 15,
    unattempted: 0,
    timeTakenMinutes: 180,
    estimatedAIR: 2850,
    percentile: 99.41,
    accuracy: 91.7,
    mistakes: [
      { questionNo: 14, subject: 'Physics', topic: 'Ray Optics', type: 'Time Pressure', note: 'Rushed combination lens calculation in last 5 minutes' },
      { questionNo: 72, subject: 'Chemistry', topic: 'Coordination Compounds', type: 'Concept Gap', note: 'Confused strong field pairing in d7 octahedral complex' },
      { questionNo: 144, subject: 'Biology', topic: 'Plant Physiology', type: 'Silly Mistake', note: 'Marked C3 instead of C4 for Kranz anatomy example' },
    ],
  },
  {
    id: 3,
    name: 'Physics Part Syllabus Test: Electrodynamics',
    date: '2024-05-16',
    type: 'Chapter Test (180)',
    totalScore: 165,
    maxScore: 180,
    physicsScore: 165,
    chemistryScore: 0,
    biologyScore: 0,
    correctAnswers: 42,
    wrongAnswers: 3,
    unattempted: 0,
    timeTakenMinutes: 42,
    estimatedAIR: 890,
    percentile: 99.82,
    accuracy: 93.3,
    mistakes: [
      { questionNo: 8, subject: 'Physics', topic: 'Capacitance', type: 'Calculation Error', note: 'Dielectric insertion with battery connected vs disconnected' },
    ],
  },
  {
    id: 4,
    name: 'Physics & Chem Major Test #04',
    date: '2024-05-09',
    type: 'Full Mock (720)',
    totalScore: 628,
    maxScore: 720,
    physicsScore: 148,
    chemistryScore: 154,
    biologyScore: 326,
    correctAnswers: 161,
    wrongAnswers: 16,
    unattempted: 3,
    timeTakenMinutes: 185,
    estimatedAIR: 4520,
    percentile: 99.12,
    accuracy: 90.9,
    mistakes: [
      { questionNo: 33, subject: 'Physics', topic: 'Semiconductors', type: 'Silly Mistake', note: 'Zener diode breakdown polarity confusion' },
      { questionNo: 85, subject: 'Chemistry', topic: 'Aldehydes & Ketones', type: 'Concept Gap', note: 'Reagent differentiation for Fehling vs Tollens' },
    ],
  },
  {
    id: 5,
    name: 'PW National Mock Test #03',
    date: '2024-05-02',
    type: 'Full Mock (720)',
    totalScore: 615,
    maxScore: 720,
    physicsScore: 142,
    chemistryScore: 151,
    biologyScore: 322,
    correctAnswers: 158,
    wrongAnswers: 17,
    unattempted: 5,
    timeTakenMinutes: 190,
    estimatedAIR: 6100,
    percentile: 98.79,
    accuracy: 90.3,
    mistakes: [
      { questionNo: 18, subject: 'Physics', topic: 'Current Electricity', type: 'Time Pressure', note: 'Potentiometer gradient calculation error under rush' },
      { questionNo: 94, subject: 'Biology', topic: 'Human Reproduction', type: 'Silly Mistake', note: 'Hormone peak timings during 14th day of menstrual cycle' },
    ],
  },
];

export const STUDY_ANALYTICS = {
  dailyStreak: 18,
  totalHoursMonth: 142.5,
  weeklyTargetHours: 50,
  currentWeekHours: 41.5,
  overallSyllabusPercent: 74,
  estimatedNeetScore: 670,
  xpPoints: 4850,
  level: 14,
  levelTitle: 'AIIMS Contender',
  nextLevelXp: 5500,
  subjectBreakdown: [
    { name: 'Biology', hours: 62.5, percent: 84, color: '#10B981', topicsDone: 112, totalTopics: 133 },
    { name: 'Chemistry', hours: 44.0, percent: 76, color: '#F59E0B', topicsDone: 57, totalTopics: 75 },
    { name: 'Physics', hours: 36.0, percent: 63, color: '#6366F1', topicsDone: 62, totalTopics: 98 },
  ],
  weeklyTrends: [
    { day: 'Mon', physics: 2.5, chemistry: 2.0, biology: 3.5, total: 8.0, focusScore: 92 },
    { day: 'Tue', physics: 2.0, chemistry: 2.5, biology: 3.0, total: 7.5, focusScore: 88 },
    { day: 'Wed', physics: 1.5, chemistry: 3.0, biology: 4.0, total: 8.5, focusScore: 94 },
    { day: 'Thu', physics: 3.0, chemistry: 1.5, biology: 2.5, total: 7.0, focusScore: 85 },
    { day: 'Fri', physics: 2.5, chemistry: 2.5, biology: 3.5, total: 8.5, focusScore: 90 },
    { day: 'Sat', physics: 3.5, chemistry: 3.0, biology: 4.0, total: 10.5, focusScore: 96 },
    { day: 'Sun', physics: 3.0, chemistry: 2.5, biology: 3.0, total: 8.5, focusScore: 91 },
  ],
};

export const FLASHCARDS_DECK: Flashcard[] = [
  {
    id: 1,
    subject: 'Physics',
    topic: 'Semiconductors',
    chapter: 'Semiconductor Electronics',
    highYield: true,
    difficulty: 'Medium',
    front: 'What is the relation between current amplification factors α (alpha) and β (beta) in transistor configuration?',
    back: 'β = α / (1 - α)   and   α = β / (1 + β)\n\n• Common Base current gain: α < 1 (typically 0.95 - 0.99)\n• Common Emitter current gain: β >> 1 (typically 20 - 200)',
  },
  {
    id: 2,
    subject: 'Biology',
    topic: 'Genetics II',
    chapter: 'Molecular Basis of Inheritance',
    subgroup: 'Botany',
    highYield: true,
    difficulty: 'Hard',
    front: 'What are the stop codons (nonsense codons) and start codon in the genetic code?',
    back: '• Start Codon: AUG (codes for Methionine / N-formylmethionine)\n• Stop Codons:\n  1. UAA (Ochre)\n  2. UAG (Amber)\n  3. UGA (Opal)\n\n*Note: UGA codes for Selenocysteine in rare special cases.',
  },
  {
    id: 3,
    subject: 'Chemistry',
    topic: 'Organic Name Reactions',
    chapter: 'Aldehydes, Ketones and Carboxylic Acids',
    highYield: true,
    difficulty: 'Hard',
    front: 'What is the Cannizzaro Reaction and which aldehydes undergo it?',
    back: 'Aldehydes lacking α-hydrogen (e.g. Formaldehyde HCHO, Benzaldehyde C6H5CHO, Trimethylacetaldehyde) undergo disproportionation (redox) in conc. KOH (50%):\n\n2 HCHO + conc. KOH ➔ CH3OH (Methanol) + HCOOK (Potassium formate)',
  },
  {
    id: 4,
    subject: 'Physics',
    topic: 'Ray Optics',
    chapter: 'Ray Optics and Optical Instruments',
    highYield: true,
    difficulty: 'Medium',
    front: "State Lens Maker's Formula and how focal length changes when immersed in liquid of higher refractive index.",
    back: "1/f = (μ_lens/μ_med - 1) × (1/R1 - 1/R2)\n\n• If μ_med > μ_lens: Lens changes its nature! (Convex behaves as Concave, and Concave behaves as Convex)\n• If μ_med = μ_lens: f = ∞ (Lens disappears and acts as flat glass plate)",
  },
  {
    id: 5,
    subject: 'Biology',
    topic: 'Endocrine System',
    chapter: 'Chemical Coordination and Integration',
    subgroup: 'Zoology',
    highYield: true,
    difficulty: 'Medium',
    front: 'Name the hormones secreted by Anterior Pituitary vs Posterior Pituitary.',
    back: '• Anterior Pituitary (Adenohypophysis):\n  GH, PRL, TSH, ACTH, LH, FSH\n\n• Posterior Pituitary (Neurohypophysis):\n  Stores & releases Oxytocin and Vasopressin (ADH) [synthesized by Hypothalamus!]',
  },
  {
    id: 6,
    subject: 'Chemistry',
    topic: 'Coordination Chemistry',
    chapter: 'Coordination Compounds',
    highYield: true,
    difficulty: 'Hard',
    front: 'What is the Spectrochemical Series order for common ligands (Weak to Strong field)?',
    back: 'I⁻ < Br⁻ < SCN⁻ < Cl⁻ < S²⁻ < F⁻ < OH⁻ < C2O4²⁻ < H2O < NCS⁻ < EDTA⁴⁻ < NH3 < en < CN⁻ < CO\n\n*CO is the strongest field ligand and causes maximum crystal field splitting (Δo).*',
  },
  {
    id: 7,
    subject: 'Biology',
    topic: 'Photosynthesis',
    chapter: 'Photosynthesis in Higher Plants',
    subgroup: 'Botany',
    highYield: true,
    difficulty: 'Hard',
    front: 'What is Kranz Anatomy and why does Photorespiration not occur in C4 plants?',
    back: '• Kranz Anatomy: Mesophyll cells surround Bundle Sheath cells having thick walls, no intercellular spaces, and agranal large chloroplasts.\n• No Photorespiration: C4 plants pump CO2 via malate into bundle sheath cells, maintaining high [CO2] around RuBisCO, completely avoiding oxygenase activity.',
  },
  {
    id: 8,
    subject: 'Physics',
    topic: 'Rotational Dynamics',
    chapter: 'System of Particles & Rotational Motion',
    highYield: true,
    difficulty: 'Hard',
    front: 'Give the Moment of Inertia for: (1) Solid Cylinder (2) Hollow Cylinder (3) Solid Sphere (4) Hollow Sphere about central axis.',
    back: '1. Solid Cylinder / Disc: I = 1/2 M R²\n2. Hollow Cylinder / Ring: I = M R²\n3. Solid Sphere: I = 2/5 M R²\n4. Hollow Sphere (Shell): I = 2/3 M R²',
  },
  {
    id: 9,
    subject: 'Chemistry',
    topic: 'Electrochemistry',
    chapter: 'Electrochemistry',
    highYield: true,
    difficulty: 'Medium',
    front: 'State Nernst Equation for cell potential at 298 K.',
    back: 'E_cell = E°_cell - (0.0591 / n) × log10(Q)\n\n• n = number of moles of electrons exchanged\n• Q = Reaction Quotient = [Products]^p / [Reactants]^r\n• At Equilibrium: E_cell = 0  ==>  E°_cell = (0.0591/n) × log10(K_eq)',
  },
  {
    id: 10,
    subject: 'Biology',
    topic: 'Cell Biology',
    chapter: 'Cell Cycle and Cell Division',
    subgroup: 'Botany',
    highYield: true,
    difficulty: 'Easy',
    front: 'In which stage of Prophase-I does Crossing Over occur, and which enzyme facilitates it?',
    back: '• Stage: Pachytene stage of Prophase-I\n• Enzyme: Recombinase complex\n\n• Synaptonemal complex forms in: Zygotene\n• Chiasmata become visible in: Diplotene\n• Terminalisation occurs in: Diakinesis',
  },
];

export const TIMETABLE_DATA: TimetableEntry[] = [
  { id: 1, day: 'Mon', startHour: 8.0, durationHours: 2.5, title: 'Physics: Ray Optics numericals', subject: 'Physics', color: 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300' },
  { id: 2, day: 'Mon', startHour: 11.0, durationHours: 2.0, title: 'Chemistry: GOC Mechanisms', subject: 'Chemistry', color: 'bg-amber-950/60 border-amber-500/40 text-amber-300' },
  { id: 3, day: 'Mon', startHour: 14.5, durationHours: 3.0, title: 'Biology: Genetics NCERT Line-by-Line', subject: 'Biology', color: 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' },
  { id: 4, day: 'Mon', startHour: 18.0, durationHours: 1.5, title: 'Daily Test Mistake Analysis & Flashcards', subject: 'Revision', color: 'bg-rose-950/60 border-rose-500/40 text-rose-300' },

  { id: 5, day: 'Tue', startHour: 8.0, durationHours: 2.5, title: 'Chemistry: Electrochemistry & Solutions', subject: 'Chemistry', color: 'bg-amber-950/60 border-amber-500/40 text-amber-300' },
  { id: 6, day: 'Tue', startHour: 11.0, durationHours: 2.5, title: 'Physics: Current Electricity Circuits', subject: 'Physics', color: 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300' },
  { id: 7, day: 'Tue', startHour: 14.5, durationHours: 3.0, title: 'Biology: Human Reproduction & Health', subject: 'Biology', color: 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' },
  { id: 8, day: 'Tue', startHour: 18.0, durationHours: 1.5, title: 'Active Recall Session', subject: 'Revision', color: 'bg-rose-950/60 border-rose-500/40 text-rose-300' },

  { id: 9, day: 'Wed', startHour: 8.0, durationHours: 3.0, title: 'FULL NEET MOCK TEST (180 Qs)', subject: 'Mock Test', color: 'bg-rose-950/80 border-rose-500/60 text-rose-200' },
  { id: 10, day: 'Wed', startHour: 12.0, durationHours: 2.0, title: 'Mock Paper Analysis & Error Tagging', subject: 'Revision', color: 'bg-rose-950/60 border-rose-500/40 text-rose-300' },
  { id: 11, day: 'Wed', startHour: 15.0, durationHours: 3.0, title: 'Biology: Plant Physiology deep dive', subject: 'Biology', color: 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' },

  { id: 12, day: 'Thu', startHour: 8.0, durationHours: 2.5, title: 'Physics: Rotational Dynamics & COM', subject: 'Physics', color: 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300' },
  { id: 13, day: 'Thu', startHour: 11.0, durationHours: 2.0, title: 'Chemistry: Coordination Compounds', subject: 'Chemistry', color: 'bg-amber-950/60 border-amber-500/40 text-amber-300' },
  { id: 14, day: 'Thu', startHour: 14.5, durationHours: 3.0, title: 'Biology: Biotechnology I & II', subject: 'Biology', color: 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' },
  { id: 15, day: 'Thu', startHour: 18.0, durationHours: 1.5, title: 'Formula Sheet Revision', subject: 'Revision', color: 'bg-rose-950/60 border-rose-500/40 text-rose-300' },

  { id: 16, day: 'Fri', startHour: 8.0, durationHours: 2.5, title: 'Chemistry: Aldehydes & Ketones PyQs', subject: 'Chemistry', color: 'bg-amber-950/60 border-amber-500/40 text-amber-300' },
  { id: 17, day: 'Fri', startHour: 11.0, durationHours: 2.5, title: 'Physics: Semiconductors & Logic Gates', subject: 'Physics', color: 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300' },
  { id: 18, day: 'Fri', startHour: 14.5, durationHours: 3.0, title: 'Biology: Ecology & Environment', subject: 'Biology', color: 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' },

  { id: 19, day: 'Sat', startHour: 8.3, durationHours: 3.2, title: 'NATIONAL LEVEL FULL LENGTH MOCK TEST', subject: 'Mock Test', color: 'bg-rose-950/80 border-rose-500/60 text-rose-200' },
  { id: 20, day: 'Sat', startHour: 13.0, durationHours: 2.5, title: 'Comprehensive Mistake Log Upload', subject: 'Revision', color: 'bg-rose-950/60 border-rose-500/40 text-rose-300' },
  { id: 21, day: 'Sat', startHour: 16.0, durationHours: 2.5, title: 'Weak Topics Targeted Practice', subject: 'Physics', color: 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300' },

  { id: 22, day: 'Sun', startHour: 9.0, durationHours: 2.0, title: 'Weekly Recap & Biology Revision Marathon', subject: 'Biology', color: 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' },
  { id: 23, day: 'Sun', startHour: 11.5, durationHours: 2.0, title: 'Formula & NCERT Tables Testing', subject: 'Chemistry', color: 'bg-amber-950/60 border-amber-500/40 text-amber-300' },
  { id: 24, day: 'Sun', startHour: 15.0, durationHours: 2.0, title: 'Parent Weekly Summary Review & Next Week Planning', subject: 'Revision', color: 'bg-rose-950/60 border-rose-500/40 text-rose-300' },
];
