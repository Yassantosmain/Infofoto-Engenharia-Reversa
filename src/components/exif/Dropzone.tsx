import React, { useState, useCallback } from 'react';
import { Upload, File, X, Loader2, ShieldCheck, ShieldAlert, Download, Sparkles, Wand2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import EXIF from 'exif-js';
import { analyzeMetadata } from '../../services/geminiService';

export const Dropzone: React.FC = () => {
  const { t, language } = useLanguage();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [metadata, setMetadata] = useState<any>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFile(droppedFile);
  }, []);

  const handleFile = (file: File) => {
    setFile(file);
    setIsProcessing(true);
    setAiResult(null);
    setError(null);
    
    // Extração de EXIF e Base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setImageBase64(base64);

      // Usar EXIF.getData para melhor compatibilidade
      EXIF.getData(file as any, function(this: any) {
        const exifData = EXIF.getAllTags(this);
        const cleanMetadata: any = {};
        
        if (exifData && Object.keys(exifData).length > 0) {
          for (const key in exifData) {
            if (typeof exifData[key] !== 'function' && typeof exifData[key] !== 'object') {
              cleanMetadata[key] = exifData[key];
            }
          }
        }
        setMetadata(cleanMetadata);
        setIsProcessing(false);
      });
    };
    reader.readAsDataURL(file);
  };

  const handleAiAnalysis = async () => {
    if (!imageBase64) return;
    setIsAiLoading(true);
    setError(null);
    try {
      const result = await analyzeMetadata(metadata || {}, imageBase64, language);
      setAiResult(result || null);
    } catch (err) {
      setError(language === 'pt' ? 'Erro ao conectar com a IA. Tente novamente.' : 'AI connection error. Try again.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const scrubAndDownload = () => {
    if (!file) return;
    
    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          // Exporting to dataURL strips EXIF by default in browsers
          const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
          const link = document.createElement('a');
          link.download = `scrubbed_${file.name}`;
          link.href = dataUrl;
          link.click();
        }
        setIsProcessing(false);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`relative rounded-[32px] p-16 text-center transition-all duration-300
          ${isDragging || file 
            ? 'nm-inset-delicate' 
            : 'nm-flat-delicate hover:scale-[1.01]'
          }
        `}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />

        {!file ? (
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-full nm-flat-delicate flex items-center justify-center mx-auto text-[#3498db]">
              <Upload className="w-8 h-8" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">{t('dropzone_title')}</p>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                {t('dropzone_subtitle').split('clique')[0]} <span className="text-[#3498db] font-semibold">clique para buscar</span>
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <div className="w-20 h-20 rounded-2xl nm-flat-delicate flex items-center justify-center text-[#3498db]">
              {isProcessing ? (
                <Loader2 className="w-8 h-8 animate-spin" />
              ) : (
                <File className="w-10 h-10" />
              )}
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-slate-800 dark:text-white truncate max-w-[250px]">{file.name}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            {!isProcessing && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                  setMetadata(null);
                  setAiResult(null);
                }}
                className="custom-button !text-red-500 !px-8"
              >
                {t('dropzone_remove')}
              </button>
            )}
          </div>
        )}
      </div>

      {file && !isProcessing && (
        <div className="grid md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Privacy Card */}
          <div className="nm-flat-delicate p-8 rounded-[32px] space-y-4">
            <div className="flex items-center gap-3 text-[#3498db]">
              <ShieldCheck className="w-6 h-6" />
              <h3 className="font-bold text-slate-800 dark:text-white">{t('privacy_status_safe')}</h3>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {t('privacy_status_desc')}
            </p>
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3 text-[#3498db] mb-2">
                <ShieldAlert className="w-5 h-5" />
                <h4 className="font-bold text-sm text-slate-800 dark:text-white">{t('privacy_title')}</h4>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-4">
                {t('privacy_scrub_desc')}
              </p>
              <button
                onClick={scrubAndDownload}
                className="w-full custom-button !bg-[#3498db] !text-white !shadow-none flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98]"
              >
                <Download className="w-4 h-4" />
                {t('privacy_scrub_btn')}
              </button>
            </div>
          </div>

          {/* AI Analysis Card */}
          <div className="nm-flat-delicate p-8 rounded-[32px] space-y-4 border-2 border-[#3498db]/10">
            <div className="flex items-center gap-3 text-[#3498db]">
              <Sparkles className="w-6 h-6" />
              <h3 className="font-bold text-slate-800 dark:text-white">{t('ai_analysis_title')}</h3>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {t('ai_analysis_desc')}
            </p>
            
            {error && (
              <p className="text-[10px] text-red-500 font-bold animate-pulse">
                {error}
              </p>
            )}
            
            {aiResult ? (
              <div className="nm-inset-delicate p-6 rounded-2xl max-h-[200px] overflow-y-auto text-sm text-slate-600 dark:text-slate-400 leading-relaxed scrollbar-hide">
                <h4 className="font-bold text-[#3498db] mb-2 flex items-center gap-2">
                  <Wand2 className="w-4 h-4" />
                  {t('ai_analysis_result')}
                </h4>
                <div className="whitespace-pre-wrap">
                  {aiResult}
                </div>
              </div>
            ) : (
              <button
                onClick={handleAiAnalysis}
                disabled={isAiLoading}
                className="w-full custom-button !bg-slate-800 dark:!bg-slate-700 !text-white !shadow-none flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
              >
                {isAiLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t('ai_analysis_loading')}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    {t('ai_analysis_btn')}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
