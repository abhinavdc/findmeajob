import cron from 'node-cron';
import { runCron } from './techoparkJobsScraper';
import { runCron2 } from './infoparkJobsScraper';
import { runCron3 } from './cyberparkJobsScraper';
import { mailSender } from './alertSender';

cron.schedule('00 23 * * *', () => {
  console.log('RUNNING CRON JOB 1');
  runCron();
});

cron.schedule('05 23 * * *', () => {
  console.log('RUNNING CRON JOB 2');
  runCron2();
});

cron.schedule('10 23 * * *', () => {
  console.log('RUNNING CRON JOB 3');
  runCron3();
});

cron.schedule('15 23 * * *', () => {
  console.log('RUNNING CRON JOB 4');
  mailSender();
});
