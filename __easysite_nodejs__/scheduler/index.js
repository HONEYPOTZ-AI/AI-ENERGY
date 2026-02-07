import { 
  startDailyBlogScheduler, 
  stopDailyBlogScheduler, 
  getSchedulerStatus,
  triggerManually 
} from './dailyBlogScheduler.js';

/**
 * Initialize and start all scheduled jobs
 * This function should be called when the backend starts
 */
export function startScheduler() {
  console.log('[Scheduler] Initializing all scheduled jobs...');
  
  try {
    // Start the daily blog generation scheduler
    startDailyBlogScheduler();
    
    console.log('[Scheduler] ✓ All schedulers initialized successfully');
    return { success: true, message: 'Schedulers started' };
  } catch (error) {
    console.error('[Scheduler] ✗ Failed to initialize schedulers:', error.message);
    console.error('[Scheduler] Stack trace:', error.stack);
    return { success: false, message: error.message };
  }
}

/**
 * Stop all scheduled jobs
 */
export function stopScheduler() {
  console.log('[Scheduler] Stopping all scheduled jobs...');
  
  try {
    stopDailyBlogScheduler();
    
    console.log('[Scheduler] ✓ All schedulers stopped successfully');
    return { success: true, message: 'Schedulers stopped' };
  } catch (error) {
    console.error('[Scheduler] ✗ Failed to stop schedulers:', error.message);
    return { success: false, message: error.message };
  }
}

/**
 * Get status of all schedulers
 * @returns {object} Status information for all schedulers
 */
export function getSchedulerInfo() {
  return {
    dailyBlogScheduler: getSchedulerStatus()
  };
}

/**
 * Manually trigger the daily blog generation
 */
export async function triggerDailyBlogGeneration() {
  await triggerManually();
}
