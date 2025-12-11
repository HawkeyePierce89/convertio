import './styles/main.css';
import { App } from './app';
import { i18n } from './i18n';
import { registerSW } from 'virtual:pwa-register';

// Initialize i18n first
i18n.init();

const app = new App();
app.init();

// Register service worker with update notification
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm(i18n.t('pwa.updateAvailable'))) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    showOfflineReadyToast();
  },
});

function showOfflineReadyToast() {
  const toast = document.createElement('div');
  toast.className = 'pwa-toast';
  toast.textContent = i18n.t('pwa.offlineReady');
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}
