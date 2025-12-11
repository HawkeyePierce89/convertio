# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
npm run dev      # Start Vite dev server
npm run build    # TypeScript check + Vite production build
npm run preview  # Preview production build locally
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
