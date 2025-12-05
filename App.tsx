
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ChildrenManagement from './components/ChildrenManagement';
import TeacherManagement from './components/TeacherManagement';
import LessonPlanner from './components/LessonPlanner';
import CommunicationHub from './components/CommunicationHub';
import Gallery from './components/Gallery';
import Reports from './components/Reports';
import ThemeGenerator from './components/ThemeGenerator';
import { initialChildren, initialTeachers, initialLessons, initialPhotos, initialMessages, initialEvents } from './constants';
import type { Child, Teacher, Lesson, Photo, Message, AppEvent } from './types';
import EventCalendar from './components/EventCalendar';
import LoginScreen from './components/LoginScreen';
import { ArrowLeftOnRectangleIcon } from './components/icons/Icons';

// Custom hook to sync state with localStorage
function useLocalStorageState<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      const storedValue = window.localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : defaultValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, state]);

  return [state, setState];
}


const App: React.FC = () => {
  const [activeView, setActiveView] = useState('dashboard');
  
  const [isAuthenticated, setIsAuthenticated] = useLocalStorageState<boolean>('ebi_auth', false);
  const [children, setChildren] = useLocalStorageState<Child[]>('ebi_children', initialChildren);
  const [teachers, setTeachers] = useLocalStorageState<Teacher[]>('ebi_teachers', initialTeachers);
  const [lessons, setLessons] = useLocalStorageState<Lesson[]>('ebi_lessons', initialLessons);
  const [photos, setPhotos] = useLocalStorageState<Photo[]>('ebi_photos', initialPhotos);
  const [messages, setMessages] = useLocalStorageState<Message[]>('ebi_messages', initialMessages);
  const [events, setEvents] = useLocalStorageState<AppEvent[]>('ebi_events', initialEvents);
  const [profilePicture, setProfilePicture] = useLocalStorageState<string | null>('ebi_profile_picture', null);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveView('dashboard'); // Reset view on logout
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard 
                  childrenData={children} 
                  teachers={teachers} 
                  lessons={lessons}
                  events={events}
                  messages={messages}
                  setActiveView={setActiveView}
               />;
      case 'children':
        return <ChildrenManagement children={children} setChildren={setChildren} />;
      case 'teachers':
        return <TeacherManagement teachers={teachers} setTeachers={setTeachers} />;
      case 'lessons':
        return <LessonPlanner lessons={lessons} setLessons={setLessons} />;
      case 'events':
        return <EventCalendar events={events} setEvents={setEvents} />;
      case 'communication':
        return <CommunicationHub messages={messages} setMessages={setMessages} />;
      case 'gallery':
        return <Gallery photos={photos} setPhotos={setPhotos} />;
      case 'reports':
        return <Reports childrenData={children} teacherData={teachers} lessonsData={lessons} />;
      case 'themeGenerator':
        return <ThemeGenerator />;
      default:
        return <Dashboard 
                  childrenData={children} 
                  teachers={teachers} 
                  lessons={lessons}
                  events={events}
                  messages={messages}
                  setActiveView={setActiveView}
               />;
    }
  };
  
  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="flex h-screen bg-light-bg dark:bg-dark-bg font-sans">
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView}
        profilePicture={profilePicture}
        setProfilePicture={setProfilePicture}
        onLogout={handleLogout}
      />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 relative">
        {/* Botão de Logout Fixo no Topo Direito para acesso rápido */}
        <div className="absolute top-4 right-4 sm:right-8 z-10">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-dark-card text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-lg shadow-sm transition-all duration-200 text-sm font-semibold"
            title="Sair do Sistema"
          >
            <ArrowLeftOnRectangleIcon className="w-5 h-5" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
        {renderView()}
      </main>
    </div>
  );
};

export default App;
