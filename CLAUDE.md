# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
npm run dev           # Start Vite dev server
npm run build         # TypeScript check + Vite production build
npm run preview       # Preview production build locally
npm run test          # Run tests in watch mode
npm run test:run      # Run tests once
npm run test:e2e      # Run e2e tests
npm run lint          # ESLint + Prettier check
npm run lint:fix      # Fix lint issues
npm run check         # TypeScript + lint check
npm run check:fix     # Fix all auto-fixable issues
```

## Architecture

Browser-based image converter PWA built with vanilla TypeScript and Vite. All image processing happens client-side using Canvas API—no server uploads.

### Module Structure (src/modules/)

- **App** (`app.ts`) - Main orchestrator that coordinates all modules and manages application state
- **FileUploader** - Drag-and-drop and file input handling with validation
- **ImageConverter** - Canvas-based image conversion (resize, format change, quality adjustment)
- **ImagePreview** - Original/result image display with metadata
- **ConversionSettings** - UI controls for format, dimensions, quality
- **FileDownloader** - Blob download with proper filename/extension

### Data Flow

1. FileUploader validates and emits selected file
2. App loads image into `LoadedImage` struct (includes HTMLImageElement for Canvas)
3. ConversionSettings provides `ConversionSettings` object
4. ImageConverter uses Canvas API to resize/convert, returns `ConversionResult` with Blob
5. FileDownloader triggers browser download from Blob

### Types (src/types/index.ts)

- `ImageFormat`: supported MIME types (jpeg, png, webp)
- `LoadedImage`: original image data including dimensions and HTMLImageElement
- `ConversionSettings`: conversion parameters
- `ConversionResult`: output blob, dimensions, format, size

### PWA

Uses vite-plugin-pwa with Workbox for offline support. Service worker auto-updates with user prompt.

### i18n (src/i18n/)

Multi-language support with 5 languages: English, Russian, German, Spanish, Chinese.

- **Translation files**: `src/i18n/translations/{en,ru,de,es,zh}.ts`
- **Types**: `src/i18n/types.ts` defines `Language`, `TranslationKey`, `Translations`
- **Usage in HTML**: `data-i18n="key"` for text, `data-i18n-placeholder` for inputs
- **Usage in code**: `i18n.t('key')` returns translated string
- **Language detection**: Auto-detects from browser, persists choice to localStorage
