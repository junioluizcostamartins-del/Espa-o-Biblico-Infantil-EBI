
import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { SunIcon, MoonIcon, GoogleIcon, FacebookIcon, EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon, SparklesIcon } from './icons/Icons';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState<string | null>(null);
  const { theme, toggleTheme } = useTheme();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Mock authentication latency
    setTimeout(() => {
        if (email === 'admin@ebi.com' && password === '123456') {
            onLoginSuccess();
        } else {
            setError('E-mail ou senha incorretos. Por favor, tente novamente.');
            setIsLoading(false);
        }
    }, 1000);
  };

  const handleSocialLogin = (provider: 'google' | 'facebook') => {
    setIsSocialLoading(provider);
    // Simulating API latency
    setTimeout(() => {
        setIsSocialLoading(null);
        onLoginSuccess();
    }, 1500);
  };

  return (
    <div className="flex min-h-screen bg-light-bg dark:bg-dark-bg font-sans overflow-hidden">
      
      {/* Left Side - Brand / Image (Visible on Large Screens) */}
      <div className="hidden lg:flex w-1/2 bg-brand-blue relative flex-col justify-center items-center text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-blue via-brand-blue-dark to-purple-800 opacity-90"></div>
        
        {/* Decorative Circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-yellow opacity-5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-brand-pink opacity-10 rounded-full blur-3xl"></div>

        <div className="relative z-10 text-center px-12">
            <div className="mb-8 inline-block p-4 bg-white/10 rounded-full backdrop-blur-sm shadow-xl">
                 <SparklesIcon className="w-16 h-16 text-brand-yellow" />
            </div>
            <h1 className="text-5xl font-extrabold mb-4 tracking-tight drop-shadow-md">Espaço Bíblico Infantil</h1>
            <p className="text-xl font-light text-blue-100 max-w-md mx-auto leading-relaxed">
                "Ensina a criança no caminho em que deve andar, e até quando envelhecer não se desviará dele."
            </p>
            <div className="mt-8 flex justify-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full opacity-50"></div>
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <div className="w-2 h-2 bg-white rounded-full opacity-50"></div>
            </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative">
        {/* Theme Toggle */}
        <div className="absolute top-6 right-6 z-20">
            <button
                onClick={toggleTheme}
                className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all shadow-sm"
                aria-label={`Mudar para modo ${theme === 'light' ? 'escuro' : 'claro'}`}
            >
                {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
            </button>
        </div>

        <div className="w-full max-w-md space-y-8 animate-fade-in-up">
            <div className="text-center lg:text-left">
                <div className="lg:hidden flex justify-center mb-4">
                     <div className="p-3 bg-brand-blue/10 rounded-full">
                        <SparklesIcon className="w-10 h-10 text-brand-blue" />
                     </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Bem-vindo de volta!</h2>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Acesse sua conta para gerenciar o ministério.
                </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            E-mail
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent dark:bg-gray-800 dark:text-white transition-all"
                                placeholder="seuemail@exemplo.com"
                            />
                        </div>
                    </div>

                    <div>
                         <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Senha
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <LockClosedIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent dark:bg-gray-800 dark:text-white transition-all"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            className="h-4 w-4 text-brand-blue focus:ring-brand-blue border-gray-300 rounded"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                            Lembrar-me
                        </label>
                    </div>

                    <div className="text-sm">
                        <a href="#" className="font-medium text-brand-blue hover:text-brand-blue-dark hover:underline">
                            Esqueceu a senha?
                        </a>
                    </div>
                </div>

                {error && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400 text-center animate-pulse">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-brand-blue hover:bg-brand-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        "Entrar"
                    )}
                </button>
            </form>

            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-light-bg dark:bg-dark-bg text-gray-500 dark:text-gray-400 font-medium">
                        Ou entre com
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                 <button
                    type="button"
                    onClick={() => handleSocialLogin('google')}
                    disabled={!!isSocialLoading}
                    className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                    {isSocialLoading === 'google' ? (
                         <div className="w-5 h-5 border-2 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <>
                             <GoogleIcon className="h-5 w-5 mr-2" />
                             <span>Google</span>
                        </>
                    )}
                </button>
                <button
                    type="button"
                    onClick={() => handleSocialLogin('facebook')}
                    disabled={!!isSocialLoading}
                    className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                    {isSocialLoading === 'facebook' ? (
                        <div className="w-5 h-5 border-2 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <>
                             <FacebookIcon className="h-5 w-5 mr-2 text-[#1877F2]" fill="currentColor" />
                             <span>Facebook</span>
                        </>
                    )}
                </button>
            </div>
            
             <p className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
                Não tem uma conta? <a href="#" className="font-medium text-brand-blue hover:underline">Cadastre-se gratuitamente</a>
            </p>
        </div>
      </div>
       <style>{`
        @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
            animation: fade-in-up 0.6s ease-out forwards;
        }
    `}</style>
    </div>
  );
};

export default LoginScreen;
