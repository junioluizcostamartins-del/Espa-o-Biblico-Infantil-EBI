
import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { Lesson } from '../types';
import Modal from './Modal';
import { PlusIcon, SparklesIcon, PencilIcon, TrashIcon, PhotoIcon, BookmarkSquareIcon } from './icons/Icons';
import { getLessonIdeas } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';

interface LessonPlannerProps {
  lessons: Lesson[];
  setLessons: React.Dispatch<React.SetStateAction<Lesson[]>>;
}

const DRAFT_KEY = 'ebi_lesson_draft';

const LessonPlanner: React.FC<LessonPlannerProps> = ({ lessons, setLessons }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [formData, setFormData] = useState<Omit<Lesson, 'id' | 'materials'>>({
    title: '', date: '', ageGroup: '', description: '', coverImage: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAgeGroup, setFilterAgeGroup] = useState('');
  const [hasDraft, setHasDraft] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check for draft when modal opens for a NEW lesson
    if (isModalOpen && !editingLesson) {
        const savedDraft = localStorage.getItem(DRAFT_KEY);
        if (savedDraft) {
            try {
                const parsedDraft = JSON.parse(savedDraft);
                setFormData(parsedDraft);
                setHasDraft(true);
            } catch (e) {
                console.error("Erro ao carregar rascunho", e);
            }
        } else {
            setHasDraft(false);
        }
    }
  }, [isModalOpen, editingLesson]);

  const handleOpenModal = (lesson: Lesson | null = null) => {
    setEditingLesson(lesson);
    setSuggestions([]);
    
    if (lesson) {
        setFormData({ ...lesson });
        setHasDraft(false);
    } else {
        // Reset form initially, the useEffect will overwrite if draft exists
        setFormData({ title: '', date: '', ageGroup: '', description: '', coverImage: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingLesson(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({ ...prev, coverImage: event.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, coverImage: undefined }));
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const handleSaveDraft = () => {
      try {
          localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
          setHasDraft(true);
          alert("Rascunho salvo com sucesso! Você pode continuar mais tarde.");
      } catch (e) {
          alert("Erro ao salvar rascunho. O tamanho da imagem pode ser muito grande.");
      }
  };

  const handleDiscardDraft = () => {
      if (window.confirm("Tem certeza que deseja descartar este rascunho?")) {
          localStorage.removeItem(DRAFT_KEY);
          setFormData({ title: '', date: '', ageGroup: '', description: '', coverImage: '' });
          setHasDraft(false);
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Preserva materiais existentes se estiver editando, caso contrário, array vazio
    const currentMaterials = editingLesson ? editingLesson.materials : [];
    const lessonData = { ...formData, materials: currentMaterials };

    if (editingLesson) {
      setLessons(lessons.map(l => l.id === editingLesson.id ? { ...editingLesson, ...lessonData } : l));
    } else {
      setLessons([...lessons, { id: new Date().toISOString(), ...lessonData, materials: [] }]);
      // Clear draft on successful create
      localStorage.removeItem(DRAFT_KEY);
      setHasDraft(false);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta aula?')) {
      setLessons(lessons.filter(l => l.id !== id));
    }
  };

  const handleGenerateIdeas = useCallback(async () => {
    if (!formData.ageGroup) {
      alert("Por favor, preencha a faixa etária para gerar sugestões.");
      return;
    }
    setIsGenerating(true);
    setSuggestions([]);
    const ideas = await getLessonIdeas(formData.ageGroup);
    setSuggestions(ideas);
    setIsGenerating(false);
  }, [formData.ageGroup]);

  const uniqueAgeGroups = [...new Set(lessons.map(l => l.ageGroup).filter(Boolean))];

  const filteredLessons = lessons.filter(lesson =>
    lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterAgeGroup === '' || lesson.ageGroup === filterAgeGroup)
  );

  return (
    <div className="container mx-auto pl-16 lg:pl-64">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-brand-dark-text dark:text-light-bg">Planejamento de Aulas</h1>
        <button onClick={() => handleOpenModal()} className="flex items-center bg-brand-yellow hover:bg-amber-500 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105">
          <PlusIcon className="mr-2" /> Nova Aula
        </button>
      </div>

      <div className="bg-white dark:bg-dark-card shadow-md rounded-lg p-4 mb-6 flex flex-col sm:flex-row gap-4 items-center">
        <input
          type="text"
          placeholder="Buscar por título da aula..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-1/2 p-2 border rounded-lg dark:bg-gray-700 dark:text-light-bg dark:border-gray-600 dark:placeholder-gray-400"
        />
        <select
          value={filterAgeGroup}
          onChange={(e) => setFilterAgeGroup(e.target.value)}
          className="w-full sm:w-1/2 p-2 border rounded-lg dark:bg-gray-700 dark:text-light-bg dark:border-gray-600"
        >
          <option value="">Todas as Faixas Etárias</option>
          {uniqueAgeGroups.map(ag => <option key={ag} value={ag}>{ag}</option>)}
        </select>
      </div>

      <div className="space-y-4">
        {filteredLessons.map(lesson => (
          <div key={lesson.id} className="bg-white dark:bg-dark-card shadow-md rounded-lg p-4 flex flex-col sm:flex-row gap-4">
             {lesson.coverImage && (
                <div className="w-full sm:w-48 h-32 flex-shrink-0">
                    <img 
                        src={lesson.coverImage} 
                        alt={lesson.title} 
                        className="w-full h-full object-cover rounded-lg"
                    />
                </div>
            )}
            <div className="flex-grow flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start">
                         <div>
                            <h3 className="text-xl font-bold text-brand-dark-text dark:text-light-bg">{lesson.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(lesson.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'})} | Faixa Etária: {lesson.ageGroup}</p>
                         </div>
                         <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
                            <button onClick={() => handleOpenModal(lesson)} className="text-brand-blue hover:text-brand-blue-dark"><PencilIcon /></button>
                            <button onClick={() => handleDelete(lesson.id)} className="text-red-600 hover:text-red-800"><TrashIcon /></button>
                        </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mt-2 line-clamp-3">{lesson.description}</p>
                </div>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingLesson ? 'Editar Aula' : 'Criar Nova Aula'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {!editingLesson && hasDraft && (
             <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 p-3 rounded-lg flex items-center justify-between">
                 <p className="text-sm text-blue-800 dark:text-blue-200 flex items-center">
                    <BookmarkSquareIcon className="w-5 h-5 mr-2" />
                    Rascunho anterior recuperado.
                 </p>
                 <button 
                    type="button" 
                    onClick={handleDiscardDraft}
                    className="text-xs text-red-600 hover:underline"
                 >
                    Descartar Rascunho
                 </button>
             </div>
          )}

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Imagem de Capa</label>
            {formData.coverImage ? (
                <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden group">
                    <img src={formData.coverImage} alt="Capa" className="w-full h-full object-cover" />
                    <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remover imagem"
                    >
                        <TrashIcon className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 hover:border-brand-blue hover:text-brand-blue transition-colors bg-gray-50 dark:bg-gray-800/50"
                >
                    <PhotoIcon className="w-8 h-8 mb-1" />
                    <span className="text-sm">Adicionar Imagem de Capa</span>
                </button>
            )}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
                accept="image/*"
            />
          </div>

          <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Título da Aula" className="w-full p-2 border rounded dark:bg-gray-700 dark:text-light-bg dark:border-gray-600 dark:placeholder-gray-400" required />
          <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:text-light-bg dark:border-gray-600" required />
          <input type="text" name="ageGroup" value={formData.ageGroup} onChange={handleChange} placeholder="Faixa Etária (ex: 4-6 anos)" className="w-full p-2 border rounded dark:bg-gray-700 dark:text-light-bg dark:border-gray-600 dark:placeholder-gray-400" required />
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Descrição e anotações da aula" className="w-full p-2 border rounded dark:bg-gray-700 dark:text-light-bg dark:border-gray-600 dark:placeholder-gray-400" rows={4}></textarea>
          
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-400/20 rounded-lg">
            <button type="button" onClick={handleGenerateIdeas} disabled={isGenerating} className="flex items-center justify-center w-full bg-brand-yellow hover:bg-amber-500 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105 disabled:bg-gray-400">
              <SparklesIcon className="mr-2" /> {isGenerating ? 'Gerando...' : 'Gerar Sugestões de Temas (IA)'}
            </button>
            {isGenerating && <LoadingSpinner />}
            {suggestions.length > 0 && (
              <div className="mt-4 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <h4 className="font-bold">Sugestões:</h4>
                <ul className="list-disc list-inside">
                  {suggestions.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center pt-2">
            {!editingLesson && (
                <button 
                    type="button" 
                    onClick={handleSaveDraft} 
                    className="flex items-center text-gray-600 hover:text-brand-blue dark:text-gray-400 dark:hover:text-blue-400 text-sm font-semibold"
                >
                    <BookmarkSquareIcon className="w-5 h-5 mr-1" />
                    Salvar Rascunho
                </button>
            )}
            
            <div className={`flex space-x-2 ${editingLesson ? 'w-full justify-end' : ''}`}>
                <button type="button" onClick={handleCloseModal} className="bg-gray-300 hover:bg-gray-400 text-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-200 font-bold py-2 px-4 rounded">Cancelar</button>
                <button type="submit" className="bg-brand-yellow hover:bg-amber-500 text-white font-bold py-2 px-4 rounded">Salvar</button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default LessonPlanner;
