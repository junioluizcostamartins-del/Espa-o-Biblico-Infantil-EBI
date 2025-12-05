
import React, { useState, useCallback, useEffect } from 'react';
import { generateLessonPlan, generateColoringImage, getRandomThemeSuggestion, generateCreativeThemes } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import { SparklesIcon, PhotoIcon, ArrowDownTrayIcon, DiceIcon, PrinterIcon, ClipboardDocumentIcon, ClockIcon, TrashIcon, ShareIcon, BookOpenIcon, LightBulbIcon, PlusIcon } from './icons/Icons';

interface HistoryItem {
  theme: string;
  ageGroup: string;
}

const ThemeGenerator: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [ageGroup, setAgeGroup] = useState('4-6 anos');
  const [lessonPlan, setLessonPlan] = useState('');
  const [coloringImage, setColoringImage] = useState<string | null>(null);
  const [isGeneratingLesson, setIsGeneratingLesson] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isGeneratingIdea, setIsGeneratingIdea] = useState(false);
  const [suggestedThemes, setSuggestedThemes] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const stored = localStorage.getItem('ebi_theme_history');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('ebi_theme_history', JSON.stringify(history));
  }, [history]);

  const addToHistory = (theme: string, age: string) => {
    setHistory(prev => {
      const filtered = prev.filter(h => h.theme !== theme);
      return [{ theme, ageGroup: age }, ...filtered].slice(0, 5);
    });
  };

  const clearHistory = () => {
    if (window.confirm("Limpar histórico de pesquisas?")) {
      setHistory([]);
    }
  };

  const handleHistoryClick = (item: HistoryItem) => {
    setSearchTerm(item.theme);
    setAgeGroup(item.ageGroup);
  };

  const handleRandomIdea = useCallback(async () => {
    setIsGeneratingIdea(true);
    setSearchTerm('');
    try {
        const randomTheme = await getRandomThemeSuggestion(ageGroup);
        setSearchTerm(randomTheme);
    } catch (err) {
        setError('Não foi possível gerar uma ideia aleatória.');
    } finally {
        setIsGeneratingIdea(false);
    }
  }, [ageGroup]);

  const handleAutoGenerateThemes = useCallback(async () => {
      if (!searchTerm.trim()) {
          setError('Digite um tema para gerar variações.');
          return;
      }
      setIsGeneratingIdea(true);
      setError('');
      setSuggestedThemes([]);
      try {
          const themes = await generateCreativeThemes(ageGroup, searchTerm);
          setSuggestedThemes(themes);
      } catch (err) {
          setError('Não foi possível gerar a lista de ideias.');
      } finally {
          setIsGeneratingIdea(false);
      }
  }, [ageGroup, searchTerm]);

  const handleSelectSuggestion = (theme: string) => {
      setSearchTerm(theme);
      // Opcional: Limpar sugestões após selecionar
      // setSuggestedThemes([]); 
  };

  const handleGenerateLesson = useCallback(async () => {
    if (!searchTerm.trim()) {
      setError('Por favor, insira um tema para a aula.');
      return;
    }
    setError('');
    setLessonPlan('');
    setColoringImage(null);
    setIsGeneratingLesson(true);
    
    // Add to history before generating
    addToHistory(searchTerm, ageGroup);

    try {
      const plan = await generateLessonPlan(searchTerm, ageGroup);
      setLessonPlan(plan);
    } catch (err) {
      setError('Falha ao gerar o plano de aula. Tente novamente.');
      console.error(err);
    } finally {
      setIsGeneratingLesson(false);
    }
  }, [searchTerm, ageGroup]);

  const handleGenerateImage = useCallback(async () => {
    if (!searchTerm.trim()) {
      setError('O tema da aula está vazio.');
      return;
    }
    setError('');
    setIsGeneratingImage(true);
    setColoringImage(null);
    try {
      const imageB64 = await generateColoringImage(searchTerm);
      if (imageB64) {
        setColoringImage(`data:image/png;base64,${imageB64}`);
      } else {
         setError('Não foi possível gerar a imagem. Tente novamente.');
      }
    } catch (err) {
      setError('Falha ao gerar a imagem. Tente novamente.');
      console.error(err);
    } finally {
      setIsGeneratingImage(false);
    }
  }, [searchTerm]);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(lessonPlan).then(() => {
        setCopySuccess('Copiado!');
        setTimeout(() => setCopySuccess(''), 2000);
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Plano de Aula: ${searchTerm}`,
          text: lessonPlan,
        });
      } catch (err) {
        console.log('Error sharing', err);
      }
    } else {
      handleCopyToClipboard();
      alert('Compartilhamento não suportado neste navegador. O texto foi copiado para a área de transferência.');
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '', 'width=800,height=600');
    if (printWindow) {
        printWindow.document.write(`
            <html>
                <head>
                    <title>Plano de Aula - ${searchTerm}</title>
                    <style>
                        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; }
                        h1 { color: #2563EB; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-bottom: 20px; }
                        h2 { font-size: 1.3em; margin-top: 25px; color: #1F2937; border-left: 4px solid #FBBF24; padding-left: 10px; }
                        p { margin-bottom: 15px; text-align: justify; }
                        .meta { color: #666; font-style: italic; margin-bottom: 30px; }
                    </style>
                </head>
                <body>
                    <h1>${searchTerm}</h1>
                    <div class="meta">Faixa Etária: ${ageGroup}</div>
                    ${lessonPlan.split('\n').map(line => {
                         if (line.trim().startsWith('**') || line.trim().startsWith('##')) {
                             const title = line.replace(/\*+/g, '').replace(/#+/g, '');
                             return `<h2>${title}</h2>`;
                         }
                         if (line.trim() === '') return '';
                         return `<p>${line}</p>`;
                    }).join('')}
                    <script>
                        window.onload = function() { window.print(); window.close(); }
                    </script>
                </body>
            </html>
        `);
        printWindow.document.close();
    }
  };

  // Componente de Estado Vazio
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in-up">
        <div className="bg-blue-50 dark:bg-gray-800 p-6 rounded-full mb-6">
            <LightBulbIcon className="w-16 h-16 text-brand-blue/60 dark:text-brand-blue" />
        </div>
        <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-2">Pronto para criar?</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Digite um tema acima ou utilize nosso gerador de ideias. A IA criará um plano completo em segundos.
        </p>
        <div className="flex gap-4 mt-8 opacity-60">
            <div className="flex flex-col items-center">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg mb-2"><BookOpenIcon className="w-5 h-5" /></div>
                <span className="text-xs">Histórias</span>
            </div>
            <div className="flex flex-col items-center">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg mb-2"><SparklesIcon className="w-5 h-5" /></div>
                <span className="text-xs">Dinâmicas</span>
            </div>
            <div className="flex flex-col items-center">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg mb-2"><PhotoIcon className="w-5 h-5" /></div>
                <span className="text-xs">Desenhos</span>
            </div>
        </div>
    </div>
  );

  return (
    <div className="container mx-auto pl-16 lg:pl-64 flex flex-col xl:flex-row gap-8 h-[calc(100vh-2rem)] overflow-hidden">
      
      {/* Main Scrollable Content */}
      <div className="flex-grow overflow-y-auto pr-2 pb-20 scrollbar-hide">
        
        <header className="mb-8">
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-purple-600 dark:from-brand-blue dark:to-blue-300">
                Gerador de Temas
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
                Planejamento criativo com inteligência artificial.
            </p>
        </header>

        {/* Input Card */}
        <div className="bg-white dark:bg-dark-card p-1 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 mb-8">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 p-6 rounded-xl">
                <div className="flex flex-col gap-5">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="w-full md:w-1/3">
                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 ml-1">
                                Público Alvo
                            </label>
                            <div className="relative">
                                <select 
                                    value={ageGroup} 
                                    onChange={(e) => setAgeGroup(e.target.value)}
                                    className="w-full p-3 pl-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-shadow appearance-none font-medium text-gray-700 dark:text-gray-200 shadow-sm"
                                >
                                    <option value="2-3 anos">Maternal (2-3 anos)</option>
                                    <option value="4-6 anos">Jardim (4-6 anos)</option>
                                    <option value="7-9 anos">Primário (7-9 anos)</option>
                                    <option value="10-12 anos">Juniores (10-12 anos)</option>
                                    <option value="Livre">Livre (Multietário)</option>
                                </select>
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-2/3">
                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 ml-1">
                                Tema Bíblico
                            </label>
                            <div className="flex gap-2">
                                <div className="relative flex-grow">
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Ex: A Parábola do Semeador..."
                                        className="w-full p-3 pl-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-shadow shadow-sm dark:text-white"
                                        onKeyDown={(e) => e.key === 'Enter' && handleGenerateLesson()}
                                    />
                                    {(isGeneratingIdea && !suggestedThemes.length) && (
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                            <div className="w-4 h-4 border-2 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    )}
                                </div>
                                <button 
                                    onClick={handleRandomIdea}
                                    disabled={isGeneratingIdea || isGeneratingLesson}
                                    className="flex-shrink-0 bg-white dark:bg-gray-700 hover:bg-purple-50 dark:hover:bg-gray-600 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-gray-600 rounded-xl px-4 transition-all shadow-sm flex items-center justify-center hover:scale-105 active:scale-95"
                                    title="Me dê uma ideia aleatória!"
                                >
                                    <DiceIcon className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Generator Buttons and Output Area */}
                    <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                            <button
                                onClick={handleAutoGenerateThemes}
                                disabled={isGeneratingIdea}
                                className={`text-xs font-bold flex items-center transition-colors ${!searchTerm.trim() ? 'text-gray-400 cursor-not-allowed' : 'text-brand-blue hover:text-brand-blue-dark hover:underline'}`}
                                title={!searchTerm.trim() ? "Digite um tema primeiro" : "Gerar variações do tema digitado"}
                            >
                                <SparklesIcon className="w-3 h-3 mr-1" />
                                {isGeneratingIdea ? 'Gerando ideias...' : 'Gerar ideias sobre o tema'}
                            </button>
                        </div>

                         {suggestedThemes.length > 0 && (
                            <div className="flex flex-wrap gap-2 animate-fade-in-up">
                                {suggestedThemes.map((theme, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleSelectSuggestion(theme)}
                                        className="text-sm px-3 py-1.5 bg-white dark:bg-gray-700 border border-indigo-100 dark:border-gray-600 rounded-full text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-gray-600 hover:border-indigo-200 transition-all shadow-sm active:scale-95"
                                    >
                                        {theme}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleGenerateLesson}
                        disabled={isGeneratingLesson || !searchTerm}
                        className="w-full flex items-center justify-center bg-brand-blue hover:bg-brand-blue-dark text-white font-bold text-lg py-3.5 px-6 rounded-xl shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {isGeneratingLesson ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                                Escrevendo o Plano...
                            </>
                        ) : (
                            <>
                                <SparklesIcon className="w-6 h-6 mr-2" />
                                Criar Plano de Aula
                            </>
                        )}
                    </button>
                    {error && <p className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">{error}</p>}
                </div>
            </div>
        </div>

        {/* Content Area */}
        {!lessonPlan && !isGeneratingLesson && <EmptyState />}

        {isGeneratingLesson && (
             <div className="py-20">
                 <LoadingSpinner />
                 <p className="text-center text-gray-500 mt-4 animate-pulse">A inteligência artificial está lendo a Bíblia...</p>
             </div>
        )}

        {lessonPlan && (
            <div className="animate-fade-in-up space-y-8">
                
                {/* Document Card */}
                <div className="bg-white dark:bg-dark-card rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden relative">
                    
                    {/* Sticky Toolbar */}
                    <div className="sticky top-0 z-10 bg-white/90 dark:bg-dark-card/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-700 px-4 py-3 flex justify-between items-center">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 flex items-center">
                            <BookOpenIcon className="w-4 h-4 mr-1.5" />
                            Plano de Aula
                        </span>
                        <div className="flex gap-1">
                            <button onClick={handleShare} className="p-2 text-gray-500 hover:text-brand-blue hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors" title="Compartilhar">
                                <ShareIcon className="w-5 h-5" />
                            </button>
                            <button onClick={handleCopyToClipboard} className="p-2 text-gray-500 hover:text-brand-blue hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors relative" title="Copiar">
                                <ClipboardDocumentIcon className="w-5 h-5" />
                                {copySuccess && <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded">{copySuccess}</span>}
                            </button>
                            <button onClick={handlePrint} className="p-2 text-gray-500 hover:text-brand-blue hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors" title="Imprimir">
                                <PrinterIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 sm:p-12">
                        <div className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300">
                             {lessonPlan.split('\n').map((line, index) => {
                                const trimmed = line.trim();
                                if (trimmed.startsWith('**') || trimmed.startsWith('##')) {
                                    // Remove markdown symbols
                                    const title = trimmed.replace(/[\*#]/g, '').trim();
                                    return (
                                        <div key={index} className="mt-8 mb-3 first:mt-0">
                                            <h3 className="text-xl font-bold text-brand-blue-dark dark:text-blue-400 border-l-4 border-brand-yellow pl-3">
                                                {title}
                                            </h3>
                                        </div>
                                    );
                                }
                                if (trimmed === '') return null;
                                return <p key={index} className="leading-relaxed mb-4">{line}</p>;
                            })}
                        </div>
                    </div>
                </div>

                {/* Image Generation Section */}
                <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 flex flex-col items-center justify-center text-center">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Material de Apoio</h3>
                    <p className="text-sm text-gray-500 mb-6 max-w-md">Gere um desenho exclusivo para as crianças colorirem baseado no tema desta aula.</p>
                    
                    {!coloringImage ? (
                        <button
                            onClick={handleGenerateImage}
                            disabled={isGeneratingImage}
                            className="flex items-center justify-center bg-brand-green hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isGeneratingImage ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div> : <PhotoIcon className="w-5 h-5 mr-2" />}
                            {isGeneratingImage ? 'Desenhando...' : 'Gerar Desenho para Colorir'}
                        </button>
                    ) : (
                         <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl shadow-inner w-full max-w-md animate-fade-in-up">
                            <div className="bg-white p-3 shadow-md transform -rotate-1 hover:rotate-0 transition-transform duration-300">
                                <img src={coloringImage} alt="Desenho para colorir" className="w-full h-auto border border-gray-100" />
                            </div>
                            <div className="flex justify-center mt-4 gap-3">
                                <a
                                    href={coloringImage}
                                    download={`colorir_${searchTerm.replace(/\s+/g, '_').toLowerCase()}.png`}
                                    className="flex items-center text-sm font-bold text-brand-blue hover:text-blue-700 bg-white dark:bg-gray-700 px-4 py-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600"
                                >
                                    <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                                    Baixar
                                </a>
                                <button
                                    onClick={handleGenerateImage}
                                    className="flex items-center text-sm font-bold text-gray-600 hover:text-gray-800 bg-white dark:bg-gray-700 px-4 py-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600"
                                >
                                    <SparklesIcon className="w-4 h-4 mr-2" />
                                    Gerar Outro
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="h-10"></div> {/* Spacer */}
            </div>
        )}
      </div>

      {/* Right Sidebar - History (Visible on XL screens) */}
      <aside className="hidden xl:block w-80 flex-shrink-0">
         <div className="bg-white dark:bg-dark-card rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-5 sticky top-4">
            <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-100 dark:border-gray-700">
                <h3 className="font-bold text-gray-800 dark:text-gray-200 flex items-center">
                    <ClockIcon className="w-5 h-5 mr-2 text-brand-blue" />
                    Recentes
                </h3>
                {history.length > 0 && (
                    <button onClick={clearHistory} className="text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-2 py-1 rounded transition-colors" title="Limpar histórico">
                        <TrashIcon className="w-4 h-4" />
                    </button>
                )}
            </div>
            
            <div className="space-y-3">
                {history.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                        <p className="text-sm italic">Suas ideias aparecerão aqui.</p>
                    </div>
                ) : (
                    history.map((item, idx) => (
                        <button 
                            key={idx}
                            onClick={() => handleHistoryClick(item)}
                            className="w-full text-left p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-blue-50 dark:hover:bg-gray-700 border border-transparent hover:border-brand-blue/30 transition-all group"
                        >
                            <p className="font-semibold text-gray-700 dark:text-gray-200 text-sm truncate group-hover:text-brand-blue transition-colors">
                                {item.theme}
                            </p>
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 inline-block bg-white dark:bg-gray-800 px-2 py-0.5 rounded-full shadow-sm">
                                {item.ageGroup}
                            </span>
                        </button>
                    ))
                )}
            </div>
         </div>
      </aside>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
        @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
            animation: fade-in-up 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ThemeGenerator;
