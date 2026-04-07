import React from 'react';
import { Container } from '../ui/Container';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { Languages, Sun, Moon } from 'lucide-react';

export const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const toggleLanguage = () => {
    setLanguage(language === 'pt' ? 'en' : 'pt');
  };

  return (
    <header className="py-8">
      <Container className="flex items-center justify-between">
        <div className="nm-flat-delicate px-6 py-3 rounded-2xl">
          <a href="/" className="text-2xl font-black tracking-tighter logo-text">
            Info<span className="text-[#3498db]">{language === 'pt' ? 'Foto' : 'Photo'}</span>
          </a>
        </div>
        
        <nav className="flex items-center gap-4">
          <a href="#" className="custom-button hidden md:block">{t('nav_home')}</a>
          <a href="#" className="custom-button hidden md:block">{t('nav_api')}</a>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleTheme}
              className="custom-button !p-2 rounded-full flex items-center justify-center"
              title={theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            <button 
              onClick={toggleLanguage}
              className="custom-button flex items-center gap-2 !bg-[#3498db] !text-white !shadow-none"
            >
              <Languages className="w-4 h-4" />
              <span className="uppercase">{language}</span>
            </button>
          </div>
        </nav>
      </Container>
    </header>
  );
};
