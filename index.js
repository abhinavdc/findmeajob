import { runCron } from './techoparkJobsScraper';
import express from 'express';
import db from './db';

const app = express();

runCron().then(allEntries => {
  const existingEntries = db
    .get('tpJobs')
    .orderBy(['jobId'], ['desc'])
    .value();

  const lastExistingEntry =
    existingEntries && existingEntries.length ? existingEntries[0].jobId : null;

  console.log('last entry id', lastExistingEntry);

  console.log(
    'existing entry',
    existingEntries.map(x => x.jobId)
  );

  console.log(
    'allEntries',
    allEntries.map(x => x.jobId)
  );

  const newEntries = lastExistingEntry
    ? allEntries.filter(x => x.jobId > lastExistingEntry)
    : allEntries;

  console.log(
    'new entries',
    newEntries.map(x => x.jobId)
  );

  newEntries.push(...existingEntries);

  db.set('tpJobs', newEntries).write();
});

app.listen(2093, () => {
  console.log(`Example App running on port http://localhost:2093`);
});
