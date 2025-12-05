import React, { useState } from 'react';
import type { Teacher } from '../types';
import Modal from './Modal';
import { PlusIcon, PencilIcon, TrashIcon } from './icons/Icons';

interface TeacherManagementProps {
  teachers: Teacher[];
  setTeachers: React.Dispatch<React.SetStateAction<Teacher[]>>;
}

const TeacherManagement: React.FC<TeacherManagementProps> = ({ teachers, setTeachers }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [formData, setFormData] = useState<Omit<Teacher, 'id'>>({
    name: '', role: 'Voluntário', assignedClass: '', contact: ''
  });
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');

  const handleOpenModal = (teacher: Teacher | null = null) => {
    setEditingTeacher(teacher);
    setFormData(teacher ? { ...teacher } : { name: '', role: 'Voluntário', assignedClass: '', contact: '' });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTeacher(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value as any }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTeacher) {
      setTeachers(teachers.map(t => t.id === editingTeacher.id ? { ...editingTeacher, ...formData } : t));
    } else {
      setTeachers([...teachers, { id: new Date().toISOString(), ...formData, present: false }]);
    }
    handleCloseModal();
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este professor?')) {
        setTeachers(teachers.filter(t => t.id !== id));
    }
  };

  const handleTogglePresence = (id: string) => {
    setTeachers(teachers.map(t => t.id === id ? { ...t, present: !t.present } : t));
  };

  const handleClearAttendance = () => {
    setTeachers(teachers.map(t => ({...t, present: false})));
  };

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterRole === '' || teacher.role === filterRole)
  );

  return (
    <div className="container mx-auto pl-16 lg:pl-64">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-brand-dark-text dark:text-light-bg">Gestão de Professores</h1>
        <button onClick={() => handleOpenModal()} className="flex items-center bg-brand-green hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105">
          <PlusIcon className="mr-2" /> Adicionar Professor
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
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="w-full sm:w-1/2 p-2 border rounded-lg dark:bg-gray-700 dark:text-light-bg dark:border-gray-600"
        >
          <option value="">Todas as Funções</option>
          <option value="Líder">Líder</option>
          <option value="Auxiliar">Auxiliar</option>
          <option value="Voluntário">Voluntário</option>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Função</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Turma</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contato</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ações</th>
                </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-card divide-y divide-gray-200 dark:divide-gray-700">
                {filteredTeachers.map(teacher => (
                    <tr key={teacher.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                            <input 
                                type="checkbox"
                                checked={!!teacher.present}
                                onChange={() => handleTogglePresence(teacher.id)}
                                className="h-5 w-5 text-brand-green rounded border-gray-300 dark:border-gray-500 focus:ring-brand-green"
                            />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{teacher.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                             <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                                teacher.role === 'Líder' ? 'bg-blue-200 text-blue-800' :
                                teacher.role === 'Auxiliar' ? 'bg-green-200 text-green-800' :
                                'bg-yellow-200 text-yellow-800'
                            }`}>{teacher.role}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{teacher.assignedClass}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{teacher.contact}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                            <button onClick={() => handleOpenModal(teacher)} className="text-brand-blue hover:text-brand-blue-dark"><PencilIcon /></button>
                            <button onClick={() => handleDelete(teacher.id)} className="text-red-600 hover:text-red-800"><TrashIcon /></button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>


      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingTeacher ? 'Editar Professor' : 'Adicionar Professor'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nome do Professor" className="w-full p-2 border rounded dark:bg-gray-700 dark:text-light-bg dark:border-gray-600 dark:placeholder-gray-400" required />
          <select name="role" value={formData.role} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:text-light-bg dark:border-gray-600">
            <option value="Líder">Líder</option>
            <option value="Auxiliar">Auxiliar</option>
            <option value="Voluntário">Voluntário</option>
          </select>
          <input type="text" name="assignedClass" value={formData.assignedClass} onChange={handleChange} placeholder="Turma Designada" className="w-full p-2 border rounded dark:bg-gray-700 dark:text-light-bg dark:border-gray-600 dark:placeholder-gray-400" />
          <input type="text" name="contact" value={formData.contact} onChange={handleChange} placeholder="Contato" className="w-full p-2 border rounded dark:bg-gray-700 dark:text-light-bg dark:border-gray-600 dark:placeholder-gray-400" />
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={handleCloseModal} className="bg-gray-300 hover:bg-gray-400 text-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-200 font-bold py-2 px-4 rounded">Cancelar</button>
            <button type="submit" className="bg-brand-green hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded">Salvar</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TeacherManagement;