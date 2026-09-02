import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const SYLLABUS_DATA = {
  Physics: [
    { name: 'Units and Measurements', classLevel: 11, weightage: 2.5, isHighYield: false, topics: ['SI Units & Fundamental Quantities', 'Significant Figures & Rounding Off', 'Dimensional Analysis & Applications', 'Errors in Measurement'] },
    { name: 'Motion in a Straight Line', classLevel: 11, weightage: 3.5, isHighYield: false, topics: ['Position, Distance & Displacement', 'Speed, Velocity & Acceleration Graphs', 'Kinematic Equations for Uniform Acceleration', 'Relative Velocity in 1D'] },
    { name: 'Motion in a Plane', classLevel: 11, weightage: 4.5, isHighYield: true, topics: ['Vectors: Dot & Cross Products', 'Projectile Motion on Horizontal & Incline', 'Uniform Circular Motion', 'Relative Velocity in 2D'] },
    { name: 'Laws of Motion', classLevel: 11, weightage: 5.0, isHighYield: true, topics: ["Newton's Laws of Motion", 'Free Body Diagrams & Connected Bodies', 'Friction: Static & Kinetic', 'Banking of Roads & Vertical Circular Motion'] },
    { name: 'Work, Energy and Power', classLevel: 11, weightage: 4.5, isHighYield: true, topics: ['Work Done by Constant and Variable Forces', 'Work-Energy Theorem', 'Potential Energy & Conservation of Energy', 'Collisions in 1D and 2D'] },
    { name: 'System of Particles and Rotational Motion', classLevel: 11, weightage: 6.0, isHighYield: true, topics: ['Centre of Mass & Equilibrium', 'Torque & Angular Momentum', 'Moment of Inertia Theorems', 'Rolling Motion without Slipping'] },
    { name: 'Gravitation', classLevel: 11, weightage: 3.5, isHighYield: false, topics: ["Universal Law of Gravitation & Kepler's Laws", 'Variation of g (Height, Depth, Latitude)', 'Gravitational Potential Energy & Escape Velocity', 'Satellites & Orbital Speed'] },
    { name: 'Mechanical Properties of Solids', classLevel: 11, weightage: 2.0, isHighYield: false, topics: ["Stress-Strain Curve & Hooke's Law", "Young's, Bulk and Shear Moduli", 'Elastic Potential Energy'] },
    { name: 'Mechanical Properties of Fluids', classLevel: 11, weightage: 4.0, isHighYield: true, topics: ["Pascal's Law & Hydraulic Lift", "Viscosity, Stokes' Law & Terminal Velocity", "Bernoulli's Theorem & Venturimeter", 'Surface Tension & Capillarity'] },
    { name: 'Thermal Properties of Matter', classLevel: 11, weightage: 2.5, isHighYield: false, topics: ['Thermal Expansion & Calorimetry', 'Heat Transfer: Conduction, Convection, Radiation', "Newton's Law of Cooling & Wien's Law"] },
    { name: 'Thermodynamics', classLevel: 11, weightage: 5.0, isHighYield: true, topics: ['Zeroth & First Law of Thermodynamics', 'Isothermal, Adiabatic, Isochoric, Isobaric Processes', 'Second Law & Carnot Engine'] },
    { name: 'Kinetic Theory of Gases', classLevel: 11, weightage: 3.0, isHighYield: false, topics: ['Equation of State of a Perfect Gas', 'RMS Speed & Degrees of Freedom', 'Law of Equipartition of Energy'] },
    { name: 'Oscillations (SHM)', classLevel: 11, weightage: 4.0, isHighYield: false, topics: ['Simple Harmonic Motion Equation & Energy', 'Simple Pendulum & Spring-Block Systems', 'Damped & Forced Oscillations'] },
    { name: 'Waves', classLevel: 11, weightage: 4.5, isHighYield: true, topics: ['Wave Velocity & Progressive Waves', 'Superposition & Standing Waves in Pipes/Strings', 'Beats & Doppler Effect'] },
    { name: 'Electric Charges and Fields', classLevel: 12, weightage: 4.5, isHighYield: true, topics: ["Coulomb's Law & Superposition", 'Electric Field Lines & Electric Dipole', "Gauss's Law and Applications"] },
    { name: 'Electrostatic Potential and Capacitance', classLevel: 12, weightage: 5.0, isHighYield: true, topics: ['Electrostatic Potential & Equipotential Surfaces', 'Potential Energy of Charges', 'Capacitors, Combinations & Dielectrics'] },
    { name: 'Current Electricity', classLevel: 12, weightage: 7.0, isHighYield: true, topics: ["Ohm's Law, Drift Velocity & Mobility", "Kirchhoff's Rules & Wheatstone Bridge", 'Cell Combinations & Internal Resistance', 'Potentiometer & Meter Bridge'] },
    { name: 'Moving Charges and Magnetism', classLevel: 12, weightage: 5.5, isHighYield: true, topics: ['Biot-Savart Law & Solenoids', "Ampere's Circuital Law", 'Lorentz Force on Charges & Conductors', 'Moving Coil Galvanometer'] },
    { name: 'Magnetism and Matter', classLevel: 12, weightage: 2.5, isHighYield: false, topics: ['Bar Magnet & Magnetic Dipole Moment', 'Dia, Para and Ferromagnetism'] },
    { name: 'Electromagnetic Induction', classLevel: 12, weightage: 4.0, isHighYield: false, topics: ["Faraday's & Lenz's Laws", 'Motional EMF & Eddy Currents', 'Self and Mutual Inductance'] },
    { name: 'Alternating Current', classLevel: 12, weightage: 4.5, isHighYield: true, topics: ['Peak & RMS Values of AC', 'LCR Series Circuit & Resonance', 'Power in AC & Transformers'] },
    { name: 'Electromagnetic Waves', classLevel: 12, weightage: 2.0, isHighYield: false, topics: ['Displacement Current & Maxwell Equations', 'Electromagnetic Spectrum Characteristics'] },
    { name: 'Ray Optics and Optical Instruments', classLevel: 12, weightage: 6.5, isHighYield: true, topics: ['Spherical Mirrors & Mirror Formula', 'Refraction, TIR & Prisms', "Lens Maker's Formula & Combinations", 'Microscopes & Astronomical Telescopes'] },
    { name: 'Wave Optics', classLevel: 12, weightage: 4.5, isHighYield: true, topics: ["Huygens' Principle & Wavefronts", "Young's Double Slit Experiment (YDSE)", 'Diffraction at a Single Slit'] },
    { name: 'Dual Nature of Radiation and Matter', classLevel: 12, weightage: 4.0, isHighYield: false, topics: ["Photoelectric Effect & Einstein's Equation", 'De Broglie Wavelength of Matter Waves'] },
    { name: 'Atoms', classLevel: 12, weightage: 3.0, isHighYield: false, topics: ['Rutherford Alpha Particle Scattering', "Bohr's Model & Energy Levels", 'Hydrogen Spectral Series'] },
    { name: 'Nuclei', classLevel: 12, weightage: 3.0, isHighYield: false, topics: ['Nuclear Size & Binding Energy Curve', 'Nuclear Fission and Fusion'] },
    { name: 'Semiconductor Electronics', classLevel: 12, weightage: 6.0, isHighYield: true, topics: ['Intrinsic & Extrinsic Semiconductors', 'p-n Junction Diode in Forward/Reverse Bias', 'Diodes as Half/Full Wave Rectifiers', 'Logic Gates (AND, OR, NOT, NAND, NOR)'] },
  ],
  Chemistry: [
    { name: 'Some Basic Concepts of Chemistry', classLevel: 11, weightage: 4.5, isHighYield: true, topics: ['Mole Concept & Molar Mass', 'Empirical & Molecular Formula', 'Stoichiometry & Limiting Reagents', 'Molarity, Molality & Mole Fraction'] },
    { name: 'Structure of Atom', classLevel: 11, weightage: 4.0, isHighYield: false, topics: ['Bohr Model & Hydrogen Spectrum', 'de Broglie Wavelength & Heisenberg Principle', 'Quantum Numbers & Electronic Configurations'] },
    { name: 'Classification of Elements & Periodicity', classLevel: 11, weightage: 3.5, isHighYield: false, topics: ['Periodic Trends in Atomic & Ionic Radii', 'Ionization Enthalpy & Electron Gain Enthalpy', 'Electronegativity Trends'] },
    { name: 'Chemical Bonding and Molecular Structure', classLevel: 11, weightage: 7.5, isHighYield: true, topics: ['Ionic Bonding & Born-Haber Cycle', 'VSEPR Theory & Molecular Geometry', 'Hybridization (sp, sp2, sp3, sp3d, sp3d2)', 'Molecular Orbital Theory & Bond Order', 'Hydrogen Bonding & Dipole Moment'] },
    { name: 'Thermodynamics (Chemistry)', classLevel: 11, weightage: 5.5, isHighYield: true, topics: ['First Law of Thermodynamics & Enthalpy', "Hess's Law of Constant Heat Summation", 'Entropy, Second Law & Gibbs Free Energy'] },
    { name: 'Equilibrium (Chemical & Ionic)', classLevel: 11, weightage: 7.0, isHighYield: true, topics: ["Kp, Kc & Le Chatelier's Principle", 'pH Scale, Ostwald Dilution Law & Ka/Kb', 'Buffer Solutions & Salt Hydrolysis', 'Solubility Product (Ksp) & Common Ion Effect'] },
    { name: 'Redox Reactions', classLevel: 11, weightage: 3.0, isHighYield: false, topics: ['Oxidation Number Calculation', 'Balancing Redox Reactions (Ion-Electron Method)'] },
    { name: 'Organic Chemistry: Basic Principles (GOC)', classLevel: 11, weightage: 8.0, isHighYield: true, topics: ['IUPAC Nomenclature', 'Inductive, Mesomeric & Hyperconjugation Effects', 'Carbocations, Carbanions & Free Radicals', 'Structural & Stereoisomerism (Optical, Geometrical)'] },
    { name: 'Hydrocarbons', classLevel: 11, weightage: 6.0, isHighYield: true, topics: ['Alkanes: Halogenation & Wurtz Reaction', 'Alkenes: Electrophilic Addition (Markovnikov)', 'Alkynes: Acidity & Ozonolysis', 'Aromatic Hydrocarbons: EAS Reactions'] },
    { name: 'Solutions', classLevel: 12, weightage: 5.5, isHighYield: true, topics: ["Henry's Law & Raoult's Law (Ideal/Non-Ideal)", 'Colligative Properties & Elevation of BP/Depression of FP', "Osmotic Pressure & Van't Hoff Factor"] },
    { name: 'Electrochemistry', classLevel: 12, weightage: 6.5, isHighYield: true, topics: ['Galvanic Cells & Nernst Equation', "Kohlrausch's Law & Molar Conductivity", "Faraday's Laws of Electrolysis"] },
    { name: 'Chemical Kinetics', classLevel: 12, weightage: 5.5, isHighYield: true, topics: ['Rate of Reaction, Order & Molecularity', 'Integrated Rate Equations (Zero & 1st Order)', 'Arrhenius Equation & Activation Energy'] },
    { name: 'The d- and f-Block Elements', classLevel: 12, weightage: 5.0, isHighYield: true, topics: ['Transition Elements Properties & Oxidation States', 'KMnO4 and K2Cr2O7 Chemistry', 'Lanthanoid Contraction'] },
    { name: 'Coordination Compounds', classLevel: 12, weightage: 6.5, isHighYield: true, topics: ["Werner's Theory & IUPAC Nomenclature", 'Valence Bond Theory & Magnetic Properties', 'Crystal Field Theory in Octahedral/Tetrahedral', 'Isomerism in Coordination Complexes'] },
    { name: 'Haloalkanes and Haloarenes', classLevel: 12, weightage: 5.0, isHighYield: true, topics: ['SN1 vs SN2 Reaction Mechanisms', 'Elimination Reactions (Saytzeff Rule)', 'Electrophilic Substitution in Haloarenes'] },
    { name: 'Alcohols, Phenols and Ethers', classLevel: 12, weightage: 6.0, isHighYield: true, topics: ['Preparation & Acidity of Alcohols and Phenols', "Reimer-Tiemann & Kolbe's Reactions", 'Williamson Ether Synthesis'] },
    { name: 'Aldehydes, Ketones and Carboxylic Acids', classLevel: 12, weightage: 7.5, isHighYield: true, topics: ['Nucleophilic Addition to Carbonyl Group', 'Aldol Condensation & Cannizzaro Reactions', 'Acidity of Carboxylic Acids & HVZ Reaction'] },
    { name: 'Amines', classLevel: 12, weightage: 4.5, isHighYield: false, topics: ['Basicity Order of Amines', 'Hoffmann Bromamide & Gabriel Phthalimide Synthesis', 'Diazonium Salts & Coupling Reactions'] },
    { name: 'Biomolecules (Chemistry)', classLevel: 12, weightage: 4.0, isHighYield: false, topics: ['Carbohydrates: Monosaccharides & Disaccharides', 'Proteins: Amino Acids, Peptide Bond & Structure', 'Nucleic Acids: DNA/RNA Structure'] },
  ],
  Biology: [
    { name: 'The Living World', classLevel: 11, subGroup: 'Botany', weightage: 2.0, isHighYield: false, topics: ['Characteristics of Living Organisms', 'Taxonomic Categories & Hierarchy', 'Binomial Nomenclature'] },
    { name: 'Biological Classification', classLevel: 11, subGroup: 'Botany', weightage: 4.5, isHighYield: true, topics: ['Kingdom Monera: Archaebacteria & Eubacteria', 'Kingdom Protista & Groups', 'Kingdom Fungi Classification', 'Viruses, Viroids, Prions and Lichens'] },
    { name: 'Plant Kingdom', classLevel: 11, subGroup: 'Botany', weightage: 4.0, isHighYield: true, topics: ['Algae (Chlorophyceae, Phaeophyceae, Rhodophyceae)', 'Bryophytes: Liverworts and Mosses', 'Pteridophytes & Heterospory', 'Gymnosperms & Angiosperms Life Cycles'] },
    { name: 'Animal Kingdom', classLevel: 11, subGroup: 'Zoology', weightage: 6.0, isHighYield: true, topics: ['Basis of Classification (Symmetry, Coelom)', 'Non-Chordates: Porifera to Hemichordata', 'Chordates: Protochordata & Vertebrata Classes'] },
    { name: 'Morphology of Flowering Plants', classLevel: 11, subGroup: 'Botany', weightage: 5.0, isHighYield: true, topics: ['Root, Stem & Leaf Modifications', 'Inflorescence & Flower Structure', 'Aestivation, Placentation & Fruit Types', 'Floral Formulas of Families'] },
    { name: 'Anatomy of Flowering Plants', classLevel: 11, subGroup: 'Botany', weightage: 3.5, isHighYield: false, topics: ['Meristematic & Permanent Tissues (Xylem, Phloem)', 'Tissue Systems (Epidermal, Ground, Vascular)', 'Anatomy of Root, Stem & Leaf (Dicot vs Monocot)'] },
    { name: 'Structural Organisation in Animals', classLevel: 11, subGroup: 'Zoology', weightage: 3.0, isHighYield: false, topics: ['Epithelial, Connective, Muscular & Neural Tissues', 'Cell Junctions', 'Morphology and Anatomy of Cockroach / Frog'] },
    { name: 'Cell: The Unit of Life', classLevel: 11, subGroup: 'Botany', weightage: 6.0, isHighYield: true, topics: ['Prokaryotic vs Eukaryotic Cells', 'Endomembrane System (ER, Golgi, Lysosomes, Vacuoles)', 'Mitochondria, Chloroplast & Ribosomes', 'Nucleus & Chromosome Types'] },
    { name: 'Biomolecules (Biology)', classLevel: 11, subGroup: 'Botany', weightage: 5.0, isHighYield: true, topics: ['Amino Acids, Lipids, Carbohydrates & Nucleotides', 'Protein Structures (Primary, Secondary, Tertiary)', 'Enzyme Action & Factors'] },
    { name: 'Cell Cycle and Cell Division', classLevel: 11, subGroup: 'Botany', weightage: 6.0, isHighYield: true, topics: ['Phases of Cell Cycle (G1, S, G2, M)', 'Mitosis Stages & Significance', 'Meiosis I & II, Crossing Over'] },
    { name: 'Photosynthesis in Higher Plants', classLevel: 11, subGroup: 'Botany', weightage: 5.5, isHighYield: true, topics: ['Light Reactions: Cyclic and Non-Cyclic Photophosphorylation', 'Calvin Cycle (C3 Pathway) & C4 Pathway', 'Photorespiration & Factors Affecting Photosynthesis'] },
    { name: 'Respiration in Plants', classLevel: 11, subGroup: 'Botany', weightage: 4.5, isHighYield: true, topics: ['Glycolysis (EMP Pathway)', 'Fermentation (Alcoholic & Lactic Acid)', 'TCA Cycle (Krebs) & ETS Pathway', 'Respiratory Quotient (RQ)'] },
    { name: 'Plant Growth and Development', classLevel: 11, subGroup: 'Botany', weightage: 3.5, isHighYield: false, topics: ['Plant Growth Regulators (Auxins, GA, Cytokinins, Ethylene, ABA)', 'Photoperiodism & Vernalization'] },
    { name: 'Breathing and Exchange of Gases', classLevel: 11, subGroup: 'Zoology', weightage: 3.5, isHighYield: false, topics: ['Respiratory Volumes & Capacities', 'Mechanism of Breathing & Gas Exchange', 'Oxygen Dissociation Curve & Regulation'] },
    { name: 'Body Fluids and Circulation', classLevel: 11, subGroup: 'Zoology', weightage: 4.5, isHighYield: true, topics: ['Blood Components & Grouping (ABO, Rh)', 'Coagulation of Blood', 'Cardiac Cycle, ECG Waves & Blood Pressure', 'Double Circulation & Disorders'] },
    { name: 'Excretory Products and Elimination', classLevel: 11, subGroup: 'Zoology', weightage: 4.0, isHighYield: false, topics: ['Human Excretory System & Nephron Function', 'Urine Formation & Counter-Current Mechanism', 'Regulation of Kidney Function (RAAS, ANF)'] },
    { name: 'Locomotion and Movement', classLevel: 11, subGroup: 'Zoology', weightage: 4.0, isHighYield: false, topics: ['Types of Movement & Sliding Filament Theory', 'Human Skeletal System (Axial & Appendicular)', 'Joints & Disorders'] },
    { name: 'Neural Control and Coordination', classLevel: 11, subGroup: 'Zoology', weightage: 4.0, isHighYield: false, topics: ['Neuron Structure & Nerve Impulse Conduction', 'Synaptic Transmission', 'Human Brain Anatomy & Reflex Arc'] },
    { name: 'Chemical Coordination and Integration', classLevel: 11, subGroup: 'Zoology', weightage: 4.5, isHighYield: true, topics: ['Endocrine Glands and Hormones', 'Mechanism of Hormone Action (Peptide vs Steroid)'] },
    { name: 'Sexual Reproduction in Flowering Plants', classLevel: 12, subGroup: 'Botany', weightage: 6.5, isHighYield: true, topics: ['Microsporogenesis & Megasporogenesis', 'Pollination Types & Outbreeding Devices', 'Double Fertilization & Embryo Sac', 'Apomixis and Polyembryony'] },
    { name: 'Human Reproduction', classLevel: 12, subGroup: 'Zoology', weightage: 7.0, isHighYield: true, topics: ['Male & Female Reproductive Systems', 'Spermatogenesis vs Oogenesis', 'Menstrual Cycle & Hormonal Regulation', 'Fertilization, Implantation & Pregnancy'] },
    { name: 'Reproductive Health', classLevel: 12, subGroup: 'Zoology', weightage: 4.5, isHighYield: true, topics: ['Contraceptive Methods & MTP', 'Sexually Transmitted Infections (STIs)', 'Assisted Reproductive Technologies (ART - IVF, GIFT, ZIFT)'] },
    { name: 'Principles of Inheritance and Variation', classLevel: 12, subGroup: 'Botany', weightage: 8.5, isHighYield: true, topics: ["Mendel's Laws & Dihybrid Crosses", 'Incomplete Dominance, Codominance & Multiple Alleles', 'Linkage and Recombination (Morgan)', 'Pedigree Analysis & Genetic Disorders'] },
    { name: 'Molecular Basis of Inheritance', classLevel: 12, subGroup: 'Botany', weightage: 9.0, isHighYield: true, topics: ['DNA Structure & Nucleosome Model', 'DNA Replication (Meselson-Stahl)', 'Transcription & Genetic Code', 'Translation Mechanism & Lac Operon', 'DNA Fingerprinting & HGP'] },
    { name: 'Evolution', classLevel: 12, subGroup: 'Zoology', weightage: 5.0, isHighYield: true, topics: ['Origin of Life & Miller Experiment', 'Homologous vs Analogous Evidences', 'Hardy-Weinberg Principle', 'Human Evolution Lineage'] },
    { name: 'Human Health and Disease', classLevel: 12, subGroup: 'Zoology', weightage: 6.0, isHighYield: true, topics: ['Common Diseases (Malaria, Typhoid, AIDS)', 'Immunity: Innate vs Acquired & Antibodies', 'Cancer Biology & Autoimmune Disorders', 'Drugs & Alcohol Abuse'] },
    { name: 'Microbes in Human Welfare', classLevel: 12, subGroup: 'Botany', weightage: 3.5, isHighYield: false, topics: ['Household & Industrial Microbes', 'Sewage Treatment Plants (STP)', 'Biogas Production & Biofertilizers'] },
    { name: 'Biotechnology: Principles and Processes', classLevel: 12, subGroup: 'Botany', weightage: 6.0, isHighYield: true, topics: ['Restriction Enzymes & Cloning Vectors (pBR322)', 'Competent Host Transformation', 'Polymerase Chain Reaction (PCR)', 'Bioreactors & Downstream Processing'] },
    { name: 'Biotechnology and its Applications', classLevel: 12, subGroup: 'Botany', weightage: 4.5, isHighYield: true, topics: ['Bt Crops & RNA Interference (RNAi)', 'Genetically Engineered Insulin & Gene Therapy', 'Transgenic Animals & Biopiracy'] },
    { name: 'Organisms and Populations', classLevel: 12, subGroup: 'Botany', weightage: 5.0, isHighYield: true, topics: ['Organism Adaptations & Abiotic Factors', 'Population Growth Models (Exponential vs Logistic)', 'Population Interactions (Mutualism, Parasitism, etc.)'] },
    { name: 'Ecosystem', classLevel: 12, subGroup: 'Botany', weightage: 4.5, isHighYield: false, topics: ['Ecosystem Productivity (GPP/NPP) & Decomposition', 'Energy Flow (10% Law) & Food Webs', 'Ecological Pyramids (Number, Biomass, Energy)'] },
    { name: 'Biodiversity and Conservation', classLevel: 12, subGroup: 'Botany', weightage: 4.5, isHighYield: true, topics: ['Patterns of Biodiversity & Species-Area Curve', 'The Evil Quartet Causes of Extinction', 'In-situ vs Ex-situ Conservation Strategies'] },
  ],
};

async function main() {
  console.log('🌱 Starting comprehensive NEET Syllabus seed...');

  // 1. AppSettings
  await prisma.appSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      familyAccessCodeHash: 'DEFAULT_HASH',
      pomodoroDefaultWorkMinutes: 25,
      pomodoroDefaultBreakMinutes: 5,
    },
  });

  // 2. Badges
  const badges = [
    { name: '10 Hours Logged', description: 'Log 10 hours of study time', conditionType: 'HOURS_LOGGED', conditionThreshold: 10 },
    { name: '50 Hours Logged', description: 'Log 50 hours of study time', conditionType: 'HOURS_LOGGED', conditionThreshold: 50 },
    { name: '100 Hours Logged', description: 'Log 100 hours of study time', conditionType: 'HOURS_LOGGED', conditionThreshold: 100 },
    { name: 'First Test Taken', description: 'Complete your first practice test', conditionType: 'TESTS_TAKEN', conditionThreshold: 1 },
    { name: '5 Tests Taken', description: 'Complete 5 practice tests', conditionType: 'TESTS_TAKEN', conditionThreshold: 5 },
    { name: '7-Day Streak', description: 'Study for 7 consecutive days', conditionType: 'STREAK_DAYS', conditionThreshold: 7 },
    { name: '30-Day Streak', description: 'Study for 30 consecutive days', conditionType: 'STREAK_DAYS', conditionThreshold: 30 },
  ];

  for (const b of badges) {
    const existing = await prisma.badge.findFirst({ where: { name: b.name } });
    if (!existing) {
      await prisma.badge.create({ data: b as any });
    }
  }

  // 3. Subjects, Chapters & Topics
  for (const [subjectName, chapters] of Object.entries(SYLLABUS_DATA)) {
    const subject = await prisma.subject.upsert({
      where: { name: subjectName },
      update: {},
      create: { name: subjectName },
    });

    for (const ch of chapters) {
      const chapter = await prisma.chapter.create({
        data: {
          subjectId: subject.id,
          name: ch.name,
          classLevel: ch.classLevel,
          weightage: ch.weightage,
          isHighYield: ch.isHighYield,
          subGroup: (ch as any).subGroup || null,
          topics: {
            create: ch.topics.map((tName: string) => ({
              name: tName,
              status: 'NOT_STARTED',
              confidenceRating: 0,
            })),
          },
        },
      });
      console.log(`  ✓ Seeded chapter: ${chapter.name} (${ch.topics.length} topics)`);
    }
  }

  console.log('✅ Complete NEET Syllabus Seed Finished Successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Seed Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
