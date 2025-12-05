import React, { useState } from 'react';
import type { Child } from '../types';
import Modal from './Modal';
import { PlusIcon, PencilIcon, TrashIcon } from './icons/Icons';

interface ChildrenManagementProps {
  children: Child[];
  setChildren: React.Dispatch<React.SetStateAction<Child[]>>;
}

const ChildrenManagement: React.FC<ChildrenManagementProps> = ({ children, setChildren }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChild, setEditingChild] = useState<Child | null>(null);
  const [formData, setFormData] = useState<Omit<Child, 'id'>>({
    name: '', age: 0, class: '', guardianName: '', guardianContact: '', notes: ''
  });
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('');

  const handleOpenModal = (child: Child | null = null) => {
    setEditingChild(child);
    setFormData(child ? { ...child } : { name: '', age: 0, class: '', guardianName: '', guardianContact: '', notes: '' });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingChild(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'age' ? parseInt(value, 10) || 0 : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingChild) {
      setChildren(children.map(c => c.id === editingChild.id ? { ...editingChild, ...formData } : c));
    } else {
      setChildren([...children, { id: new Date().toISOString(), ...formData, present: false }]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta criança?')) {
        setChildren(children.filter(c => c.id !== id));
    }
  };
  
  const handleTogglePresence = (id: string) => {
    setChildren(children.map(c => c.id === id ? { ...c, present: !c.present } : c));
  };

  const handleClearAttendance = () => {
    setChildren(children.map(c => ({...c, present: false})));
  };

  const uniqueClasses = [...new Set(children.map(c => c.class).filter(Boolean))];

  const filteredChildren = children.filter(child =>
    child.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterClass === '' || child.class === filterClass)
  );


  return (
    <div className="container mx-auto pl-16 lg:pl-64">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-brand-dark-text dark:text-light-bg">Gestão de Crianças</h1>
        <button onClick={() => handleOpenModal()} className="flex items-center bg-brand-blue hover:bg-brand-blue-dark text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105">
          <PlusIcon className="mr-2" /> Adicionar Criança
        </button>
      </div>
      
      <div className="bg-white dark:bg-dark-card shadow-md rounded-lg p-4 mb-6 flex flex-col sm:flex-row gap-4 items-center">
        <input
          type="text"
          placeholder="Buscar por nome..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-1/2 p-2 border rounded-lg dark:bg-gray-700 dark:text-light-bg dark:border-gray-600 dark:placeholder-gray-400"
        />
        <select
          value={filterClass}
          onChange={(e) => setFilterClass(e.target.value)}
          className="w-full sm:w-1/2 p-2 border rounded-lg dark:bg-gray-700 dark:text-light-bg dark:border-gray-600"
        >
          <option value="">Todas as Turmas</option>
          {uniqueClasses.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="bg-white dark:bg-dark-card shadow-md rounded-lg p-4 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
            <label htmlFor="attendance-date" className="font-semibold text-gray-700 dark:text-gray-300">Data da Chamada:</label>
            <input 
                type="date" 
                id="attendance-date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="p-2 border rounded-lg dark:bg-gray-700 dark:text-light-bg dark:border-gray-600"
            />
        </div>
        <button 
            onClick={handleClearAttendance}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-200 font-bold py-2 px-4 rounded-lg"
        >
            Limpar Seleção
        </button>
      </div>


      <div className="bg-white dark:bg-dark-card shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Presença</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Idade</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Turma</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Responsável</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-dark-card divide-y divide-gray-200 dark:divide-gray-700">
            {filteredChildren.map(child => (
              <tr key={child.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <input 
                    type="checkbox"
                    checked={!!child.present}
                    onChange={() => handleTogglePresence(child.id)}
                    className="h-5 w-5 text-brand-blue rounded border-gray-300 dark:border-gray-500 focus:ring-brand-blue"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{child.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{child.age}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{child.class}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{child.guardianName} ({child.guardianContact})</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button onClick={() => handleOpenModal(child)} className="text-brand-blue hover:text-brand-blue-dark"><PencilIcon /></button>
                  <button onClick={() => handleDelete(child.id)} className="text-red-600 hover:text-red-800"><TrashIcon /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingChild ? 'Editar Criança' : 'Adicionar Criança'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nome Completo" className="w-full p-2 border rounded dark:bg-gray-700 dark:text-light-bg dark:border-gray-600 dark:placeholder-gray-400" required />
          <input type="number" name="age" value={formData.age} onChange={handleChange} placeholder="Idade" className="w-full p-2 border rounded dark:bg-gray-700 dark:text-light-bg dark:border-gray-600 dark:placeholder-gray-400" required />
          <input type="text" name="class" value={formData.class} onChange={handleChange} placeholder="Turma" className="w-full p-2 border rounded dark:bg-gray-700 dark:text-light-bg dark:border-gray-600 dark:placeholder-gray-400" />
          <input type="text" name="guardianName" value={formData.guardianName} onChange={handleChange} placeholder="Nome do Responsável" className="w-full p-2 border rounded dark:bg-gray-700 dark:text-light-bg dark:border-gray-600 dark:placeholder-gray-400" required />
          <input type="text" name="guardianContact" value={formData.guardianContact} onChange={handleChange} placeholder="Contato do Responsável" className="w-full p-2 border rounded dark:bg-gray-700 dark:text-light-bg dark:border-gray-600 dark:placeholder-gray-400" />
          <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Anotações (comportamento, aprendizado, etc.)" className="w-full p-2 border rounded dark:bg-gray-700 dark:text-light-bg dark:border-gray-600 dark:placeholder-gray-400" rows={3}></textarea>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={handleCloseModal} className="bg-gray-300 hover:bg-gray-400 text-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-200 font-bold py-2 px-4 rounded">Cancelar</button>
            <button type="submit" className="bg-brand-blue hover:bg-brand-blue-dark text-white font-bold py-2 px-4 rounded">Salvar</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ChildrenManagement;