import cron from 'node-cron';
import { runCron } from './techoparkJobsScraper';
import { runCron2 } from './infoparkJobsScraper';
import { runCron3 } from './cyberparkJobsScraper';

cron.schedule('0 23 * * *', () => {
  console.log('RUNNING CRON JOB');
  runCron();
  runCron2();
  runCron3();
});
