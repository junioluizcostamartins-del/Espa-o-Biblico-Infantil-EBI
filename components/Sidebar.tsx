
import React, { useState, useRef } from 'react';
import { HomeIcon, UserGroupIcon, AcademicCapIcon, ChatBubbleLeftRightIcon, PhotoIcon, ChartBarIcon, BookOpenIcon, Bars3Icon, XMarkIcon, LightBulbIcon, CalendarDaysIcon, SunIcon, MoonIcon, UserCircleIcon, PencilIcon, ArrowLeftOnRectangleIcon } from './icons/Icons';
import { useTheme } from '../contexts/ThemeContext';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  profilePicture: string | null;
  setProfilePicture: (pic: string) => void;
  onLogout: () => void;
}

const navItems = [
  { id: 'dashboard', label: 'Painel', icon: <HomeIcon /> },
  { id: 'children', label: 'Crianças', icon: <UserGroupIcon /> },
  { id: 'teachers', label: 'Professores', icon: <AcademicCapIcon /> },
  { id: 'lessons', label: 'Aulas', icon: <BookOpenIcon /> },
  { id: 'events', label: 'Eventos', icon: <CalendarDaysIcon /> },
  { id: 'themeGenerator', label: 'Gerador de Temas', icon: <LightBulbIcon /> },
  { id: 'communication', label: 'Comunicação', icon: <ChatBubbleLeftRightIcon /> },
  { id: 'gallery', label: 'Galeria', icon: <PhotoIcon /> },
  { id: 'reports', label: 'Relatórios', icon: <ChartBarIcon /> },
];

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, profilePicture, setProfilePicture, onLogout }) => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProfilePicClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicture(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const NavLinks = () => (
    <nav className="mt-6">
      {navItems.map((item) => (
        <a
          key={item.id}
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setActiveView(item.id);
            setMobileMenuOpen(false); // Close mobile menu on navigation
          }}
          className={`flex items-center px-4 py-3 my-1 text-gray-100 rounded-lg transition-colors duration-200 ${
            activeView === item.id
              ? 'bg-brand-blue-dark font-bold shadow-lg'
              : 'hover:bg-brand-blue-dark hover:text-white'
          }`}
        >
          <span className="w-6 h-6">{item.icon}</span>
          <span className="mx-4 font-medium">
            {item.label}
          </span>
        </a>
      ))}
    </nav>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        className="fixed top-4 left-4 z-20 p-2 text-gray-600 bg-white dark:bg-dark-card dark:text-light-text rounded-md shadow-lg lg:hidden"
        onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <XMarkIcon /> : <Bars3Icon />}
      </button>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-10 w-64 px-4 py-8 bg-brand-blue flex flex-col transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
        <div className="flex flex-col items-center">
            <button
              onClick={handleProfilePicClick}
              className="relative group w-20 h-20 bg-white rounded-full flex items-center justify-center mb-2 shadow-md overflow-hidden cursor-pointer"
              title="Clique para alterar a foto do perfil"
            >
              {profilePicture ? (
                <img src={profilePicture} alt="Foto do perfil" className="w-full h-full object-cover" />
              ) : (
                <UserCircleIcon className="w-16 h-16 text-brand-blue" />
              )}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center transition-opacity">
                <PencilIcon className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
          <h2 className="text-2xl font-bold text-white text-center">Espaço Bíblico Infantil</h2>
          <p className="text-sm text-blue-200 mt-1">"Ensina a criança no caminho..."</p>
        </div>
        
        <div className="flex flex-col justify-between flex-1 mt-6">
          <NavLinks />
           <div className="mt-6">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center px-4 py-3 text-gray-200 hover:bg-brand-blue-dark hover:text-white rounded-lg transition-colors duration-200"
              aria-label={`Mudar para modo ${theme === 'light' ? 'escuro' : 'claro'}`}
            >
              {theme === 'light' ? <MoonIcon /> : <SunIcon />}
              <span className="mx-4 font-medium">
                {theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}
              </span>
            </button>
            <button
              onClick={onLogout}
              className="w-full flex items-center px-4 py-3 text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors duration-200 mt-4 shadow-md"
              aria-label="Sair do sistema"
            >
              <ArrowLeftOnRectangleIcon />
              <span className="mx-4 font-medium">
                Sair
              </span>
            </button>
          </div>
        </div>
      </aside>
       {/* Overlay for mobile */}
       {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black opacity-50 z-0 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
