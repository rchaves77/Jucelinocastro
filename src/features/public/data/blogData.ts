import imgBlogGonartrose from '../../../assets/images/regenerated_image_1787004991694.png';
import imgBlogFascite from '../../../assets/images/regenerated_image_1787005311149.png';
import imgBlogManguito from '../../../assets/images/regenerated_image_1787005296880.png';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  author: string;
  authorRole: string;
  imageUrl: string;
  content: string[];
  keyTakeaways: string[];
  relatedServiceSlug: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'hernia-de-disco-sem-cirurgia',
    slug: 'hernia-de-disco-tratamento-sem-cirurgia',
    title: 'Hérnia de Disco: Por Que Mais de 95% dos Casos Não Precisam de Cirurgia?',
    excerpt: 'Entenda como a fisioterapia especializada e as manobras descompressivas eliminam a dor do nervo ciático e devolvem a mobilidade sem bisturi.',
    category: 'Coluna & Hérnia',
    readTime: '4 min de leitura',
    date: '14 de Agosto, 2026',
    author: 'Dr. Jucelino Castro',
    authorRole: 'Especialista em Coluna & Quiropraxia',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=900&q=80',
    content: [
      'Receber o diagnóstico de hérnia de disco (cervical ou lombar) ainda assusta muitas pessoas com a ideia de uma cirurgia arriscada. No entanto, as evidências científicas internacionais comprovam que a cirurgia só é estritamente indicada em menos de 5% dos casos (síndrome da cauda equina ou déficit neurológico progressivo grave).',
      'Na Jucelino Castro Fisioterapia, o tratamento baseia-se na descompressão biomecânica. O disco intervertebral não "saiu do lugar", mas sim extravasou parte de seu núcleo gelatinoso, comprimindo as raízes nervosas vizinhas e gerando inflamação intensa com dor que desce para a perna (ciático) ou para os braços.',
      'Através do tratamento manipulativo lombar, tração articular suave e estabilização muscular profunda (Pilates Clínico), reduzimos a pressão intra-discal mecânica. O próprio organismo inicia a reabsorção natural do fragmento herniado e a cicatrização do anel fibroso.',
      'O repouso absoluto na cama, antes recomendado por médicos antigos, hoje é considerado prejudicial: o repouso atrofia os músculos de sustentação e piora a inflamação. O movimento controlado e direcionado é o verdadeiro remédio para a coluna.',
    ],
    keyTakeaways: [
      'Cirurgia é a última opção: mais de 95% se recuperam 100% com método conservador.',
      'Medicamentos e injeções apenas anestesiam temporariamente; a causa mecânica precisa de ajuste físico.',
      'Exercícios de fortalecimento do core guiados por fisioterapeutas previnem que a dor retorne.',
    ],
    relatedServiceSlug: 'protusao-discal-degeneracao',
  },
  {
    id: 'gonartrose-joelho-cuidados',
    slug: 'como-tratar-gonartrose-e-evitar-protese-joelho',
    title: 'Gonartrose no Joelho: Como Aliviar a Dor e Proteger a Cartilagem',
    excerpt: 'Descubra como o fortalecimento dos estabilizadores de quadril e técnicas manuais aliviam o atrito e evitam a cirurgia de prótese.',
    category: 'Joelho & Membros Inferiores',
    readTime: '3 min de leitura',
    date: '02 de Agosto, 2026',
    author: 'Dra. Leticia Vasconcelos',
    authorRole: 'Fisioterapeuta Ortopédica & Traumato-Ortopedia',
    imageUrl: imgBlogGonartrose,
    content: [
      'A gonartrose (desgaste da cartilagem do joelho) é uma das principais queixas de dor ao caminhar, subir ou descer escadas e levantar da cadeira. Muitas pessoas acreditam que, por ter artrose, devem parar de caminhar para "economizar" a cartilagem — o que é um erro grave.',
      'A cartilagem não possui vasos sanguíneos próprios; ela se nutre através da compressão e descompressão do líquido sinovial produzida durante o movimento orientado. Quando o paciente para de se mover, o líquido diminui e a rigidez aumenta.',
      'Nosso protocolo em Rio Branco atua no reequilíbrio da descarga de peso. Muitas vezes a sobrecarga no joelho ocorre devido à fraqueza do glúteo médio no quadril ou encurtamento do tornozelo. Ao corrigir a cadeia inteira, o joelho volta a trabalhar livre de atritos excessivos.',
    ],
    keyTakeaways: [
      'A cartilagem do joelho precisa de movimento guiado e seguro para se nutrir.',
      'Fortalecer glúteos e quadríceps tira a pressão direta da patela e do menisco.',
      'Evite o sedentarismo e procure avaliação biomecânica aos primeiros estalos com dor.',
    ],
    relatedServiceSlug: 'gonartrose-joelho',
  },
  {
    id: 'fascite-plantar-guia-completo',
    slug: 'fascite-plantar-e-esporao-de-calcaneo-guia',
    title: 'Fascite Plantar e Esporão: Por Que a Dor é Pior no Primeiro Passo da Manhã?',
    excerpt: 'Saiba o que causa aquela pontada aguda no calcanhar ao levantar da cama e quais os tratamentos mais eficazes.',
    category: 'Pés & Tornozelo',
    readTime: '4 min de leitura',
    date: '20 de Julho, 2026',
    author: 'Dr. Jucelino Castro',
    authorRole: 'Fisioterapeuta Especialista em Coluna & Quiropraxia',
    imageUrl: imgBlogFascite,
    content: [
      'Você já acordou de manhã, colocou o pé no chão e sentiu uma pontada tão intensa no calcanhar que precisou mancar? Esse é o sintoma clássico da fascite plantar, frequentemente acompanhada de esporão de calcâneo.',
      'Durante a noite, enquanto dormimos com os pés relaxados, a fáscia plantar encurta e tenta cicatrizar. No momento em que você pisa no chão ao despertar, o peso do corpo estica abruptamente essa estrutura inflamada, gerando microlesões e dor aguda.',
      'Na Jucelino Castro Fisioterapia, combinamos liberação miofascial profunda da panturrilha (que está conectada à sola do pé pelo tendão de Aquiles), mobilização articular do tornozelo e exercícios excêntricos específicos. O resultado é o alívio rápido da dor logo nos primeiros dias de sessão.',
    ],
    keyTakeaways: [
      'O esporão ósseo não é o vilão principal; a inflamação da fáscia ao redor é quem dói.',
      'Alongar a panturrilha e massagear a sola do pé com uma bolinha rígida ajuda na fase aguda.',
      'O tratamento fisioterapêutico especializado previne a cronificação e a perda da marcha.',
    ],
    relatedServiceSlug: 'fascite-plantar-calcanhar',
  },
  {
    id: 'manguito-rotador-dor-ao-dormir',
    slug: 'dor-no-ombro-ao-dormir-manguito-rotador',
    title: 'Dor no Ombro ao Dormir: É Tendinite ou Lesão do Manguito Rotador?',
    excerpt: 'Aprenda a identificar a causa da dor noturna no ombro e como a fisioterapia evita cirurgias de sutura tendínea.',
    category: 'Ombro & Membros Superiores',
    readTime: '3 min de leitura',
    date: '08 de Julho, 2026',
    author: 'Dra. Aline Castro',
    authorRole: 'Fisioterapeuta & Pilates Clínico',
    imageUrl: imgBlogManguito,
    content: [
      'A dor no ombro que piora durante a noite ao deitar sobre o lado afetado ou ao tentar pentear o cabelo e alcançar as costas é um sinal clássico de pinçamento subacromial ou tendinopatia do manguito rotador.',
      'O manguito rotador é composto por 4 músculos essenciais que mantêm a cabeça do úmero centralizada na cavidade do ombro. Quando há fraqueza muscular ou má postura com ombros caídos para frente, o espaço ósseo se fecha e o tendão é esmagado a cada movimento.',
      'Com manobras de reposicionamento escapular e fortalecimento isométrico dos rotadores, devolvemos o espaço livre para o tendão respirar e cicatrizar sem necessidade de cirurgias.',
    ],
    keyTakeaways: [
      'Evite dormir com o braço dobrado debaixo do travesseiro para não prender a circulação do tendão.',
      'O fortalecimento da musculatura das costas (escapular) é fundamental para abrir o espaço do ombro.',
      'Não tome apenas anti-inflamatórios: eles não corrigem a mecânica do movimento.',
    ],
    relatedServiceSlug: 'manguito-rotador-ombro',
  },
];
