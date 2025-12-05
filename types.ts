
export interface Child {
  id: string;
  name: string;
  age: number;
  class: string;
  guardianName: string;
  guardianContact: string;
  notes: string;
  present?: boolean;
}

export interface Teacher {
  id: string;
  name:string;
  role: 'Líder' | 'Auxiliar' | 'Voluntário';
  assignedClass: string;
  contact: string;
  present?: boolean;
}

export interface Lesson {
  id: string;
  title: string;
  date: string;
  ageGroup: string;
  materials: { type: 'PDF' | 'Vídeo' | 'Imagem' | 'Link'; url: string }[];
  description: string;
  coverImage?: string;
}

export interface Photo {
  id: string;
  url: string;
  caption: string;
  date: string;
}

export interface Message {
  id: string;
  type: 'Recado aos Pais' | 'Professores' | 'Pedido de Oração';
  content: string;
  author: string;
  timestamp: string;
}

// FIX: Add AppEvent interface to resolve missing type error in EventCalendar.tsx.
export interface AppEvent {
  id: string;
  title: string;
  date: string;
  type: 'Culto Infantil' | 'Ensaio' | 'Festa' | 'Ensino';
  description: string;
}
