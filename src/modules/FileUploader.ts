import { i18n } from '../i18n';

export type FileSelectedCallback = (file: File) => void;

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp'];

export class FileUploader {
  private dropZone: HTMLElement;
  private fileInput: HTMLInputElement;
  private selectButton: HTMLButtonElement;
  private onFileSelected: FileSelectedCallback;

  constructor(
    dropZoneId: string,
    fileInputId: string,
    selectButtonId: string,
    callback: FileSelectedCallback
  ) {
    this.dropZone = document.getElementById(dropZoneId)!;
    this.fileInput = document.getElementById(fileInputId) as HTMLInputElement;
    this.selectButton = document.getElementById(selectButtonId) as HTMLButtonElement;
    this.onFileSelected = callback;

    this.setupDropZone();
    this.setupFileInput();
    this.setupSelectButton();
  }

  private setupDropZone(): void {
    this.dropZone.addEventListener('dragenter', (e) => {
      e.preventDefault();
      this.dropZone.classList.add('drop-zone--active');
    });

    this.dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
    });

    this.dropZone.addEventListener('dragleave', (e) => {
      e.preventDefault();
      if (!this.dropZone.contains(e.relatedTarget as Node)) {
        this.dropZone.classList.remove('drop-zone--active');
      }
    });

    this.dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      this.dropZone.classList.remove('drop-zone--active');

      const files = e.dataTransfer?.files;
      if (files && files.length > 0) {
        this.handleFile(files[0]);
      }
    });

    this.dropZone.addEventListener('click', (e) => {
      if (e.target !== this.selectButton) {
        this.fileInput.click();
      }
    });
  }

  private setupFileInput(): void {
    this.fileInput.addEventListener('change', () => {
      const files = this.fileInput.files;
      if (files && files.length > 0) {
        this.handleFile(files[0]);
      }
    });
  }

  private setupSelectButton(): void {
    this.selectButton.addEventListener('click', (e) => {
      e.stopPropagation();
      this.fileInput.click();
    });
  }

  private validateFile(file: File): boolean {
    return ACCEPTED_TYPES.includes(file.type);
  }

  private handleFile(file: File): void {
    if (!this.validateFile(file)) {
      alert(i18n.t('upload.errorUnsupported'));
      return;
    }
    this.onFileSelected(file);
  }

  public reset(): void {
    this.fileInput.value = '';
    this.dropZone.classList.remove('drop-zone--active');
  }
}
