export interface Testimonial {
  id: string;
  author: string;
  content: string;
  role: string;
  stars: number;
  date?: string;
  reviewCount?: number;
  photoCount?: number;
  isLocalGuide?: boolean;
}

/**
 * Depoimentos em destaque exibidos na landing page.
 * Selecionados por relevância clínica e força de prova social.
 * Para adicionar mais, basta incluir novos objetos no array.
 */
export const REAL_TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    author: 'Edson Neto',
    content:
      'Cheguei na clínica com muita dor no pescoço! Já tinha 4 meses! Todo dia quando eu acordava sentia muita dor. Marquei com o Dr. e estou bem melhor! Super indico a clínica!',
    role: 'Coluna Cervical',
    stars: 5,
    date: 'Há 5 semanas',
    reviewCount: 2,
    photoCount: 1,
  },
  {
    id: '2',
    author: 'Dra. Ana Carolina Almeida',
    content:
      'Pensa em um profissional nota 10. Entro com dor e saio sem. O melhor osteopata da cidade.',
    role: 'Reabilitação',
    stars: 5,
    date: '25 de ago. de 2023',
    reviewCount: 4,
    photoCount: 5,
    isLocalGuide: true,
  },
  {
    id: '3',
    author: 'Reynaldo Martins Mandu',
    content: 'Entro com dor e saio curado! Recomendo demais!',
    role: 'Coluna',
    stars: 5,
    date: 'Há 4 semanas',
    reviewCount: 1,
  },
  {
    id: '4',
    author: 'Milca Tomé da Silva Domingos',
    content:
      'Cheguei à clínica com muita dor e bastante desconforto, mas desde o primeiro atendimento fui muito bem recebida e acolhida.',
    role: 'Reabilitação',
    stars: 5,
    date: 'Há 4 semanas',
    reviewCount: 1,
  },
  {
    id: '5',
    author: 'Gleyson Lima',
    content:
      'Excelente atendimento, profissionais qualificados. Cheguei com dores no punho, cotovelo e ombro, no qual estou sendo bem cuidado, estou gostando do retorno.',
    role: 'Ombro',
    stars: 5,
    date: 'Há 4 semanas',
    reviewCount: 3,
  },
  {
    id: '6',
    author: 'Lillah Braz',
    content:
      'O melhor profissional de fisioterapia, estamos fazendo trabalho de correção postural magnífico. Todos os profissionais são excelentes.',
    role: 'Reabilitação',
    stars: 5,
    date: 'Há 5 semanas',
    reviewCount: 4,
  },
  {
    id: '7',
    author: 'Nahayana Farias',
    content: 'Maravilhosa, atendimento de excelência, zero dores.',
    role: 'Coluna',
    stars: 5,
    date: 'Há 5 semanas',
    reviewCount: 1,
  },
  {
    id: '8',
    author: 'Bushido Ronin',
    content:
      'Melhor clínica de fisioterapia do Acre, equipe de profissionais atenciosa e competente no seu ofício. Definitivamente uma experiência ótima!',
    role: 'Reabilitação',
    stars: 5,
    date: 'Há 5 semanas',
    reviewCount: 2,
    photoCount: 2,
  },
  {
    id: '9',
    author: 'Francisca De Holanda',
    content:
      'Maravilhosa! Bom atendimento, chique, bem perfumada, tudo maravilhoso. Atendimento excelente.',
    role: 'Reabilitação',
    stars: 5,
    date: 'Há 5 semanas',
    reviewCount: 1,
    photoCount: 1,
  },
  {
    id: '10',
    author: 'Allana Khristie',
    content:
      'Sempre maravilhoso, salva demais, indico pra todo mundo, e venho sempre que posso.',
    role: 'Coluna',
    stars: 5,
    date: 'Há 5 semanas',
    reviewCount: 5,
  },
];
