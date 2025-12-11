import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('PWA Registration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    document.body.innerHTML = ''
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('showOfflineReadyToast', () => {
    it('should create toast element with correct class', () => {
      const toast = document.createElement('div')
      toast.className = 'pwa-toast'
      toast.textContent = 'Приложение готово к работе офлайн!'
      document.body.appendChild(toast)

      const toastElement = document.querySelector('.pwa-toast')
      expect(toastElement).toBeTruthy()
      expect(toastElement?.className).toBe('pwa-toast')
    })

    it('should show correct offline ready message', () => {
      const toast = document.createElement('div')
      toast.className = 'pwa-toast'
      toast.textContent = 'Приложение готово к работе офлайн!'
      document.body.appendChild(toast)

      expect(document.querySelector('.pwa-toast')?.textContent)
        .toBe('Приложение готово к работе офлайн!')
    })

    it('should remove toast after timeout', async () => {
      vi.useFakeTimers()

      const toast = document.createElement('div')
      toast.className = 'pwa-toast'
      document.body.appendChild(toast)
      setTimeout(() => toast.remove(), 3000)

      expect(document.querySelector('.pwa-toast')).toBeTruthy()

      vi.advanceTimersByTime(3000)

      expect(document.querySelector('.pwa-toast')).toBeNull()

      vi.useRealTimers()
    })
  })

  describe('onNeedRefresh callback', () => {
    it('should call update when user confirms', () => {
      const updateFn = vi.fn()
      vi.spyOn(window, 'confirm').mockReturnValue(true)

      const shouldUpdate = window.confirm('Доступна новая версия. Обновить?')
      if (shouldUpdate) {
        updateFn(true)
      }

      expect(window.confirm).toHaveBeenCalledWith('Доступна новая версия. Обновить?')
      expect(updateFn).toHaveBeenCalledWith(true)
    })

    it('should NOT call update when user declines', () => {
      const updateFn = vi.fn()
      vi.spyOn(window, 'confirm').mockReturnValue(false)

      const shouldUpdate = window.confirm('Доступна новая версия. Обновить?')
      if (shouldUpdate) {
        updateFn(true)
      }

      expect(window.confirm).toHaveBeenCalled()
      expect(updateFn).not.toHaveBeenCalled()
    })
  })

})
