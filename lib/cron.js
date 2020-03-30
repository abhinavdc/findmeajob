import cron from 'node-cron';
import { runCron } from './techoparkJobsScraper';

cron.schedule('1 * * * *', () => {
  console.log('RUNNING CRON JOB');
  runCron();
});
