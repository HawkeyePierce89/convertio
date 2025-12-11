import { describe, it, expect } from 'vitest'
import { en } from './translations/en'
import { ru } from './translations/ru'
import { de } from './translations/de'
import { es } from './translations/es'
import { zh } from './translations/zh'

describe('i18n translations', () => {
  const translations = { en, ru, de, es, zh }
  const baseKeys = Object.keys(en)

  it('all languages should have the same keys as English', () => {
    Object.entries(translations).forEach(([_lang, trans]) => {
      const keys = Object.keys(trans)
      expect(keys.sort()).toEqual(baseKeys.sort())
    })
  })

  it('no translation should be empty', () => {
    Object.entries(translations).forEach(([_lang, trans]) => {
      Object.entries(trans).forEach(([_key, value]) => {
        expect(value.trim().length).toBeGreaterThan(0)
      })
    })
  })
})
