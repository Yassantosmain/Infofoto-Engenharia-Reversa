import React from 'react';
import { Header } from './Header';
import { Container } from '../ui/Container';
import { useLanguage } from '../../context/LanguageContext';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-700 dark:text-slate-300 transition-colors duration-300">
      <Header />
      <main className="flex-grow py-4">
        <Container>
          {children}
        </Container>
      </main>
      <footer className="bg-[#2c3e50] dark:bg-[#121926] text-white py-12 mt-auto transition-colors duration-300 border-t border-transparent dark:border-slate-800">
        <Container className="text-center">
          <div className="flex justify-center gap-8 mb-4 text-xs font-bold uppercase tracking-widest opacity-80">
            <a href="#" className="hover:text-[#3498db] transition-colors">{t('footer_privacy')}</a>
            <a href="#" className="hover:text-[#3498db] transition-colors">{t('footer_terms')}</a>
            <a href="#" className="hover:text-[#3498db] transition-colors">{t('footer_contact')}</a>
          </div>
          <p className="text-[10px] font-bold opacity-50 uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} InfoFoto. {t('footer_rights')}
          </p>
        </Container>
      </footer>
    </div>
  );
};
