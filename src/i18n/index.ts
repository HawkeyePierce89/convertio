import { Language, LANGUAGES, TranslationKey, Translations } from './types'
import { en } from './translations/en'
import { ru } from './translations/ru'
import { de } from './translations/de'
import { es } from './translations/es'
import { zh } from './translations/zh'

const STORAGE_KEY = 'convertio-language'

const translations: Record<Language, Translations> = { en, ru, de, es, zh }

class I18n {
  private currentLanguage: Language = 'en'

  constructor() {
    this.currentLanguage = this.loadLanguage()
  }

  private loadLanguage(): Language {
    const stored = localStorage.getItem(STORAGE_KEY) as Language | null
    if (stored && stored in translations) {
      return stored
    }
    return this.detectLanguage()
  }

  private detectLanguage(): Language {
    const browserLang = navigator.language.split('-')[0] as Language
    if (browserLang in translations) {
      return browserLang
    }
    return 'en'
  }

  public setLanguage(lang: Language): void {
    if (lang === this.currentLanguage) return

    this.currentLanguage = lang
    localStorage.setItem(STORAGE_KEY, lang)
    document.documentElement.lang = lang
    this.updateUI()
  }

  public t(key: TranslationKey): string {
    return translations[this.currentLanguage][key] || translations.en[key] || key
  }

  public init(): void {
    document.documentElement.lang = this.currentLanguage
    this.updateUI()
    this.setupLanguageSelector()
  }

  private updateUI(): void {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n') as TranslationKey
      if (key) {
        el.textContent = this.t(key)
      }
    })

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder') as TranslationKey
      if (key && el instanceof HTMLInputElement) {
        el.placeholder = this.t(key)
      }
    })

    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title') as TranslationKey
      if (key && el instanceof HTMLElement) {
        el.title = this.t(key)
      }
    })
  }

  private setupLanguageSelector(): void {
    const selector = document.getElementById('language-select') as HTMLSelectElement | null
    if (!selector) return

    selector.innerHTML = ''
    ;(Object.keys(LANGUAGES) as Language[]).forEach(lang => {
      const option = document.createElement('option')
      option.value = lang
      option.textContent = LANGUAGES[lang]
      option.selected = lang === this.currentLanguage
      selector.appendChild(option)
    })

    selector.addEventListener('change', () => {
      this.setLanguage(selector.value as Language)
    })
  }
}

export const i18n = new I18n()
