import express from 'express';
import db from './lib/db';
import './lib/cron';

const app = express();

app.get(`/all-jobs`, async (req, res, next) => {
  // get the scrape data
  const { tpJobs } = db.value();

  // respond with json
  res.json(tpJobs);
});

app.listen(2093, () => {
  console.log(`Example App running on port http://localhost:2093`);
});
