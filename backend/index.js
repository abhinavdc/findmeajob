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
  const index = +req.query.index || 0;

  const allJobs = [
    ...tpJobs.slice(index, index + 50),
    ...cpJobs.slice(index, index + 50),
    ...ipJobs.slice(index, index + 50),
  ];
  const sortedList = sortBy(allJobs, ['jobDescription.postingDate']).reverse();
  const slicedList = sortedList.slice(index, index + 50);

  // respond with json
  return res.json(slicedList);
});

app.get(`/search-jobs`, async (req, res, next) => {
  // get the scrape data
  const { tpJobs, cpJobs, ipJobs } = db.value();
  const index = +req.query.index || 0;
  const allJobs = [
    ...tpJobs.slice(index, index + 50),
    ...cpJobs.slice(index, index + 50),
    ...ipJobs.slice(index, index + 50),
  ];
  const query = req.query.query.toLowerCase();

  const filteredList = filter(allJobs, (row) => {
    return (
      row.jobTitle.toLowerCase().indexOf(query) > -1 ||
      row.companyName.toLowerCase().indexOf(query) > -1 ||
      row.jobDescription.briefDescription.toLowerCase().indexOf(query) > -1 ||
      row.location.toLowerCase().indexOf(query) > -1
    );
  });

  const sortedList = sortBy(filteredList, [
    'jobDescription.postingDate',
  ]).reverse();
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
