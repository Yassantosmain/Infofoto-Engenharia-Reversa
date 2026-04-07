/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Layout } from './components/layout/Layout';
import { Dropzone } from './components/exif/Dropzone';
import { useLanguage } from './context/LanguageContext';

export default function App() {
  const { t } = useLanguage();

  return (
    <Layout>
      <div className="space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-block nm-flat-delicate px-10 py-4 rounded-3xl">
            <h1 className="text-3xl font-black logo-text tracking-tighter">
              {t('hero_title').split('Info')[0]}Info<span className="text-[#3498db]">{t('hero_title').split('Info')[1]}</span>
            </h1>
          </div>
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">
            {t('hero_subtitle')}
          </p>
        </div>

        <Dropzone />

        <div className="grid md:grid-cols-2 gap-12 pt-8">
          <div className="space-y-4 px-6">
            <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200 tracking-tight flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3498db]" />
              {t('info_exif_title')}
            </h2>
            <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              {t('info_exif_text')}
            </p>
          </div>
          <div className="space-y-4 px-6">
            <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200 tracking-tight flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3498db]" />
              {t('info_privacy_title')}
            </h2>
            <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              {t('info_privacy_text')}
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
