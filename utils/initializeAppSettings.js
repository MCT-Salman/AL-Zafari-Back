import { initializeDefaultSettings } from '../services/appSettings.service.js';
import logger from './logger.js';
/**
 * Initialize app settings with default values
 */
export const initializeAppSettings = async () => {
  try {
    logger.info('Initializing app settings...');
    await initializeDefaultSettings();
    logger.info('App settings initialized successfully');
  } catch (error) {
    logger.error('Error initializing app settings:', error);
    throw error;
  }
};
