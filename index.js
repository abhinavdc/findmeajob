import express from 'express';
import cors from 'cors';
import { filter, sortBy } from 'lodash';
import bodyParser from 'body-parser';
import './lib/cron';
import path from 'path';

const MongoClient = require('mongodb').MongoClient;
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const app = express();
const connectionString =
  'mongodb+srv://abhinav:zqR143nfUQfPJzp5@cluster0-cygaf.mongodb.net/test?retryWrites=true&w=majority';

MongoClient.connect(
  connectionString,
  {
    useUnifiedTopology: true,
  },
  (err, client) => {
    if (err) return console.error(err);
    console.log('Connected to Database');
    const db = client.db('jobs-db');
    const jobsCollection = db.collection('jobs');
    const subscriberCollection = db.collection('subscribers');

    app.use(cors());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.get(`/all-jobs`, async (req, res, next) => {
      const index = +req.query.index || 0;

      // get the scrape data
      jobsCollection
        .find()
        .toArray()
        .then((allJobs) => {
          const sortedList = sortBy(allJobs, [
            'jobDescription.postingDate',
          ]).reverse();
          const slicedList = sortedList.slice(index, index + 50);

          // respond with json
          return res.json(slicedList);
        });
    });

    app.get(`/search-jobs`, async (req, res, next) => {
      const index = +req.query.index || 0;
      const query = req.query.query.toLowerCase();

      // get the scrape data
      jobsCollection
        .find()
        .toArray()
        .then((allJobs) => {
          let filteredList = [];
          try {
            filteredList = filter(allJobs, (row) => {
              return (
                row.jobTitle.toLowerCase().indexOf(query) > -1 ||
                row.companyName.toLowerCase().indexOf(query) > -1 ||
                row.jobDescription.briefDescription
                  .toLowerCase()
                  .indexOf(query) > -1 ||
                row.location.toLowerCase().indexOf(query) > -1
              );
            });
          } catch (err) {
            console.log('error filtering in search');
          }

          const sortedList = sortBy(filteredList, [
            'jobDescription.postingDate',
          ]).reverse();
          const slicedList = sortedList.slice(index, index + 50);

          return res.json(slicedList);
        });
    });

    app.get('/subscribe', async (req, res, next) => {
      subscriberCollection
        .insertOne({
          email: req.query.email,
          query: req.query.query,
          verified: false,
        })
        .then((x) => {
          const msg = {
            to: req.query.email,
            from: 'abhinavdinesh95@gmail.com',
            subject: 'Great jobs coming your way!',
            text: `All done! We will alert you when someone posts a job related to '${req.query.query}'`,
            html: `All done! We will alert you when someone posts a job related to <strong>${req.query.query}</strong>`,
          };

          sgMail
            .send(msg)
            .then(() => {
              console.log('Message sent');
            })
            .catch((error) => {
              console.log(error.response.body);
            });
          return res.json({ success: true });
        });
    });

    if (process.env.NODE_ENV === 'production') {
      app.use(express.static('client/out'));

      app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client/out', 'index.html'));
      });
    }

    const PORT = process.env.PORT || 2000;
    app.listen(PORT, () => {
      console.log(`Our app is running on port ${PORT}`);
    });
  }
);
