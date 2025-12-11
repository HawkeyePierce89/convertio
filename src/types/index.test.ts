import { describe, it, expect } from 'vitest';
import { formatFileSize, getFormatExtension, ImageFormat } from './index';

describe('formatFileSize', () => {
  it('should format bytes correctly', () => {
    expect(formatFileSize(0)).toBe('0 B');
    expect(formatFileSize(500)).toBe('500 B');
    expect(formatFileSize(1023)).toBe('1023 B');
  });

  it('should format kilobytes correctly', () => {
    expect(formatFileSize(1024)).toBe('1.0 KB');
    expect(formatFileSize(1536)).toBe('1.5 KB');
    expect(formatFileSize(10240)).toBe('10.0 KB');
  });

  it('should format megabytes correctly', () => {
    expect(formatFileSize(1024 * 1024)).toBe('1.00 MB');
    expect(formatFileSize(1024 * 1024 * 2.5)).toBe('2.50 MB');
  });
});

describe('getFormatExtension', () => {
  it('should return jpg for image/jpeg', () => {
    expect(getFormatExtension('image/jpeg')).toBe('jpg');
  });

  it('should return png for image/png', () => {
    expect(getFormatExtension('image/png')).toBe('png');
  });

  it('should return webp for image/webp', () => {
    expect(getFormatExtension('image/webp')).toBe('webp');
  });

  it('should handle all ImageFormat values', () => {
    const formats: ImageFormat[] = ['image/jpeg', 'image/png', 'image/webp'];
    const expected = ['jpg', 'png', 'webp'];

    formats.forEach((format, index) => {
      expect(getFormatExtension(format)).toBe(expected[index]);
    });
  });
});
