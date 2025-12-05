
import React, { useState, useRef } from 'react';
import type { Photo } from '../types';
import { PlusIcon, TrashIcon } from './icons/Icons';

interface GalleryProps {
  photos: Photo[];
  setPhotos: React.Dispatch<React.SetStateAction<Photo[]>>;
}

const Gallery: React.FC<GalleryProps> = ({ photos, setPhotos }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newCaption, setNewCaption] = useState('');

  const handleAddPhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newPhoto: Photo = {
          id: new Date().toISOString(),
          url: e.target?.result as string,
          caption: newCaption || 'Nova foto!',
          date: new Date().toLocaleDateString('pt-BR'),
        };
        setPhotos([newPhoto, ...photos]);
        setNewCaption('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta foto?')) {
        setPhotos(photos.filter(p => p.id !== id));
    }
  };

  return (
    <div className="container mx-auto pl-16 lg:pl-64">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-brand-dark-text dark:text-light-bg">Galeria de Atividades</h1>
        <div className="flex items-center gap-2">
            <input 
                type="text" 
                value={newCaption} 
                onChange={(e) => setNewCaption(e.target.value)}
                placeholder="Legenda da foto" 
                className="p-2 border rounded-lg dark:bg-gray-700 dark:text-light-bg dark:border-gray-600 dark:placeholder-gray-400"
            />
            <button onClick={handleAddPhotoClick} className="flex items-center bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105">
                <PlusIcon className="mr-2" /> Adicionar Foto
            </button>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
            />
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {photos.map(photo => (
          <div key={photo.id} className="bg-white dark:bg-dark-card shadow-lg rounded-lg overflow-hidden group relative">
            <img src={photo.url} alt={photo.caption} className="w-full h-48 object-cover"/>
            <div className="p-4">
              <p className="text-sm text-gray-700 dark:text-gray-300">{photo.caption}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{photo.date}</p>
            </div>
            <button onClick={() => handleDelete(photo.id)} className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;