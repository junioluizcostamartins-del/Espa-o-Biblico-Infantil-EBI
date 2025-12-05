import React from 'react';
import type { Child, Teacher, Lesson } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowDownTrayIcon } from './icons/Icons';
import { useTheme } from '../contexts/ThemeContext';

interface ReportsProps {
  childrenData: Child[];
  teacherData: Teacher[];
  lessonsData: Lesson[];
}

const Reports: React.FC<ReportsProps> = ({ childrenData, teacherData, lessonsData }) => {
  const { theme } = useTheme();
  const axisColor = theme === 'dark' ? '#9CA3AF' : '#6B7281';
  const gridColor = theme === 'dark' ? '#374151' : '#E5E7EB';

  const childrenByClass = childrenData.reduce((acc, child) => {
    acc[child.class] = (acc[child.class] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.keys(childrenByClass).map(className => ({
    name: className,
    Crianças: childrenByClass[className],
  }));

  const attendanceData = lessonsData
    .map(lesson => ({
      ...lesson,
      // Simula a presença entre 60% e 100% do total de crianças, para fins de demonstração.
      presentChildren: Math.floor((Math.random() * 0.4 + 0.6) * childrenData.length)
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
  const exportToCsv = <T extends object>(data: T[], filename: string) => {
    if (data.length === 0) {
      alert("Não há dados para exportar.");
      return;
    }
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${(row as any)[header]}"`).join(','))
    ].join('\n');

    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleExportChildrenByClass = () => {
    const dataToExport = chartData.map(item => ({
      'Turma': item.name,
      'Quantidade de Crianças': item.Crianças
    }));
    exportToCsv(dataToExport, 'criancas_por_turma.csv');
  };

  const handleExportAttendance = () => {
    const dataToExport = attendanceData.map(item => ({
      'Aula': item.title,
      'Data': new Date(item.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' }),
      'Presentes': `${item.presentChildren} / ${childrenData.length}`
    }));
    exportToCsv(dataToExport, 'presenca_por_aula.csv');
  };
  
  const handleExportTeachers = () => {
    const dataToExport = teacherData.map(teacher => ({
        'Nome': teacher.name,
        'Função': teacher.role,
        'Turma': teacher.assignedClass,
        'Contato': teacher.contact,
    }));
    exportToCsv(dataToExport, 'lista_de_professores.csv');
  };


  return (
    <div className="container mx-auto pl-16 lg:pl-64 space-y-8">
      <h1 className="text-3xl font-bold text-brand-dark-text dark:text-light-bg">Relatórios e Estatísticas</h1>
      
      <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-brand-dark-text dark:text-light-bg">Crianças por Turma</h2>
            <button onClick={handleExportChildrenByClass} className="flex items-center text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-200 font-semibold py-1 px-3 rounded-lg transition-colors">
                <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                Exportar CSV
            </button>
        </div>
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <BarChart
                    data={chartData}
                    margin={{
                    top: 5, right: 30, left: 20, bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis dataKey="name" stroke={axisColor} />
                    <YAxis allowDecimals={false} stroke={axisColor} />
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF', 
                            borderColor: gridColor 
                        }}
                    />
                    <Legend wrapperStyle={{color: axisColor}} />
                    <Bar dataKey="Crianças" fill="#3B82F6" />
                </BarChart>
            </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-brand-dark-text dark:text-light-bg">Presença por Aula (Simulado)</h2>
            <button onClick={handleExportAttendance} className="flex items-center text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-200 font-semibold py-1 px-3 rounded-lg transition-colors">
                <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                Exportar CSV
            </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Aula</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Crianças Presentes</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-card divide-y divide-gray-200 dark:divide-gray-700">
              {attendanceData.map(lesson => (
                <tr key={lesson.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{lesson.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(lesson.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{lesson.presentChildren} / {childrenData.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold text-brand-dark-text dark:text-light-bg mb-4">Resumo Geral</h2>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li><strong>Total de Crianças:</strong> {childrenData.length}</li>
                <li><strong>Total de Professores:</strong> {teacherData.length}</li>
                <li><strong>Total de Turmas:</strong> {Object.keys(childrenByClass).length}</li>
            </ul>
        </div>
        <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-brand-dark-text dark:text-light-bg">Equipe de Professores</h2>
                <button onClick={handleExportTeachers} className="flex items-center text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-200 font-semibold py-1 px-3 rounded-lg transition-colors">
                    <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                    Exportar CSV
                </button>
            </div>
            <ul className="space-y-2">
                {teacherData.map(teacher => (
                    <li key={teacher.id} className="flex justify-between">
                        <span className="text-gray-700 dark:text-gray-300">{teacher.name}</span>
                        <span className="font-semibold text-gray-600 dark:text-gray-400">{teacher.role}</span>
                    </li>
                ))}
            </ul>
        </div>
      </div>
    </div>
  );
};

export default Reports;