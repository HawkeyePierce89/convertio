import { ConversionSettings, ConversionResult, ImageFormat } from '../types'

export class ImageConverter {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D

  constructor() {
    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')!
  }

  public async convert(
    image: HTMLImageElement,
    settings: ConversionSettings
  ): Promise<ConversionResult> {
    const { width, height } = settings

    this.canvas.width = width
    this.canvas.height = height

    // Fill with white background for JPEG (no transparency)
    if (settings.format === 'image/jpeg') {
      this.ctx.fillStyle = '#ffffff'
      this.ctx.fillRect(0, 0, width, height)
    } else {
      this.ctx.clearRect(0, 0, width, height)
    }

    // Draw resized image
    this.ctx.drawImage(image, 0, 0, width, height)

    // Get quality (PNG ignores it)
    const quality = settings.format === 'image/png' ? undefined : settings.quality

    // Export to blob
    const blob = await this.exportToBlob(settings.format, quality)
    const dataUrl = this.canvas.toDataURL(settings.format, quality)

    return {
      blob,
      dataUrl,
      width,
      height,
      format: settings.format,
      size: blob.size,
    }
  }

  private exportToBlob(format: ImageFormat, quality?: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      this.canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('Failed to create blob'))
          }
        },
        format,
        quality
      )
    })
  }
}
