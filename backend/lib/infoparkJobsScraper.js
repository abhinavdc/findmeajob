import { orderBy } from 'lodash';
import axios from 'axios';
import https from 'https';
import cheerio from 'cheerio';
const MongoClient = require('mongodb').MongoClient;

const connectionString =
  'mongodb+srv://abhinav:zqR143nfUQfPJzp5@cluster0-cygaf.mongodb.net/test?retryWrites=true&w=majority';

const baseUrl = 'http://infopark.in/';

const axiosService = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

const jobDescriptionSelector =
  'body > table > tbody > tr:nth-child(3) > td > table:nth-child(1) > tbody > tr:nth-child(1) > td:nth-child(2) > table > tbody > tr > td > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(2)';

export async function getInfoparkJobs() {
  const allJobEnteries = [];
  try {
    const jobList = {
      jobIds: [],
      jobTitles: [],
      companyNames: [],
      closingDates: [],
      jobUrls: [],
      companyUrls: [],
      companyIds: [],
      jobDescriptions: [],
    };

    const data = await getHTML(baseUrl + 'response.php');

    if (data) {
      const totalRecords = data.iTotalDisplayRecords;
      let i = 0;
      while (i < totalRecords) {
        // Fetch
        let title = data.aaData[i].jobtitle;
        let company = data.aaData[i].company;
        const closingDate = parseDate(data.aaData[i].closingdate);

        // Format
        let jobTitle = title
          .substring(title.indexOf('>') + 1, title.indexOf('</'))
          .replace('<b>', '')
          .replace('<i>', '');

        let jobUrl = title.substring(
          title.indexOf("href='") + 6,
          title.indexOf("'>")
        );

        let jobId = +title.substring(
          title.indexOf('reid=') + 5,
          title.indexOf("'>")
        );

        let companyUrl = company.substring(
          company.indexOf("href='") + 6,
          company.indexOf("'>")
        );

        let companyName = company.substring(
          company.indexOf('>') + 1,
          company.indexOf('</')
        );

        let companyId = +company.substring(
          company.indexOf('cid=') + 4,
          company.indexOf("'>")
        );

        jobList.jobIds[i] = jobId;
        jobList.jobTitles[i] = jobTitle;
        jobList.jobUrls[i] = jobUrl;
        jobList.companyNames[i] = companyName;
        jobList.companyUrls[i] = companyUrl;
        jobList.companyIds[i] = companyId;
        jobList.closingDates[i] = closingDate;
        i++;
      }

      await fetchAndParseJobDetailPage(jobList);

      for (let i = 0; i < jobList.jobIds.length; i++) {
        const entry = {
          jobId: jobList.jobIds[i],
          jobTitle: jobList.jobTitles[i],
          companyName: jobList.companyNames[i],
          closingDate: jobList.closingDates[i],
          jobUrl: jobList.jobUrls[i],
          companyUrl: jobList.companyUrls[i],
          companyId: jobList.companyIds[i],
          jobDescription: jobList.jobDescriptions[i],
          parkId: 2,
          location: 'Kochi',
        };
        allJobEnteries.push(entry);
      }
      return orderBy(allJobEnteries, 'jobId', 'desc');
    } else {
      console.log('Fetch failed');
      return [];
    }
  } catch (err) {
    console.log(err);
    return [];
  }
}

async function fetchAndParseJobDetailPage(jobList) {
  await asyncForEach(jobList.jobUrls, async (url, i) => {
    // Fetch Job details
    const jobDetailPageHtml = await getHTML(baseUrl + url);

    let jobDescription = {};

    jobDescription = parseJobDetailPage(jobDetailPageHtml);
    jobList.jobDescriptions.push(jobDescription);
    // Show in console the progress of parsing
    console.log(`Scraping ${i + 1}/${jobList.jobUrls.length}`);
  });
}

function parseDate(s) {
  var months = {
    jan: 0,
    feb: 1,
    mar: 2,
    apr: 3,
    may: 4,
    jun: 5,
    jul: 6,
    aug: 7,
    sep: 8,
    oct: 9,
    nov: 10,
    dec: 11,
  };
  var p = s.split(' ');
  return new Date(p[2], months[p[1].toLowerCase()], p[0]);
}

async function getHTML(url) {
  const { data: html } = await axiosService.get(url);
  return html;
}

function parseJobDetailPage(jobDetailPageHtml) {
  const $ = cheerio.load(jobDetailPageHtml);
  const jobDescription = {
    postingDate: new Date(),
    contactEmail: $(
      jobDescriptionSelector + ' > tr:nth-child(3) > td > a',
      jobDetailPageHtml
    ).text(),
    briefDescription: $(
      jobDescriptionSelector + ' > tr:nth-child(2)',
      jobDetailPageHtml
    ).text(),
  };
  return jobDescription;
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

export function runCron2() {
  MongoClient.connect(
    connectionString,
    {
      useUnifiedTopology: true,
    },
    (err, client) => {
      if (err) return console.error(err);
      console.log('IP Cron connected to Database');
      const dbM = client.db('jobs-db');
      const jobsCollection = dbM.collection('jobs');

      getInfoparkJobs().then((fetchedEntries) => {
        jobsCollection
          .find({ parkId: 2 })
          .toArray()
          .then((data) => {
            const existingEntries = orderBy(data, ['jobId'], ['desc']);

            const lastExistingEntry =
              existingEntries && existingEntries.length
                ? existingEntries[0].jobId
                : null;

            console.log('last entry id', lastExistingEntry);

            console.log(
              'existing entry',
              existingEntries.map((x) => x.jobId)
            );

            console.log(
              'allEntries',
              fetchedEntries.map((x) => x.jobId)
            );

            const newEntries = lastExistingEntry
              ? fetchedEntries.filter((x) => x.jobId > lastExistingEntry)
              : fetchedEntries;

            console.log(
              'new entries',
              newEntries.map((x) => x.jobId)
            );

            if (newEntries && newEntries.length) {
              jobsCollection.insertMany(newEntries);
            }
          });
      });
    }
  );
}
