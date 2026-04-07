import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'pt' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  pt: {
    nav_home: 'Início',
    nav_api: 'API',
    nav_about: 'Sobre',
    nav_contact: 'Contato',
    hero_title: 'InfoFoto',
    hero_subtitle: 'Visualizador de Metadados Profissional',
    dropzone_title: 'Selecione uma foto',
    dropzone_subtitle: 'Arraste aqui ou clique para buscar',
    dropzone_processing: 'Processando...',
    dropzone_remove: 'Remover Arquivo',
    info_exif_title: 'O que são dados EXIF?',
    info_exif_text: 'EXIF (Exchangeable Image File Format) é um padrão que especifica os formatos de imagens, áudio e tags auxiliares usados por câmeras digitais, smartphones e outros sistemas.',
    info_privacy_title: 'Privacidade e Segurança',
    info_privacy_text: 'Seus arquivos são processados no seu navegador ou em um servidor temporário seguro e são excluídos automaticamente após o processamento. Nós não armazenamos suas imagens.',
    footer_privacy: 'Privacidade',
    footer_terms: 'Termos',
    footer_contact: 'Contato',
    footer_rights: 'Todos os direitos reservados.',
    privacy_title: 'Proteção de Privacidade Ativa',
    privacy_scrub_btn: 'Limpar Metadados e Baixar',
    privacy_scrub_desc: 'Remova GPS, modelo da câmera e outras informações sensíveis antes de compartilhar.',
    privacy_status_safe: 'Processamento 100% Local (Browser)',
    privacy_status_desc: 'Sua foto não sai do seu computador.',
    ai_analysis_title: 'Análise Inteligente (Gemini)',
    ai_analysis_btn: 'Analisar com IA',
    ai_analysis_loading: 'A IA está analisando sua foto...',
    ai_analysis_desc: 'Receba dicas de fotografia, análise técnica e contexto histórico da sua imagem.',
    ai_analysis_result: 'Insights da IA',
  },
  en: {
    nav_home: 'Home',
    nav_api: 'API',
    nav_about: 'About',
    nav_contact: 'Contact',
    hero_title: 'InfoPhoto',
    hero_subtitle: 'Professional Metadata Viewer',
    dropzone_title: 'Select a photo',
    dropzone_subtitle: 'Drag here or click to browse',
    dropzone_processing: 'Processing...',
    dropzone_remove: 'Remove File',
    info_exif_title: 'What are EXIF data?',
    info_exif_text: 'EXIF (Exchangeable Image File Format) is a standard that specifies the formats for images, audio, and ancillary tags used by digital cameras, smartphones and other systems.',
    info_privacy_title: 'Privacy and Security',
    info_privacy_text: 'Your files are processed in your browser or on a secure temporary server and are automatically deleted after processing. We do not store your images.',
    footer_privacy: 'Privacy',
    footer_terms: 'Terms',
    footer_contact: 'Contact',
    footer_rights: 'All rights reserved.',
    privacy_title: 'Active Privacy Protection',
    privacy_scrub_btn: 'Scrub Metadata & Download',
    privacy_scrub_desc: 'Remove GPS, camera model, and other sensitive info before sharing.',
    privacy_status_safe: '100% Local Processing (Browser)',
    privacy_status_desc: 'Your photo never leaves your computer.',
    ai_analysis_title: 'Intelligent Analysis (Gemini)',
    ai_analysis_btn: 'Analyze with AI',
    ai_analysis_loading: 'AI is analyzing your photo...',
    ai_analysis_desc: 'Get photography tips, technical analysis, and historical context of your image.',
    ai_analysis_result: 'AI Insights',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('pt');

  const t = (key: string): string => {
    return (translations[language] as any)[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
