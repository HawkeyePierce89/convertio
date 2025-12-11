import { FileUploader } from './modules/FileUploader'
import { ImagePreview } from './modules/ImagePreview'
import { ConversionSettingsUI } from './modules/ConversionSettings'
import { ImageConverter } from './modules/ImageConverter'
import { FileDownloader } from './modules/FileDownloader'
import { LoadedImage, ConversionResult } from './types'
import { i18n } from './i18n'

export class App {
  private fileUploader!: FileUploader
  private imagePreview!: ImagePreview
  private conversionSettings!: ConversionSettingsUI
  private imageConverter!: ImageConverter
  private fileDownloader!: FileDownloader

  private uploadSection!: HTMLElement
  private editorSection!: HTMLElement
  private convertBtn!: HTMLButtonElement
  private downloadBtn!: HTMLButtonElement
  private resetBtn!: HTMLButtonElement

  private currentImage: LoadedImage | null = null
  private currentResult: ConversionResult | null = null

  public init(): void {
    this.uploadSection = document.getElementById('upload-section')!
    this.editorSection = document.getElementById('editor-section')!
    this.convertBtn = document.getElementById('convert-btn') as HTMLButtonElement
    this.downloadBtn = document.getElementById('download-btn') as HTMLButtonElement
    this.resetBtn = document.getElementById('reset-btn') as HTMLButtonElement

    this.fileUploader = new FileUploader(
      'drop-zone',
      'file-input',
      'select-file-btn',
      (file) => this.handleFileSelected(file)
    )

    this.imagePreview = new ImagePreview()

    this.conversionSettings = new ConversionSettingsUI(() => {
      this.imagePreview.clearResult()
      this.currentResult = null
      this.downloadBtn.disabled = true
    })

    this.imageConverter = new ImageConverter()
    this.fileDownloader = new FileDownloader()

    this.setupButtons()
  }

  private setupButtons(): void {
    this.convertBtn.addEventListener('click', () => this.handleConvert())
    this.downloadBtn.addEventListener('click', () => this.handleDownload())
    this.resetBtn.addEventListener('click', () => this.handleReset())
  }

  private async handleFileSelected(file: File): Promise<void> {
    try {
      const image = await this.loadImage(file)
      this.currentImage = image

      this.imagePreview.showOriginal(image)
      this.conversionSettings.setOriginalDimensions(image.originalWidth, image.originalHeight)

      this.uploadSection.hidden = true
      this.editorSection.hidden = false
    } catch (error) {
      console.error('Failed to load image:', error)
      alert(i18n.t('error.loadFailed'))
    }
  }

  private loadImage(file: File): Promise<LoadedImage> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = (e) => {
        const dataUrl = e.target?.result as string
        const img = new Image()

        img.onload = () => {
          resolve({
            file,
            originalWidth: img.naturalWidth,
            originalHeight: img.naturalHeight,
            dataUrl,
            element: img,
          })
        }

        img.onerror = () => reject(new Error('Failed to load image'))
        img.src = dataUrl
      }

      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsDataURL(file)
    })
  }

  private async handleConvert(): Promise<void> {
    if (!this.currentImage) return

    this.convertBtn.disabled = true
    this.convertBtn.textContent = i18n.t('actions.converting')

    try {
      const settings = this.conversionSettings.getSettings()
      const result = await this.imageConverter.convert(this.currentImage.element, settings)

      this.currentResult = result
      this.imagePreview.showResult(result)
      this.downloadBtn.disabled = false
    } catch (error) {
      console.error('Conversion failed:', error)
      alert(i18n.t('error.conversionFailed'))
    } finally {
      this.convertBtn.disabled = false
      this.convertBtn.textContent = i18n.t('actions.convert')
    }
  }

  private handleDownload(): void {
    if (!this.currentResult || !this.currentImage) return

    this.fileDownloader.download(
      this.currentResult.blob,
      this.currentImage.file.name,
      this.currentResult.format
    )
  }

  private handleReset(): void {
    this.currentImage = null
    this.currentResult = null

    this.fileUploader.reset()
    this.imagePreview.reset()
    this.conversionSettings.reset()

    this.downloadBtn.disabled = true
    this.editorSection.hidden = true
    this.uploadSection.hidden = false
  }
}
