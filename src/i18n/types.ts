export type Language = 'en' | 'ru' | 'de' | 'es' | 'zh';

export const LANGUAGES: Record<Language, string> = {
  en: 'English',
  ru: 'Русский',
  de: 'Deutsch',
  es: 'Español',
  zh: '中文',
};

export type TranslationKey =
  | 'header.title'
  | 'header.subtitle'
  | 'upload.dragdrop'
  | 'upload.or'
  | 'upload.selectFile'
  | 'upload.supportedFormats'
  | 'upload.errorUnsupported'
  | 'settings.title'
  | 'settings.outputFormat'
  | 'settings.dimensions'
  | 'settings.width'
  | 'settings.height'
  | 'settings.maintainAspect'
  | 'settings.quality'
  | 'preview.original'
  | 'preview.result'
  | 'actions.convert'
  | 'actions.converting'
  | 'actions.download'
  | 'actions.uploadAnother'
  | 'pwa.updateAvailable'
  | 'pwa.offlineReady'
  | 'error.loadFailed'
  | 'error.conversionFailed'
  | 'footer.privacy';

export type Translations = Record<TranslationKey, string>;
