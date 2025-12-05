import React, { useState } from 'react';
import type { AppEvent } from '../types';
import Modal from './Modal';
import { PlusIcon, PencilIcon, TrashIcon } from './icons/Icons';

interface EventCalendarProps {
  events: AppEvent[];
  setEvents: React.Dispatch<React.SetStateAction<AppEvent[]>>;
}

const EventCalendar: React.FC<EventCalendarProps> = ({ events, setEvents }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<AppEvent | null>(null);
  const [formData, setFormData] = useState<Omit<AppEvent, 'id'>>({
    title: '', date: '', type: 'Culto Infantil', description: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');

  const handleOpenModal = (event: AppEvent | null = null) => {
    setEditingEvent(event);
    setFormData(event ? { ...event } : { title: '', date: '', type: 'Culto Infantil', description: '' });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value as any }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEvent) {
      setEvents(events.map(ev => ev.id === editingEvent.id ? { ...editingEvent, ...formData } : ev));
    } else {
      setEvents([...events, { id: new Date().toISOString(), ...formData }]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este evento?')) {
      setEvents(events.filter(ev => ev.id !== id));
    }
  };
  
  const getTypeColor = (type: AppEvent['type']) => {
    switch (type) {
      case 'Culto Infantil': return 'border-blue-500';
      case 'Ensaio': return 'border-green-500';
      case 'Festa': return 'border-pink-500';
      case 'Ensino': return 'border-yellow-500';
      default: return 'border-gray-500';
    }
  };

  const filteredAndSortedEvents = events
    .filter(event =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterType === '' || event.type === filterType)
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="container mx-auto pl-16 lg:pl-64">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-brand-dark-text dark:text-light-bg">Agenda e Eventos</h1>
        <button onClick={() => handleOpenModal()} className="flex items-center bg-brand-pink hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105">
          <PlusIcon className="mr-2" /> Novo Evento
        </button>
      </div>

      <div className="bg-white dark:bg-dark-card shadow-md rounded-lg p-4 mb-6 flex flex-col sm:flex-row gap-4 items-center">
        <input
          type="text"
          placeholder="Buscar por título do evento..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-1/2 p-2 border rounded-lg dark:bg-gray-700 dark:text-light-bg dark:border-gray-600 dark:placeholder-gray-400"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="w-full sm:w-1/2 p-2 border rounded-lg dark:bg-gray-700 dark:text-light-bg dark:border-gray-600"
        >
          <option value="">Todos os Tipos</option>
          <option value="Culto Infantil">Culto Infantil</option>
          <option value="Ensaio">Ensaio</option>
          <option value="Festa">Festa</option>
          <option value="Ensino">Ensino</option>
        </select>
      </div>
      
      <div className="space-y-4">
        {filteredAndSortedEvents.map(event => (
          <div key={event.id} className={`bg-white dark:bg-dark-card shadow-md rounded-lg p-4 flex justify-between items-start border-l-4 ${getTypeColor(event.type)}`}>
            <div>
              <h3 className="text-xl font-bold text-brand-dark-text dark:text-light-bg">{event.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(event.date).toLocaleDateString('pt-BR', {timeZone: 'UTC', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <span className="text-xs font-semibold bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300 px-2 py-1 rounded-full mt-1 inline-block">{event.type}</span>
              <p className="text-gray-700 dark:text-gray-300 mt-2">{event.description}</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 flex-shrink-0 ml-4">
              <button onClick={() => handleOpenModal(event)} className="text-brand-blue hover:text-brand-blue-dark"><PencilIcon /></button>
              <button onClick={() => handleDelete(event.id)} className="text-red-600 hover:text-red-800"><TrashIcon /></button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingEvent ? 'Editar Evento' : 'Criar Novo Evento'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Título do Evento" className="w-full p-2 border rounded dark:bg-gray-700 dark:text-light-bg dark:border-gray-600 dark:placeholder-gray-400" required />
          <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:text-light-bg dark:border-gray-600" required />
          <select name="type" value={formData.type} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:text-light-bg dark:border-gray-600">
            <option value="Culto Infantil">Culto Infantil</option>
            <option value="Ensaio">Ensaio</option>
            <option value="Festa">Festa</option>
            <option value="Ensino">Ensino</option>
          </select>
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Descrição do evento" className="w-full p-2 border rounded dark:bg-gray-700 dark:text-light-bg dark:border-gray-600 dark:placeholder-gray-400" rows={3}></textarea>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={handleCloseModal} className="bg-gray-300 hover:bg-gray-400 text-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-200 font-bold py-2 px-4 rounded">Cancelar</button>
            <button type="submit" className="bg-brand-pink hover:bg-pink-600 text-white font-bold py-2 px-4 rounded">Salvar</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EventCalendar;