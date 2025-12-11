import { LoadedImage, ConversionResult, formatFileSize } from '../types'

export class ImagePreview {
  private originalPreview: HTMLImageElement
  private resultPreview: HTMLImageElement
  private originalInfo: HTMLElement
  private resultInfo: HTMLElement

  constructor() {
    this.originalPreview = document.getElementById('original-preview') as HTMLImageElement
    this.resultPreview = document.getElementById('result-preview') as HTMLImageElement
    this.originalInfo = document.getElementById('original-info')!
    this.resultInfo = document.getElementById('result-info')!
  }

  public showOriginal(image: LoadedImage): void {
    this.originalPreview.src = image.dataUrl
    this.originalInfo.textContent = `${image.originalWidth} × ${image.originalHeight} px | ${formatFileSize(image.file.size)}`
  }

  public showResult(result: ConversionResult): void {
    this.resultPreview.src = result.dataUrl
    this.resultInfo.textContent = `${result.width} × ${result.height} px | ${formatFileSize(result.size)}`
  }

  public clearResult(): void {
    this.resultPreview.removeAttribute('src')
    this.resultInfo.textContent = ''
  }

  public reset(): void {
    this.originalPreview.removeAttribute('src')
    this.resultPreview.removeAttribute('src')
    this.originalInfo.textContent = ''
    this.resultInfo.textContent = ''
  }
}
