import express from 'express';
import cors from 'cors';
import { filter, sortBy } from 'lodash';
import db from './lib/db';
import './lib/cron';

const app = express();

app.use(cors());

app.get(`/all-jobs`, async (req, res, next) => {
  // get the scrape data
  const { tpJobs, cpJobs, ipJobs } = db.value();

  const allJobs = [...tpJobs, ...cpJobs, ...ipJobs];
  const index = +req.query.index || 0;
  const sortedList = sortBy(allJobs, ['row.jobDescription.postingDate']);
  const slicedList = sortedList.slice(index, index + 50);

  // respond with json
  return res.json(slicedList);
});

app.get(`/search-jobs`, async (req, res, next) => {
  // get the scrape data
  const { tpJobs, cpJobs, ipJobs } = db.value();
  const allJobs = [...tpJobs, ...cpJobs, ...ipJobs];
  const query = req.query.query.toLowerCase();

  const filteredList = filter(
    allJobs,
    (row) => row.jobTitle.toLowerCase().indexOf(query) > -1
  );
  const index = +req.query.index || 0;
  const sortedList = sortBy(filteredList, ['row.jobDescription.postingDate']);
  const slicedList = sortedList.slice(index, index + 50);

  return res.json(slicedList);
});

app.get('/subscribe', async (req, res, next) => {
  db.get('subscribers')
    .push({ email: req.query.email, query: req.query.query, verified: false })
    .write();
  return res.json({ success: true });
});

app.listen(2093, () => {
  console.log(`Example App running on port http://localhost:2093`);
});
