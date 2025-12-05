
import React, { useState } from 'react';
import type { Message } from '../types';
import Modal from './Modal';
import { PlusIcon } from './icons/Icons';

interface CommunicationHubProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const CommunicationHub: React.FC<CommunicationHubProps> = ({ messages, setMessages }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<Message, 'id' | 'timestamp'>>({
    type: 'Recado aos Pais', content: '', author: ''
  });

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value as any }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newMessage: Message = {
      id: new Date().toISOString(),
      timestamp: new Date().toLocaleString('pt-BR'),
      ...formData
    };
    setMessages([newMessage, ...messages]);
    handleCloseModal();
  };

  const getCategoryColor = (type: Message['type']) => {
    switch (type) {
      case 'Recado aos Pais': return 'bg-blue-100 dark:bg-blue-900/50 border-blue-500';
      case 'Professores': return 'bg-green-100 dark:bg-green-900/50 border-green-500';
      case 'Pedido de Oração': return 'bg-yellow-100 dark:bg-yellow-900/50 border-yellow-500';
      default: return 'bg-gray-100 dark:bg-gray-700/50 border-gray-500';
    }
  };
  
  return (
    <div className="container mx-auto pl-16 lg:pl-64">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-brand-dark-text dark:text-light-bg">Central de Comunicação</h1>
        <button onClick={handleOpenModal} className="flex items-center bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105">
          <PlusIcon className="mr-2" /> Nova Mensagem
        </button>
      </div>

      <div className="space-y-4">
        {messages.map(message => (
          <div key={message.id} className={`bg-white dark:bg-dark-card shadow-md rounded-lg p-4 border-l-4 ${getCategoryColor(message.type)}`}>
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-semibold bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300 px-2 py-1 rounded-full">{message.type}</span>
                <p className="text-gray-700 dark:text-gray-300 mt-2">{message.content}</p>
              </div>
              <div className="text-right ml-4 flex-shrink-0">
                <p className="text-sm font-bold text-brand-dark-text dark:text-light-bg">{message.author}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{message.timestamp}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Criar Nova Mensagem">
        <form onSubmit={handleSubmit} className="space-y-4">
          <select name="type" value={formData.type} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:text-light-bg dark:border-gray-600">
            <option value="Recado aos Pais">Recado aos Pais</option>
            <option value="Professores">Comunicação Interna (Professores)</option>
            <option value="Pedido de Oração">Pedido de Oração</option>
          </select>
          <input type="text" name="author" value={formData.author} onChange={handleChange} placeholder="Seu Nome" className="w-full p-2 border rounded dark:bg-gray-700 dark:text-light-bg dark:border-gray-600 dark:placeholder-gray-400" required />
          <textarea name="content" value={formData.content} onChange={handleChange} placeholder="Escreva sua mensagem aqui..." className="w-full p-2 border rounded dark:bg-gray-700 dark:text-light-bg dark:border-gray-600 dark:placeholder-gray-400" rows={5} required></textarea>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={handleCloseModal} className="bg-gray-300 hover:bg-gray-400 text-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-200 font-bold py-2 px-4 rounded">Cancelar</button>
            <button type="submit" className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded">Enviar</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CommunicationHub;