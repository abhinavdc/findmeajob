import express from 'express';
import cors from 'cors';
import { filter } from 'lodash';
import db from './lib/db';
import './lib/cron';

const app = express();

app.use(cors());

app.get(`/all-jobs`, async (req, res, next) => {
  // get the scrape data
  const { tpJobs } = db.value();

  // respond with json
  res.json(tpJobs);
});

app.get(`/search-jobs`, async (req, res, next) => {
  // get the scrape data
  const { tpJobs } = db.value();
  const query = req.query.query.toLowerCase();

  const filteredList = filter(
    tpJobs,
    (row) => row.jobTitle.toLowerCase().indexOf(query) > -1
  );
  return res.json(filteredList);
});

app.listen(2093, () => {
  console.log(`Example App running on port http://localhost:2093`);
});
