import cron from 'node-cron';
import { runCron } from './techoparkJobsScraper';
import { runCron2 } from './infoparkJobsScraper';
import { runCron3 } from './cyberparkJobsScraper';
import { mailSender } from './alertSender';

cron.schedule('30 23 * * *', () => {
  console.log('RUNNING CRON JOB 1');
  runCron();
});

cron.schedule('40 23 * * *', () => {
  console.log('RUNNING CRON JOB 2');
  runCron2();
});

cron.schedule('50 23 * * *', () => {
  console.log('RUNNING CRON JOB 3');
  runCron3();
});

cron.schedule('00 22 * * *', () => {
  console.log('RUNNING CRON JOB 4');
  mailSender();
});
