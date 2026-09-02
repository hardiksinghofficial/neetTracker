export interface FormulaItem {
  id: number;
  chapter: string;
  topic: string;
  formula: string;
  variables: string;
  units: string;
  neetTrapTip: string;
}

export interface ExceptionItem {
  id: number;
  category: string;
  rule: string;
  exception: string;
  reason: string;
  ncertReference: string;
}

export interface ReagentItem {
  id: number;
  reagentName: string;
  formula: string;
  specificFunction: string;
  exampleReaction: string;
  examTrapNote: string;
}

export interface BiologyNumberItem {
  id: number;
  parameter: string;
  valueWithUnit: string;
  context: string;
  chapter: string;
}

export const PHYSICS_FORMULAS: FormulaItem[] = [
  {
    id: 1,
    chapter: 'Ray Optics',
    topic: "Lens Maker's Equation",
    formula: '1/f = (μ_lens/μ_med - 1) × (1/R1 - 1/R2)',
    variables: 'f = focal length, μ = refractive index, R1, R2 = radii of curvature with Cartesian sign convention',
    units: 'Meters (m)',
    neetTrapTip: 'For equiconvex lens: R1 = +R, R2 = -R  ==>  1/f = (μ - 1)(2/R). If immersed in liquid with μ_med > μ_lens, lens changes from converging to diverging!',
  },
  {
    id: 2,
    chapter: 'Current Electricity',
    topic: 'Drift Velocity & Current Density',
    formula: 'I = n e A v_d   and   v_d = (e E τ) / m',
    variables: 'n = free electron density (m⁻³), e = 1.6×10⁻¹⁹ C, A = area, τ = relaxation time, m = electron mass',
    units: 'Current: Ampere (A), v_d: m/s',
    neetTrapTip: 'When wire is stretched to n times its length: Resistance becomes R_new = n² R_old (Volume remains constant!).',
  },
  {
    id: 3,
    chapter: 'Modern Physics',
    topic: 'De Broglie Wavelength of Charged Particle',
    formula: 'λ = h / p = h / √(2 m q V)  ==> For Electron: λ = 12.27 / √V  Å',
    variables: 'V = accelerating potential in Volts, h = Planck constant, q = charge',
    units: 'Angstroms (Å) or Meters (m)',
    neetTrapTip: 'For alpha particle: q = 2e, m = 4mp  ==>  λ_alpha = 0.101 / √V  Å. Do not confuse electron with proton/alpha constants.',
  },
  {
    id: 4,
    chapter: 'Thermodynamics',
    topic: 'Carnot Engine Efficiency',
    formula: 'η = 1 - T2/T1 = W / Q1',
    variables: 'T1 = Source Temperature (Kelvin!), T2 = Sink Temperature (Kelvin!)',
    units: 'Unitless ratio or %',
    neetTrapTip: 'CRITICAL TRAP: Always convert °C to Kelvin (K = °C + 273). If temperatures are given in Celsius, using them directly will give a wrong option from the question!',
  },
  {
    id: 5,
    chapter: 'Electromagnetic Induction',
    topic: 'Self & Mutual Inductance Energy',
    formula: 'U = 1/2 L I²   and   M = k √(L1 L2)',
    variables: 'L = self inductance (Henry), I = current, k = coupling coefficient (0 ≤ k ≤ 1)',
    units: 'Energy: Joules (J), Inductance: Henry (H)',
    neetTrapTip: 'Induced EMF: e = -L (dI/dt). Back EMF opposes the growth or decay of current according to Lenz Law.',
  },
  {
    id: 6,
    chapter: 'Gravitation',
    topic: 'Escape Velocity & Orbital Velocity',
    formula: 'v_esc = √(2 G M / R) = √(2 g R)   and   v_orb = √(G M / R) = √(g R)',
    variables: 'G = 6.67×10⁻¹¹ N m²/kg², M = mass of planet, R = radius',
    units: 'km/s or m/s',
    neetTrapTip: 'Relation: v_esc = √2 × v_orb ≈ 1.414 × v_orb. Escape velocity is INDEPENDENT of mass of the projected projectile!',
  },
];

export const INORGANIC_EXCEPTIONS: ExceptionItem[] = [
  {
    id: 1,
    category: 'Ionization Enthalpy Anomalies',
    rule: 'Ionization energy generally increases left to right across a Period.',
    exception: 'IE1 of Boron < Beryllium (B: 801 kJ/mol vs Be: 899 kJ/mol), and IE1 of Oxygen < Nitrogen (O: 1314 kJ/mol vs N: 1402 kJ/mol).',
    reason: 'Be has stable fully filled 2s² configuration; N has stable half-filled 2p³ configuration. Removing electron from B (2p¹) and O (paired 2p⁴) requires less energy.',
    ncertReference: 'NCERT Class 11 Chemistry, Periodic Classification',
  },
  {
    id: 2,
    category: 'Electron Gain Enthalpy (EA)',
    rule: 'Electron affinity generally decreases down a group due to increased size.',
    exception: 'Chlorine has more negative Electron Gain Enthalpy than Fluorine (Cl: -349 kJ/mol vs F: -328 kJ/mol), and Sulfur > Oxygen.',
    reason: 'Fluorine 2p subshell is very compact, causing intense inter-electronic repulsion against the incoming electron.',
    ncertReference: 'NCERT Class 11 & 12 Chemistry, Halogens Group 17',
  },
  {
    id: 3,
    category: 'Thermal Stability of Carbonates',
    rule: 'Alkali metal carbonates are thermally stable and do not decompose upon normal heating.',
    exception: 'Li2CO3 decomposes on heating to Li2O + CO2.',
    reason: 'Small size and high polarising power of Li⁺ ion (covalent character & high lattice enthalpy of Li2O).',
    ncertReference: 'NCERT Class 11 Chemistry, Group 1 Alkali Metals',
  },
  {
    id: 4,
    category: 'Acidic Strength of Group 16 Hydrides',
    rule: 'Down Group 16: H2O < H2S < H2Se < H2Te (Acidic strength increases down the group).',
    exception: 'H2O is neutral and has unusually high boiling point (100°C) compared to H2S (-60°C).',
    reason: 'H-E bond dissociation energy decreases down the group (H-Te bond is weakest). H2O possesses extensive intermolecular Hydrogen bonding.',
    ncertReference: 'NCERT Class 12 Chemistry, Group 16 Chalcogens',
  },
];

export const ORGANIC_REAGENTS: ReagentItem[] = [
  {
    id: 1,
    reagentName: 'PCC (Pyridinium Chlorochromate)',
    formula: 'C5H5NH+ ClCrO3-',
    specificFunction: 'Selective mild oxidation of 1° Alcohols to Aldehydes and 2° Alcohols to Ketones (STOPS at Aldehyde without over-oxidizing to Carboxylic Acid!).',
    exampleReaction: 'CH3CH2CH2OH + PCC ➔ CH3CH2CHO (Propanal)',
    examTrapNote: 'Do not confuse with acidic KMnO4 or K2Cr2O7 which oxidize 1° alcohol all the way to Carboxylic Acid (-COOH).',
  },
  {
    id: 2,
    reagentName: 'DIBAL-H (Diisobutylaluminium Hydride)',
    formula: '[(CH3)2CHCH2]2AlH at -78°C',
    specificFunction: 'Selectively reduces Esters and Nitriles (-CN) to Aldehydes (-CHO) without reducing double bonds.',
    exampleReaction: 'R-COOR\' + DIBAL-H (at -78°C) followed by H2O ➔ R-CHO + R\'OH',
    examTrapNote: 'At higher temperatures, DIBAL-H can reduce down to alcohol; exam questions specify low temp / 1 equivalent.',
  },
  {
    id: 3,
    reagentName: 'Lucas Reagent',
    formula: 'Anhydrous ZnCl2 + Conc. HCl',
    specificFunction: 'Tests for 1°, 2°, 3° Alcohols via turbidity of alkyl chloride:',
    exampleReaction: '3° Alcohol: Immediate turbidity; 2° Alcohol: Turbidity in 5 mins; 1° Alcohol: No turbidity at room temp.',
    examTrapNote: 'Mechanism is SN1 for 2°/3° alcohols (carbocation intermediate stability 3° > 2° > 1°).',
  },
  {
    id: 4,
    reagentName: 'Ozonolysis (Reductive vs Oxidative)',
    formula: '1. O3,  2. Zn/H2O (or (CH3)2S)',
    specificFunction: 'Cleaves C=C double bonds into Carbonyl groups without carboxylic acid formation.',
    exampleReaction: '2-Methylbut-2-ene + O3/Zn/H2O ➔ Acetone (CH3COCH3) + Acetaldehyde (CH3CHO)',
    examTrapNote: 'If H2O2 is used instead of Zn/H2O (Oxidative), aldehydes get further oxidized to Carboxylic Acids!',
  },
];

export const BIOLOGY_NCERT_NUMBERS: BiologyNumberItem[] = [
  { id: 1, parameter: 'Glomerular Filtration Rate (GFR)', valueWithUnit: '125 mL/min (180 Litres/day)', context: 'Normal kidney filtration in healthy human (99% reabsorbed, only 1.5 L urine formed)', chapter: 'Excretory Products' },
  { id: 2, parameter: 'Cardiac Output (CO)', valueWithUnit: '5000 mL/min (5 Litres/min)', context: 'Stroke Volume (70 mL) × Heart Rate (72 beats/min)', chapter: 'Body Fluids & Circulation' },
  { id: 3, parameter: 'Tidal Volume (TV)', valueWithUnit: '500 mL (6000–8000 mL/min)', context: 'Normal volume of air inspired or expired per breath', chapter: 'Breathing & Gas Exchange' },
  { id: 4, parameter: 'RBC Lifespan & Normal Count', valueWithUnit: '120 days & 5 - 5.5 million/mm³', context: 'Destroyed in Spleen (Graveyard of RBCs)', chapter: 'Body Fluids & Circulation' },
  { id: 5, parameter: 'Mycoplasma & PPLO Dimensions', valueWithUnit: '0.3 μm (Mycoplasma) & 0.1 μm (PPLO)', context: 'Smallest known living cells without cell wall, can survive without O2', chapter: 'Cell: Unit of Life' },
  { id: 6, parameter: 'Human Genome Project Base Pairs', valueWithUnit: '3.1647 × 10⁹ base pairs (3.16 billion bp)', context: 'Total genes estimated: ~30,000; Average gene has 3000 bases; Chromosome 1 has most genes (2968), Y has fewest (231)', chapter: 'Molecular Basis of Inheritance' },
  { id: 7, parameter: 'Human Blood pH', valueWithUnit: '7.4 (Slightly alkaline)', context: 'Maintained by Bicarbonate buffer system (H2CO3 / HCO3⁻)', chapter: 'Body Fluids & Circulation' },
];
