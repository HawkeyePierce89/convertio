export type ImageFormat = 'image/jpeg' | 'image/png' | 'image/webp';

export interface LoadedImage {
  file: File;
  originalWidth: number;
  originalHeight: number;
  dataUrl: string;
  element: HTMLImageElement;
}

export interface ConversionSettings {
  format: ImageFormat;
  width: number;
  height: number;
  quality: number;
  maintainAspectRatio: boolean;
}

export interface ConversionResult {
  blob: Blob;
  dataUrl: string;
  width: number;
  height: number;
  format: ImageFormat;
  size: number;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function getFormatExtension(format: ImageFormat): string {
  const extensions: Record<ImageFormat, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
  };
  return extensions[format];
}
