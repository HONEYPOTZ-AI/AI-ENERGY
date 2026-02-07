import schedule from "npm:node-schedule@2.1.1";
import { generateAIBlogPosts } from '../blog/generateAIBlogPosts.js';

// Configuration from environment variables
const SCHEDULE_TIME = Deno.env.get('BLOG_SCHEDULE_TIME') || '0 3 * * *'; // Default: 3:00 AM daily
const ARTICLES_PER_DAY = parseInt(Deno.env.get('BLOG_ARTICLES_PER_DAY') || '5', 10);
const AI_PROVIDER = Deno.env.get('AI_PROVIDER') || 'openai';
const BLOG_AUTHOR = Deno.env.get('BLOG_AUTHOR') || 'AI Energy Optimizer Team';

let scheduledJob = null;

/**
 * The main job function that generates blog articles
 */
async function executeDailyBlogGeneration() {
  const startTime = new Date().toISOString();
  console.log(`[Daily Blog Scheduler] Job started at ${startTime}`);
  console.log(`[Daily Blog Scheduler] Generating ${ARTICLES_PER_DAY} articles using ${AI_PROVIDER}`);

  try {
    // Get API key from environment
    const apiKey = AI_PROVIDER === 'openai' 
      ? Deno.env.get('OPENAI_API_KEY')
      : Deno.env.get('ANTHROPIC_API_KEY');

    if (!apiKey) {
      throw new Error(`API key not found for provider: ${AI_PROVIDER}. Please set ${AI_PROVIDER === 'openai' ? 'OPENAI_API_KEY' : 'ANTHROPIC_API_KEY'} in environment variables.`);
    }

    // Call the AI blog generation function
    const result = await generateAIBlogPosts(
      apiKey,
      AI_PROVIDER,
      [], // Use default topics
      BLOG_AUTHOR
    );

    if (result.success) {
      const endTime = new Date().toISOString();
      console.log(`[Daily Blog Scheduler] ✓ Job completed successfully at ${endTime}`);
      console.log(`[Daily Blog Scheduler] Generated ${result.articles.length} articles`);
      console.log(`[Daily Blog Scheduler] Article IDs: ${result.articleIds.join(', ')}`);
      console.log(`[Daily Blog Scheduler] Message: ${result.message}`);
    } else {
      throw new Error(`Generation failed: ${result.message}`);
    }
  } catch (error) {
    const errorTime = new Date().toISOString();
    console.error(`[Daily Blog Scheduler] ✗ Job failed at ${errorTime}`);
    console.error(`[Daily Blog Scheduler] Error: ${error.message}`);
    console.error(`[Daily Blog Scheduler] Stack trace:`, error.stack);
    
    // Don't throw - just log the error to prevent scheduler from crashing
    // The scheduler will continue and try again on the next scheduled time
  }
}

/**
 * Start the daily blog generation scheduler
 * @returns {object} The scheduled job instance
 */
export function startDailyBlogScheduler() {
  if (scheduledJob) {
    console.log('[Daily Blog Scheduler] Scheduler is already running');
    return scheduledJob;
  }

  console.log('[Daily Blog Scheduler] Initializing daily blog generation scheduler');
  console.log(`[Daily Blog Scheduler] Schedule: ${SCHEDULE_TIME} (cron format)`);
  console.log(`[Daily Blog Scheduler] Articles per day: ${ARTICLES_PER_DAY}`);
  console.log(`[Daily Blog Scheduler] AI Provider: ${AI_PROVIDER}`);
  console.log(`[Daily Blog Scheduler] Author: ${BLOG_AUTHOR}`);

  // Schedule the job using cron syntax
  // Format: second(optional) minute hour day month dayOfWeek
  // Default '0 3 * * *' means: At 3:00 AM every day
  scheduledJob = schedule.scheduleJob(SCHEDULE_TIME, async () => {
    await executeDailyBlogGeneration();
  });

  if (scheduledJob) {
    const nextRun = scheduledJob.nextInvocation();
    console.log(`[Daily Blog Scheduler] ✓ Scheduler started successfully`);
    console.log(`[Daily Blog Scheduler] Next run scheduled for: ${nextRun?.toISOString()}`);
  } else {
    console.error('[Daily Blog Scheduler] ✗ Failed to start scheduler - invalid cron expression');
  }

  return scheduledJob;
}

/**
 * Stop the daily blog generation scheduler
 */
export function stopDailyBlogScheduler() {
  if (scheduledJob) {
    scheduledJob.cancel();
    scheduledJob = null;
    console.log('[Daily Blog Scheduler] Scheduler stopped');
  }
}

/**
 * Get scheduler status and next run time
 * @returns {object} Scheduler status information
 */
export function getSchedulerStatus() {
  if (!scheduledJob) {
    return {
      running: false,
      schedule: SCHEDULE_TIME,
      articlesPerDay: ARTICLES_PER_DAY,
      provider: AI_PROVIDER,
      nextRun: null
    };
  }

  const nextRun = scheduledJob.nextInvocation();
  return {
    running: true,
    schedule: SCHEDULE_TIME,
    articlesPerDay: ARTICLES_PER_DAY,
    provider: AI_PROVIDER,
    nextRun: nextRun ? nextRun.toISOString() : null
  };
}

/**
 * Manually trigger the blog generation job (for testing)
 */
export async function triggerManually() {
  console.log('[Daily Blog Scheduler] Manual trigger requested');
  await executeDailyBlogGeneration();
}
