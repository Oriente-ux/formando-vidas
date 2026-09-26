/* ==========================================================================
   Centro Educacional Formando Vidas — Gerenciador de Dados
   Fonte única de verdade para unidades, níveis, bolsas, galeria e mensagens.
   ========================================================================== */

export const SCHOOL = {
  name: 'Centro Educacional Formando Vidas',
  shortName: 'Formando Vidas',
  slogan: 'Educando para a vida toda',
  city: 'Manaus - AM',
  whatsapp: {
    number: '5592994392562',
    display: '(92) 99439-2562',
    link: 'https://wa.me/5592994392562',
  },
};

/* --------------------------------------------------------------------------
   UNIDADES — dados oficiais (3 unidades)
   geo: coordenadas aproximadas do bairro (ajustar se necessário)
   -------------------------------------------------------------------------- */
export const UNIDADES = [
  {
    id: 'terra-nova',
    nome: 'Unidade Terra Nova',
    endereco: 'R. Cururepa, 24 - Col. Terra Nova, Manaus - AM',
    mapsLink:
      'https://www.google.com/maps/search/?api=1&query=Rua+Cururepa+24+Colonia+Terra+Nova+Manaus+AM',
    geo: { lat: -3.0635, lng: -59.9485 },
  },
  {
    id: 'novo-aleixo',
    nome: 'Unidade Novo Aleixo',
    endereco: 'R. Sol Nascente, 1-A - Novo Aleixo, Manaus - AM',
    mapsLink:
      'https://www.google.com/maps/search/?api=1&query=Rua+Sol+Nascente+1A+Novo+Aleixo+Manaus+AM',
    geo: { lat: -3.0342, lng: -59.9756 },
  },
  {
    id: 'santo-antonio',
    nome: 'Unidade Col. Santo Antônio',
    endereco: 'Rua 15 de Maio, 28 - Col. Santo Antônio, Manaus - AM',
    mapsLink:
      'https://www.google.com/maps/search/?api=1&query=Rua+15+de+Maio+28+Colonia+Santo+Antonio+Manaus+AM',
    geo: { lat: -3.004, lng: -59.928 },
  },
];

/* --------------------------------------------------------------------------
   PROPOSTA PEDAGÓGICA — pilares (3 cards em fileira)
   -------------------------------------------------------------------------- */
export const PILARES = [
  {
    id: 'academico',
    titulo: 'Excelência Acadêmica',
    descricao:
      'Base sólida em leitura, escrita e matemática, com metodologias ativas e acompanhamento próximo do aprendizado.',
    icone: 'graduation-cap',
  },
  {
    id: 'desporto',
    titulo: 'Corpo e Movimento',
    descricao:
      'Psicomotricidade, atividades físicas, musicalização e brincadeiras que desenvolvem saúde, coordenação e alegria de aprender.',
    icone: 'activity',
  },
  {
    id: 'formacao-humana',
    titulo: 'Formação Humana e Cristã',
    descricao:
      'Princípios cristãos, acolhimento familiar e desenvolvimento integral: caráter, respeito e propósito desde a primeira infância.',
    icone: 'heart',
  },
];

/* --------------------------------------------------------------------------
   NÍVEIS DE ENSINO
   -------------------------------------------------------------------------- */
export const NIVELES = [
  {
    id: 'educacao-infantil',
    nome: 'Educação Infantil',
    faixa: 'G1 ao G5',
    modalidades: ['Regular', 'Integral'],
    descricao:
      'Primeiros passos com afeto e segurança: linguagem, psicomotricidade, musicalização e socialização em um ambiente que respeita o ritmo de cada criança.',
  },
  {
    id: 'fundamental-i',
    nome: 'Ensino Fundamental I',
    faixa: '1º ao 5º ano',
    modalidades: ['Regular', 'Integral'],
    descricao:
      'Consolidação da alfabetização e do raciocínio lógico, com projetos interdisciplinares, valores cristãos e preparo para os próximos ciclos.',
  },
];

/* --------------------------------------------------------------------------
   BOLSAS DE ESTUDO
   -------------------------------------------------------------------------- */
export const BOLSAS = {
  titulo: 'Bolsas de Estudo de até 50%',
  descricao:
    'Educação de qualidade com mensalidades acessíveis. Consulte as condições e garanta a vaga do seu filho com bolsa de até 50% de desconto.',
  parceiros: [
    { nome: 'Quero Bolsa', link: 'https://www.querobolsa.com.br' },
    { nome: 'Melhor Escola', link: 'https://www.melhorescola.com.br' },
  ],
};

/* --------------------------------------------------------------------------
   MATRÍCULAS — documentos (checkmarks) e etapas do processo
   -------------------------------------------------------------------------- */
export const MATRICULAS = {
  titulo: 'Matrículas 2027',
  descricao:
    'Processo simples e acolhedor. Reúna os documentos, escolha a unidade e fale com a nossa equipe.',
  documentos: [
    'Certidão de nascimento da criança',
    'Comprovante de residência',
    'Foto 3x4 recente',
    'Cartão de vacinação atualizado',
    'Declaração de transferência (se houver)',
    'Documento do responsável (RG ou CPF)',
  ],
  etapas: [
    'Fale com a gente pelo WhatsApp',
    'Agende uma visita à unidade',
    'Apresente a documentação',
    'Confirme a matrícula e a bolsa',
  ],
};

/* --------------------------------------------------------------------------
   MURAL — bento grid da página inicial
   (notícias, avisos, calendário do mês, Instagram e fotos)
   -------------------------------------------------------------------------- */
export const MURAL = {
  // mes: 0-based (8 = setembro)
  calendario: { ano: 2026, mes: 8, rotulo: 'Setembro 2026' },
  noticias: [
    {
      titulo: 'Matrículas 2027 abertas com bolsas de até 50%',
      resumo:
        'Garanta a vaga do seu filho com desconto de até 50% nas três unidades. Vagas limitadas.',
      data: '18 set 2026',
      tag: 'Matrículas',
      img: 'assets/img/alunos-caminha.jpeg',
    },
    {
      titulo: 'Caminhada pedagógica reúne famílias na comunidade',
      resumo:
        'Alunos e famílias participaram de caminhada pelas ruas do bairro com atividades de cidadania.',
      data: '12 set 2026',
      tag: 'Atividades',
      img: 'assets/img/alunos-caminhada-grupo.jpeg',
    },
    {
      titulo: 'Festa junina celebra cultura e união das turmas',
      resumo:
        'Quadrilha, comidas típicas e muita alegria marcaram a festa junina das três unidades.',
      data: '05 set 2026',
      tag: 'Eventos',
      img: 'assets/img/alunos-festa-junina.jpeg',
    },
  ],
  avisos: [
    { texto: 'Reunião de pais — Infantil: 25/09 às 17h', icone: 'users' },
    { texto: 'Entrega de boletins: 30/09', icone: 'file-text' },
    { texto: 'Semana da Criança: 05 a 09/10', icone: 'party-popper' },
    { texto: 'Ponto facultativo: 15/10', icone: 'calendar-off' },
  ],
  eventos: [
    { dia: 21, titulo: 'Início da Semana da Pátria' },
    { dia: 25, titulo: 'Reunião de pais — Infantil' },
    { dia: 30, titulo: 'Entrega de boletins' },
  ],
  instagram: {
    titulo: 'Siga-nos no Instagram',
    descricao:
      'Acompanhe a rotina, eventos e avisos do Centro Educacional Formando Vidas em tempo real.',
    cta: 'Ver Perfil no Instagram',
    link: 'https://www.instagram.com/ceformandovidas/',
  },
  fotos: [
    { src: 'assets/img/aluna-bandeira-brasil.jpeg', alt: 'Aluna segurando a bandeira do Brasil' },
    { src: 'assets/img/alunos-comendo.jpeg', alt: 'Alunos no refeitório durante o lanche' },
    { src: 'assets/img/aluno-atividade.jpeg', alt: 'Aluno realizando atividade pedagógica' },
    { src: 'assets/img/escola-01.jpeg', alt: 'Rotina escolar' },
  ],
};

/* --------------------------------------------------------------------------
   GALERIA / FEED DA ESCOLA
   -------------------------------------------------------------------------- */
export const GALERIA = [
  {
    src: 'assets/img/aluna-bandeira-brasil.jpeg',
    alt: 'Aluna do Centro Educacional Formando Vidas segurando a bandeira do Brasil',
    caption: 'Civismo e amor à pátria',
    tag: 'Civismo',
  },
  {
    src: 'assets/img/alunos-caminha.jpeg',
    alt: 'Alunos em caminhada durante atividade escolar',
    caption: 'Caminhada pedagógica',
    tag: 'Atividades',
  },
  {
    src: 'assets/img/escola-01.jpeg',
    alt: 'Momento de rotina escolar no Centro Educacional Formando Vidas',
    caption: 'Rotina na escola',
    tag: 'Rotina',
  },
  {
    src: 'assets/img/alunos-comendo.jpeg',
    alt: 'Alunos no refeitório durante o lanche',
    caption: 'Hora do lanche',
    tag: 'Alimentação',
  },
  {
    src: 'assets/img/aluno-atividade.jpeg',
    alt: 'Aluno realizando atividade pedagógica em sala',
    caption: 'Hora da atividade',
    tag: 'Aprendizado',
  },
  {
    src: 'assets/img/alunos-festa-junina.jpeg',
    alt: 'Alunos caracterizados durante a festa junina da escola',
    caption: 'Festa junina',
    tag: 'Eventos',
  },
  {
    src: 'assets/img/escola-02.jpeg',
    alt: 'Momento de rotina escolar no Centro Educacional Formando Vidas',
    caption: 'Dia a dia na escola',
    tag: 'Rotina',
  },
  {
    src: 'assets/img/alunos-caminhada-grupo.jpeg',
    alt: 'Alunos em caminhada em grupo pela comunidade',
    caption: 'Caminhada em grupo',
    tag: 'Atividades',
  },
];

/* --------------------------------------------------------------------------
   MENSAGENS PRÉ-PREENCHIDAS (WhatsApp)
   -------------------------------------------------------------------------- */
export const MENSAGENS = {
  visita: (unidade) =>
    `Olá! Vim pelo site do Centro Educacional Formando Vidas e gostaria de agendar uma visita à ${unidade}.`,
  bolsa:
    'Olá! Vim pelo site do Centro Educacional Formando Vidas e gostaria de saber mais sobre as Bolsas de Estudo de até 50%.',
  matricula:
    'Olá! Vim pelo site do Centro Educacional Formando Vidas e gostaria de informações sobre matrículas.',
  geral:
    'Olá! Vim pelo site do Centro Educacional Formando Vidas e gostaria de mais informações.',
};

/* --------------------------------------------------------------------------
   HELPERS
   -------------------------------------------------------------------------- */
export function waLink(message) {
  const text = encodeURIComponent(message || '');
  return `${SCHOOL.whatsapp.link}${text ? `?text=${text}` : ''}`;
}

export function getUnidade(id) {
  return UNIDADES.find((u) => u.id === id) || UNIDADES[0];
}
