import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ImageConverter } from './ImageConverter'
import { ConversionSettings } from '../types'
import { createMockCanvas, createMockImage, MockCanvas, MockCanvasContext } from '../__tests__/mocks/canvas'

describe('ImageConverter', () => {
  let mockCanvas: MockCanvas
  let mockCtx: MockCanvasContext
  let originalCreateElement: typeof document.createElement

  beforeEach(() => {
    const mocks = createMockCanvas()
    mockCanvas = mocks.canvas
    mockCtx = mocks.ctx

    originalCreateElement = document.createElement.bind(document)
    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'canvas') {
        return mockCanvas as unknown as HTMLCanvasElement
      }
      return originalCreateElement(tagName)
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  const baseSettings: ConversionSettings = {
    format: 'image/png',
    width: 200,
    height: 150,
    quality: 0.8,
    maintainAspectRatio: true
  }

  describe('constructor', () => {
    it('should create a canvas element', () => {
      new ImageConverter()
      expect(document.createElement).toHaveBeenCalledWith('canvas')
    })

    it('should get 2d context from canvas', () => {
      new ImageConverter()
      expect(mockCanvas.getContext).toHaveBeenCalledWith('2d')
    })
  })

  describe('convert', () => {
    it('should set canvas dimensions from settings', async () => {
      const converter = new ImageConverter()
      const mockImage = createMockImage()

      await converter.convert(mockImage, baseSettings)

      expect(mockCanvas.width).toBe(200)
      expect(mockCanvas.height).toBe(150)
    })

    it('should draw image on canvas', async () => {
      const converter = new ImageConverter()
      const mockImage = createMockImage()

      await converter.convert(mockImage, baseSettings)

      expect(mockCtx.drawImage).toHaveBeenCalledWith(mockImage, 0, 0, 200, 150)
    })

    it('should return ConversionResult with correct properties', async () => {
      const converter = new ImageConverter()
      const mockImage = createMockImage()

      const result = await converter.convert(mockImage, baseSettings)

      expect(result).toHaveProperty('blob')
      expect(result).toHaveProperty('dataUrl')
      expect(result.width).toBe(200)
      expect(result.height).toBe(150)
      expect(result.format).toBe('image/png')
      expect(result.size).toBeGreaterThan(0)
    })
  })

  describe('JPEG format handling', () => {
    const jpegSettings: ConversionSettings = {
      ...baseSettings,
      format: 'image/jpeg'
    }

    it('should fill white background for JPEG', async () => {
      const converter = new ImageConverter()
      const mockImage = createMockImage()

      await converter.convert(mockImage, jpegSettings)

      expect(mockCtx.fillStyle).toBe('#ffffff')
      expect(mockCtx.fillRect).toHaveBeenCalledWith(0, 0, 200, 150)
    })

    it('should pass quality to toBlob for JPEG', async () => {
      const converter = new ImageConverter()
      const mockImage = createMockImage()

      await converter.convert(mockImage, jpegSettings)

      expect(mockCanvas.toBlob).toHaveBeenCalled()
      const toBlobCall = mockCanvas.toBlob.mock.calls[0]
      expect(toBlobCall[1]).toBe('image/jpeg')
      expect(toBlobCall[2]).toBe(0.8)
    })
  })

  describe('PNG format handling', () => {
    it('should clear canvas for PNG (preserving transparency)', async () => {
      const converter = new ImageConverter()
      const mockImage = createMockImage()

      await converter.convert(mockImage, baseSettings)

      expect(mockCtx.clearRect).toHaveBeenCalledWith(0, 0, 200, 150)
      expect(mockCtx.fillRect).not.toHaveBeenCalled()
    })

    it('should NOT pass quality to toBlob for PNG', async () => {
      const converter = new ImageConverter()
      const mockImage = createMockImage()

      await converter.convert(mockImage, baseSettings)

      const toBlobCall = mockCanvas.toBlob.mock.calls[0]
      expect(toBlobCall[1]).toBe('image/png')
      expect(toBlobCall[2]).toBeUndefined()
    })
  })

  describe('WebP format handling', () => {
    const webpSettings: ConversionSettings = {
      ...baseSettings,
      format: 'image/webp'
    }

    it('should clear canvas for WebP', async () => {
      const converter = new ImageConverter()
      const mockImage = createMockImage()

      await converter.convert(mockImage, webpSettings)

      expect(mockCtx.clearRect).toHaveBeenCalledWith(0, 0, 200, 150)
    })

    it('should pass quality to toBlob for WebP', async () => {
      const converter = new ImageConverter()
      const mockImage = createMockImage()

      await converter.convert(mockImage, webpSettings)

      const toBlobCall = mockCanvas.toBlob.mock.calls[0]
      expect(toBlobCall[1]).toBe('image/webp')
      expect(toBlobCall[2]).toBe(0.8)
    })
  })

  describe('resize operations', () => {
    it('should handle upscaling', async () => {
      const converter = new ImageConverter()
      const mockImage = createMockImage(100, 100)
      const settings = { ...baseSettings, width: 400, height: 400 }

      const result = await converter.convert(mockImage, settings)

      expect(result.width).toBe(400)
      expect(result.height).toBe(400)
      expect(mockCtx.drawImage).toHaveBeenCalledWith(mockImage, 0, 0, 400, 400)
    })

    it('should handle downscaling', async () => {
      const converter = new ImageConverter()
      const mockImage = createMockImage(1000, 800)
      const settings = { ...baseSettings, width: 100, height: 80 }

      const result = await converter.convert(mockImage, settings)

      expect(result.width).toBe(100)
      expect(result.height).toBe(80)
    })
  })

  describe('error handling', () => {
    it('should reject when toBlob returns null', async () => {
      mockCanvas.toBlob = vi.fn((callback: BlobCallback) => {
        callback(null)
      })

      const converter = new ImageConverter()
      const mockImage = createMockImage()

      await expect(converter.convert(mockImage, baseSettings))
        .rejects.toThrow('Failed to create blob')
    })
  })

  describe('quality parameter', () => {
    it('should handle quality = 1 (max)', async () => {
      const converter = new ImageConverter()
      const mockImage = createMockImage()
      const settings: ConversionSettings = {
        ...baseSettings,
        format: 'image/jpeg',
        quality: 1.0
      }

      await converter.convert(mockImage, settings)

      const toBlobCall = mockCanvas.toBlob.mock.calls[0]
      expect(toBlobCall[2]).toBe(1.0)
    })

    it('should handle quality = 0.1 (low)', async () => {
      const converter = new ImageConverter()
      const mockImage = createMockImage()
      const settings: ConversionSettings = {
        ...baseSettings,
        format: 'image/jpeg',
        quality: 0.1
      }

      await converter.convert(mockImage, settings)

      const toBlobCall = mockCanvas.toBlob.mock.calls[0]
      expect(toBlobCall[2]).toBe(0.1)
    })
  })
})
