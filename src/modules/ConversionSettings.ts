import { ConversionSettings as Settings, ImageFormat } from '../types'

export type SettingsChangedCallback = (settings: Settings) => void

export class ConversionSettingsUI {
  private formatSelect: HTMLSelectElement
  private widthInput: HTMLInputElement
  private heightInput: HTMLInputElement
  private qualitySlider: HTMLInputElement
  private qualityValue: HTMLElement
  private qualityGroup: HTMLElement
  private aspectRatioCheckbox: HTMLInputElement

  private originalWidth = 0
  private originalHeight = 0
  private aspectRatio = 1
  private isUpdating = false

  private onChange: SettingsChangedCallback

  constructor(callback: SettingsChangedCallback) {
    this.formatSelect = document.getElementById('format-select') as HTMLSelectElement
    this.widthInput = document.getElementById('width-input') as HTMLInputElement
    this.heightInput = document.getElementById('height-input') as HTMLInputElement
    this.qualitySlider = document.getElementById('quality-slider') as HTMLInputElement
    this.qualityValue = document.getElementById('quality-value')!
    this.qualityGroup = document.getElementById('quality-group')!
    this.aspectRatioCheckbox = document.getElementById('aspect-ratio-checkbox') as HTMLInputElement
    this.onChange = callback

    this.setupEventListeners()
  }

  private setupEventListeners(): void {
    this.formatSelect.addEventListener('change', () => {
      this.updateQualityVisibility()
      this.onChange(this.getSettings())
    })

    this.widthInput.addEventListener('input', () => {
      if (this.isUpdating) return
      this.handleWidthChange()
      this.onChange(this.getSettings())
    })

    this.heightInput.addEventListener('input', () => {
      if (this.isUpdating) return
      this.handleHeightChange()
      this.onChange(this.getSettings())
    })

    this.qualitySlider.addEventListener('input', () => {
      this.qualityValue.textContent = this.qualitySlider.value
      this.onChange(this.getSettings())
    })

    this.aspectRatioCheckbox.addEventListener('change', () => {
      if (this.aspectRatioCheckbox.checked) {
        this.handleWidthChange()
      }
      this.onChange(this.getSettings())
    })
  }

  private handleWidthChange(): void {
    if (!this.aspectRatioCheckbox.checked) return

    const width = parseInt(this.widthInput.value) || 0
    if (width > 0) {
      this.isUpdating = true
      this.heightInput.value = String(Math.round(width / this.aspectRatio))
      this.isUpdating = false
    }
  }

  private handleHeightChange(): void {
    if (!this.aspectRatioCheckbox.checked) return

    const height = parseInt(this.heightInput.value) || 0
    if (height > 0) {
      this.isUpdating = true
      this.widthInput.value = String(Math.round(height * this.aspectRatio))
      this.isUpdating = false
    }
  }

  private updateQualityVisibility(): void {
    const format = this.formatSelect.value as ImageFormat
    const showQuality = format !== 'image/png'
    this.qualityGroup.style.display = showQuality ? 'block' : 'none'
  }

  public setOriginalDimensions(width: number, height: number): void {
    this.originalWidth = width
    this.originalHeight = height
    this.aspectRatio = width / height

    this.widthInput.value = String(width)
    this.heightInput.value = String(height)
  }

  public getSettings(): Settings {
    return {
      format: this.formatSelect.value as ImageFormat,
      width: parseInt(this.widthInput.value) || this.originalWidth,
      height: parseInt(this.heightInput.value) || this.originalHeight,
      quality: parseInt(this.qualitySlider.value) / 100,
      maintainAspectRatio: this.aspectRatioCheckbox.checked,
    }
  }

  public reset(): void {
    this.formatSelect.value = 'image/jpeg'
    this.widthInput.value = ''
    this.heightInput.value = ''
    this.qualitySlider.value = '80'
    this.qualityValue.textContent = '80'
    this.aspectRatioCheckbox.checked = true
    this.updateQualityVisibility()
    this.originalWidth = 0
    this.originalHeight = 0
    this.aspectRatio = 1
  }
}
