import cron from 'node-cron';
import { runCron } from './techoparkJobsScraper';

cron.schedule('* * * * *', () => {
  console.log('RUNNING CRON JOB');
  runCron();
});
