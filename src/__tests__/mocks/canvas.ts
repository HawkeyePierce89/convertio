import { vi } from 'vitest'

export interface MockCanvasContext {
  fillStyle: string
  fillRect: ReturnType<typeof vi.fn>
  clearRect: ReturnType<typeof vi.fn>
  drawImage: ReturnType<typeof vi.fn>
}

export interface MockCanvas {
  width: number
  height: number
  getContext: ReturnType<typeof vi.fn>
  toBlob: ReturnType<typeof vi.fn>
  toDataURL: ReturnType<typeof vi.fn>
}

export function createMockCanvas(): { canvas: MockCanvas; ctx: MockCanvasContext } {
  const ctx: MockCanvasContext = {
    fillStyle: '',
    fillRect: vi.fn(),
    clearRect: vi.fn(),
    drawImage: vi.fn()
  }

  const canvas: MockCanvas = {
    width: 0,
    height: 0,
    getContext: vi.fn(() => ctx),
    toBlob: vi.fn((callback: BlobCallback, type?: string) => {
      const mockBlob = new Blob(['mock-image-data'], { type: type || 'image/png' })
      callback(mockBlob)
    }),
    toDataURL: vi.fn((type?: string) => {
      return `data:${type || 'image/png'};base64,mock-data-url`
    })
  }

  return { canvas, ctx }
}

export function createMockImage(width: number = 100, height: number = 100): HTMLImageElement {
  return {
    naturalWidth: width,
    naturalHeight: height,
    width,
    height,
    src: '',
    onload: null,
    onerror: null
  } as unknown as HTMLImageElement
}
