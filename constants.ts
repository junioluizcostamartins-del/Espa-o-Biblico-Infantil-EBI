import type { Child, Teacher, Lesson, Photo, Message, AppEvent } from './types';

export const initialChildren: Child[] = [
  { id: 'c1', name: 'Lucas Silva', age: 5, class: 'Sementinhas', guardianName: 'Ana Silva', guardianContact: '(11) 98765-4321', notes: 'Muito participativo nas aulas.', present: false },
  { id: 'c2', name: 'Sofia Oliveira', age: 7, class: 'Discípulos Mirins', guardianName: 'Marcos Oliveira', guardianContact: '(11) 91234-5678', notes: 'Adora cantar nos louvores.', present: false },
  { id: 'c3', name: 'Davi Costa', age: 6, class: 'Sementinhas', guardianName: 'Carla Costa', guardianContact: '(11) 95555-1234', notes: 'Precisa de incentivo para interagir.', present: false },
];

export const initialTeachers: Teacher[] = [
  { id: 't1', name: 'Tia Carol', role: 'Líder', assignedClass: 'Sementinhas', contact: '(11) 99999-8888', present: false },
  { id: 't2', name: 'Tio Pedro', role: 'Auxiliar', assignedClass: 'Discípulos Mirins', contact: '(11) 97777-6666', present: false },
  { id: 't3', name: 'Irmã Maria', role: 'Voluntário', assignedClass: 'Todas', contact: '(11) 96666-5555', present: false },
];

export const initialLessons: Lesson[] = [
  { id: 'l1', title: 'A Criação do Mundo', date: '2024-08-04', ageGroup: '4-6 anos', materials: [{type: 'Vídeo', url: 'https://youtube.com/watch?v=example1'}], description: 'Gênesis 1. Ensinar sobre os 7 dias da criação.' },
  { id: 'l2', title: 'Davi e Golias', date: '2024-08-11', ageGroup: '7-9 anos', materials: [{type: 'PDF', url: '#'}, {type: 'Imagem', url: '#'}], description: '1 Samuel 17. A história de coragem e fé de Davi.' },
];

export const initialPhotos: Photo[] = [
  { id: 'p1', url: 'https://picsum.photos/400/300?random=1', caption: 'Nossa turminha na aula sobre a Arca de Noé!', date: '2024-07-21' },
  { id: 'p2', url: 'https://picsum.photos/400/300?random=2', caption: 'Atividade de pintura sobre a criação.', date: '2024-07-21' },
  { id: 'p3', url: 'https://picsum.photos/400/300?random=3', caption: 'Momento de louvor e adoração.', date: '2024-07-28' },
];

export const initialMessages: Message[] = [
    { id: 'm1', type: 'Recado aos Pais', content: 'Lembrete: Próximo domingo teremos nossa gincana bíblica! Tragam as crianças com roupas confortáveis.', author: 'Coordenação', timestamp: '2024-07-29 10:00' },
    { id: 'm2', type: 'Professores', content: 'Reunião de planejamento na próxima quarta-feira às 19h para definirmos as aulas de setembro.', author: 'Tia Carol', timestamp: '2024-07-28 15:30' },
    { id: 'm3', type: 'Pedido de Oração', content: 'Oração pela família do pequeno João, que está passando por um momento difícil.', author: 'Tio Pedro', timestamp: '2024-07-29 09:00' },
];

export const initialEvents: AppEvent[] = [
  { id: 'e1', title: 'Culto de Páscoa', date: '2024-08-18', type: 'Culto Infantil', description: 'Celebração especial de Páscoa com teatrinho e louvores.' },
  { id: 'e2', title: 'Ensaio para o Dia das Mães', date: '2024-08-25', type: 'Ensaio', description: 'Ensaio da apresentação para o culto do Dia das Mães.' },
];
