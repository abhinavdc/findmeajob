import cron from 'node-cron';
import { runCron } from './techoparkJobsScraper';
import { runCron2 } from './infoparkJobsScraper';

cron.schedule('3 * * * *', () => {
  console.log('RUNNING CRON JOB');
  runCron();
  runCron2();
});
