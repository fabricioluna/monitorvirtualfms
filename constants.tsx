import { Question, SimulationInfo } from './types';

export const THEME = {
  primary: '#003366',
  accent: '#D4A017',
  highlight: '#E31B23',
  bg: '#f4f7f6',
  text: '#333333'
};

export const SIMULATIONS: SimulationInfo[] = [
  {
    id: 'uciv',
    title: 'UCIV - Funções Biológicas',
    description: 'Controle neuroendócrino, cardiovascular, respiratório, renal, digestório e equilíbrio ácido-básico.',
    meta: '110h • Ciclo da Homeostase',
    icon: '🫀',
    status: 'active',
    themes: [
      'Fisiologia Cardiovascular', 
      'Fisiologia Respiratória', 
      'Fisiologia Renal e Eletrólitos', 
      'Fisiologia Digestória',
      'Equilíbrio Ácido-Básico',
      'Biofísica e Bioquímica'
    ],
    references: [
      { id: 'ref_fisio1', title: 'Tratado de Fisiologia Médica (Guyton & Hall)', author: 'John E. Hall', type: 'book' },
      { id: 'ref_fisio2', title: 'Fisiologia (Linda Costanzo)', author: 'Linda S. Costanzo', type: 'book' },
      { id: 'ref_anato1', title: 'Anatomia Orientada para a Clínica (Moore)', author: 'Keith L. Moore', type: 'book' },
      { id: 'ref_anato2', title: 'Atlas de Anatomia Humana (Netter)', author: 'Frank H. Netter', type: 'book' },
      { id: 'ref_bioq1', title: 'Princípios de Bioquímica (Lehninger)', author: 'David L. Nelson', type: 'book' },
      { id: 'ref_histo1', title: 'Histologia Básica (Junqueira & Carneiro)', author: 'L.C. Junqueira', type: 'book' },
      { id: 'ref_embrio1', title: 'Embriologia Clínica (Moore)', author: 'Keith L. Moore', type: 'book' }
    ]
  },
  {
    id: 'ucv',
    title: 'UCV - Agressão e Defesa',
    description: 'Agentes agressores, imunidade inata e adquirida, inflamação, lesão celular e hipersensibilidade.',
    meta: '110h • Mecanismos de Lesão',
    icon: '🛡️',
    status: 'locked',
    themes: [
      'Mecanismos de Lesão Celular', 
      'Imunologia Celular e Humoral', 
      'Processos Inflamatórios', 
      'Microbiologia e Parasitologia',
      'Hipersensibilidade e Alergia'
    ]
  },
  {
    id: 'iesc2',
    title: 'IESC II - Saúde na Comunidade II',
    description: 'Vigilância em saúde, acolhimento na UBS, índices epidemiológicos e fluxos de referência.',
    meta: '80h • Gestão e Sociedade',
    icon: '🏥',
    status: 'active',
    themes: [
      'Índices Epidemiológicos', 
      'Vigilância Sanitária e Epidemiológica', 
      'Acolhimento e Processos na UBS', 
      'Referência e Contrarreferência',
      'Programas de Hipertensão e Diabetes'
    ],
    references: [
      { id: 'ref4', title: 'Epidemiologia', author: 'Leon Gordis', type: 'book' },
      { id: 'ref5', title: 'Tratado de Medicina de Família e Comunidade', author: 'Gustavo Gusso', type: 'book' },
      { id: 'ref6', title: 'Portal e-SUS APS', type: 'link', url: 'https://aps.saude.gov.br/ape/esus' }
    ]
  },
  {
    id: 'uccg2',
    title: 'UCCG II - Ciência e Gestão II',
    description: 'Metodologia científica, bioestatística aplicada, gestão de serviços de saúde e ética em pesquisa.',
    meta: '60h • Ciência e Evidência',
    icon: '📊',
    status: 'active',
    themes: [
      'Metodologia Científica', 
      'Bioestatística e Análise de Dados', 
      'Gestão em Saúde e Modelos de Atenção', 
      'Ética e Bioética na Pesquisa',
      'Leitura Crítica de Artigos'
    ],
    references: [
      { id: 'ref10', title: 'Delineando a Pesquisa Clínica', author: 'Stephen Hulley', type: 'book' },
      { id: 'ref11', title: 'Bioestatística', author: 'Sonia Vieira', type: 'book' },
      { id: 'ref12', title: 'Gestão da Clínica no SUS', author: 'Ministério da Saúde', type: 'article' }
    ]
  },
  {
    id: 'hm2',
    title: 'HM2 - Habilidades Médicas II',
    description: 'Relacionamento médico-paciente, semiologia, anamnese e exame físico geral.',
    meta: '120h • Prática Clínica',
    icon: '🩺',
    status: 'active',
    themes: [
      'Técnicas de Comunicação e Anamnese', 
      'Exame Físico Geral e Especializado', 
      'Ética Médica e Postura',
      'Relação Médico-Paciente-Família',
      'Comunicação de Muitos Notícias'
    ],
    references: [
      { id: 'ref7', title: 'Exame Clínico', author: 'Porto & Porto', type: 'book' },
      { id: 'ref8', title: 'Semiologia Médica', author: 'Bates', type: 'book' },
      { id: 'ref9', title: 'Código de Ética Médica', author: 'CFM', type: 'article' }
    ]
  }
];

// O banco inicial agora está vazio. As questões virão apenas do CSV importado.
export const INITIAL_QUESTIONS: Question[] = [];
