import axios from 'axios';

export const GAS_WEB_APP_URL = import.meta.env.VITE_GAS_WEB_APP_URL ?? '';

export const isGasConfigured = (): boolean => Boolean(GAS_WEB_APP_URL);

export const gasClient = axios.create({
  headers: { 'Content-Type': 'text/plain' },
});
