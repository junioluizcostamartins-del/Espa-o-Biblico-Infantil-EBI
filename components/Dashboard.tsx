
import React, { useMemo } from 'react';
import { UserGroupIcon, AcademicCapIcon, SparklesIcon, CalendarDaysIcon, BookOpenIcon, BellIcon, ArrowRightIcon, ChatBubbleLeftRightIcon, PlusIcon } from './icons/Icons';
import type { Child, Teacher, Lesson, AppEvent, Message } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { useTheme } from '../contexts/ThemeContext';

interface DashboardProps {
  childrenData: Child[];
  teachers: Teacher[];
  lessons: Lesson[];
  events: AppEvent[];
  messages: Message[];
  setActiveView: (view: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ childrenData, teachers, lessons, events, messages, setActiveView }) => {
  const { theme } = useTheme();

  // --- Computed Data ---

  // 1. Next Upcoming Event
  const nextEvent = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return events
      .filter(e => new Date(e.date) >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
  }, [events]);

  // 2. Next Lesson
  const nextLesson = useMemo(() => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return lessons
        .filter(l => new Date(l.date) >= today)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
  }, [lessons]);

  // 3. Children Distribution (Chart Data)
  const pieData = useMemo(() => {
      const distribution = childrenData.reduce((acc, child) => {
          acc[child.class] = (acc[child.class] || 0) + 1;
          return acc;
      }, {} as Record<string, number>);
      
      return Object.entries(distribution).map(([name, value]) => ({ name: name || 'Sem Turma', value }));
  }, [childrenData]);

  // 4. Recent Messages
  const recentMessages = useMemo(() => {
      return [...messages].slice(0, 3);
  }, [messages]);

  const COLORS = ['#3B82F6', '#10B981', '#FBBF24', '#EC4899', '#8B5CF6'];

  // --- Sub-components ---

  const StatCard = ({ icon, title, value, gradient, onClick }: { icon: React.ReactNode, title: string, value: string | number, gradient: string, onClick?: () => void }) => (
    <div 
        className={`p-6 rounded-2xl shadow-lg text-white ${gradient} transform transition-all hover:scale-[1.02] cursor-pointer relative overflow-hidden`}
        onClick={onClick}
    >
      <div className="absolute -right-4 -top-4 opacity-20 transform rotate-12 scale-150">
          {icon}
      </div>
      <div className="flex items-center justify-between relative z-10">
        <div>
          <p className="text-sm font-medium opacity-90 mb-1">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
            {icon}
        </div>
      </div>
    </div>
  );

  const QuickAction = ({ icon, label, view, colorClass }: { icon: React.ReactNode, label: string, view: string, colorClass: string }) => (
    <button 
        onClick={() => setActiveView(view)}
        className={`flex flex-col items-center justify-center p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-dark-card shadow-sm hover:shadow-md transition-all group ${colorClass}`}
    >
        <div className="mb-2 p-3 rounded-full bg-gray-50 dark:bg-gray-800 group-hover:scale-110 transition-transform">
            {icon}
        </div>
        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{label}</span>
    </button>
  );

  return (
    <div className="space-y-8 pl-16 lg:pl-64 animate-fade-in-up">
      <header className="flex justify-between items-end">
        <div>
            <h1 className="text-3xl font-bold text-brand-dark-text dark:text-light-bg">Painel de Controle</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Visão geral do seu ministério hoje.</p>
        </div>
        <div className="hidden sm:block text-right">
            <p className="text-sm font-bold text-brand-blue dark:text-blue-400">
                {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
        </div>
      </header>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard 
            icon={<UserGroupIcon />} 
            title="Total de Crianças" 
            value={childrenData.length} 
            gradient="bg-gradient-to-br from-blue-500 to-blue-600"
            onClick={() => setActiveView('children')}
        />
        <StatCard 
            icon={<AcademicCapIcon />} 
            title="Professores" 
            value={teachers.length} 
            gradient="bg-gradient-to-br from-green-500 to-emerald-600"
            onClick={() => setActiveView('teachers')}
        />
        <StatCard 
            icon={<BookOpenIcon />} 
            title="Aulas Criadas" 
            value={lessons.length} 
            gradient="bg-gradient-to-br from-yellow-400 to-amber-500"
            onClick={() => setActiveView('lessons')}
        />
        <StatCard 
            icon={<CalendarDaysIcon />} 
            title="Próximos Eventos" 
            value={events.length} 
            gradient="bg-gradient-to-br from-pink-500 to-rose-600"
            onClick={() => setActiveView('events')}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Content Column (2/3) */}
        <div className="xl:col-span-2 space-y-6">
            
            {/* Next Up Section */}
            <div className="bg-white dark:bg-dark-card rounded-2xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                    <SparklesIcon className="w-5 h-5 mr-2 text-brand-yellow" />
                    Destaques
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Next Event Card */}
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-5 border border-indigo-100 dark:border-indigo-800 flex flex-col justify-between h-full">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-indigo-500 dark:text-indigo-400">Próximo Evento</span>
                            {nextEvent ? (
                                <>
                                    <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-100 mt-2 line-clamp-1">{nextEvent.title}</h3>
                                    <p className="text-sm text-indigo-700 dark:text-indigo-300 mt-1 flex items-center">
                                        <CalendarDaysIcon className="w-4 h-4 mr-1" />
                                        {new Date(nextEvent.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
                                    </p>
                                    <span className="inline-block mt-3 px-2 py-1 bg-white dark:bg-indigo-800 text-xs font-semibold text-indigo-600 dark:text-indigo-200 rounded-md">
                                        {nextEvent.type}
                                    </span>
                                </>
                            ) : (
                                <p className="text-gray-500 text-sm mt-2 italic">Nenhum evento futuro agendado.</p>
                            )}
                        </div>
                        <button onClick={() => setActiveView('events')} className="mt-4 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center">
                            Ver agenda <ArrowRightIcon className="w-4 h-4 ml-1" />
                        </button>
                    </div>

                    {/* Next Lesson Card */}
                     <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-5 border border-orange-100 dark:border-orange-800 flex flex-col justify-between h-full">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-orange-500 dark:text-orange-400">Próxima Aula</span>
                            {nextLesson ? (
                                <>
                                    <h3 className="text-lg font-bold text-orange-900 dark:text-orange-100 mt-2 line-clamp-1">{nextLesson.title}</h3>
                                    <p className="text-sm text-orange-700 dark:text-orange-300 mt-1 flex items-center">
                                        <BookOpenIcon className="w-4 h-4 mr-1" />
                                        {new Date(nextLesson.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
                                    </p>
                                    <p className="text-xs text-orange-600 dark:text-orange-400 mt-2">
                                        Turma: {nextLesson.ageGroup}
                                    </p>
                                </>
                            ) : (
                                <p className="text-gray-500 text-sm mt-2 italic">Nenhuma aula planejada.</p>
                            )}
                        </div>
                         <button onClick={() => setActiveView('lessons')} className="mt-4 text-sm font-semibold text-orange-600 dark:text-orange-400 hover:underline flex items-center">
                            Planejar aulas <ArrowRightIcon className="w-4 h-4 ml-1" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick Actions Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <QuickAction icon={<PlusIcon className="text-blue-500" />} label="Nova Criança" view="children" colorClass="hover:border-blue-300" />
                <QuickAction icon={<SparklesIcon className="text-yellow-500" />} label="Gerar Tema IA" view="themeGenerator" colorClass="hover:border-yellow-300" />
                <QuickAction icon={<CalendarDaysIcon className="text-pink-500" />} label="Novo Evento" view="events" colorClass="hover:border-pink-300" />
                <QuickAction icon={<ChatBubbleLeftRightIcon className="text-green-500" />} label="Enviar Recado" view="communication" colorClass="hover:border-green-300" />
            </div>

             {/* Chart Section */}
            <div className="bg-white dark:bg-dark-card rounded-2xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Distribuição por Turma</h3>
                <div className="h-64 w-full">
                    {pieData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip 
                                    contentStyle={{ 
                                        backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF', 
                                        borderColor: theme === 'dark' ? '#374151' : '#E5E7EB',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                         <div className="flex items-center justify-center h-full text-gray-400">Sem dados suficientes para o gráfico</div>
                    )}
                </div>
            </div>

        </div>

        {/* Sidebar Column (1/3) */}
        <div className="space-y-6">
            
            {/* Recent Messages Widget */}
            <div className="bg-white dark:bg-dark-card rounded-2xl shadow-md p-6 border border-gray-100 dark:border-gray-700 h-full">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center">
                        <BellIcon className="w-5 h-5 mr-2 text-gray-500" />
                        Comunicação
                    </h3>
                    <button onClick={() => setActiveView('communication')} className="text-xs font-semibold text-brand-blue hover:underline">Ver tudo</button>
                </div>
                
                <div className="space-y-4">
                    {recentMessages.length > 0 ? (
                        recentMessages.map((msg) => (
                            <div key={msg.id} className="flex gap-3 pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0">
                                <div className={`flex-shrink-0 w-2 h-full rounded-full mt-1 ${
                                    msg.type === 'Recado aos Pais' ? 'bg-blue-400' : 
                                    msg.type === 'Professores' ? 'bg-green-400' : 'bg-yellow-400'
                                } w-1.5 h-1.5`}></div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{msg.type} • {msg.author}</p>
                                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-2">{msg.content}</p>
                                    <p className="text-xs text-gray-400 mt-1">{msg.timestamp}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-sm italic text-center py-4">Nenhuma mensagem recente.</p>
                    )}
                </div>

                 <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                    <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Links Úteis</h4>
                    <ul className="space-y-2">
                         <li>
                            <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-blue flex items-center">
                                <ArrowRightIcon className="w-3 h-3 mr-2" /> Portal do Professor (Externo)
                            </a>
                        </li>
                         <li>
                            <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-blue flex items-center">
                                <ArrowRightIcon className="w-3 h-3 mr-2" /> Banco de Imagens
                            </a>
                        </li>
                    </ul>
                 </div>
            </div>
        </div>
      </div>
       <style>{`
        @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
            animation: fade-in-up 0.5s ease-out forwards;
        }
    `}</style>
    </div>
  );
};

export default Dashboard;
