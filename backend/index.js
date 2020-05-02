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

  // respond with json
  const allJobs = [
    ...tpJobs.slice(0, 20),
    ...cpJobs.slice(0, 20),
    ...ipJobs.slice(0, 20),
  ];

  const sortedList = sortBy(allJobs, ['row.jobDescription.postingDate']);
  return res.json(sortedList);
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

  const sortedList = sortBy(filteredList, [
    'row.jobDescription.postingDate',
  ]).slice(0, 20);
  return res.json(sortedList);
});

app.listen(2093, () => {
  console.log(`Example App running on port http://localhost:2093`);
});
