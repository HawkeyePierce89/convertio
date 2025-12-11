import { ImageFormat, getFormatExtension } from '../types'

export class FileDownloader {
  public download(blob: Blob, originalName: string, format: ImageFormat): void {
    const filename = this.generateFilename(originalName, format)
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    URL.revokeObjectURL(url)
  }

  private generateFilename(originalName: string, format: ImageFormat): string {
    const baseName = originalName.replace(/\.[^/.]+$/, '')
    const extension = getFormatExtension(format)
    return `${baseName}-converted.${extension}`
  }
}
