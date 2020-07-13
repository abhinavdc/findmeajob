import { orderBy } from 'lodash';
import axios from 'axios';
import https from 'https';
import cheerio from 'cheerio';
const MongoClient = require('mongodb').MongoClient;

const connectionString =
  'mongodb+srv://abhinav:zqR143nfUQfPJzp5@cluster0-cygaf.mongodb.net/test?retryWrites=true&w=majority';

const baseUrl = 'https://www.technopark.org/';

const axiosService = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

export async function getTechnoparkJobs() {
  const allJobEnteries = [];
  try {
    const html = await getHTML(baseUrl + 'job-search');

    if (html) {
      const jobList = parseJobListPage(html);

      await fetchAndParseJobDetailPage(jobList);

      for (let i = 0; i < jobList.jobIds.length; i++) {
        const entry = {
          jobId: jobList.jobIds[i],
          jobTitle: jobList.jobTitles[i],
          companyName: jobList.companyNames[i],
          closingDate: jobList.closingDates[i],
          jobUrl: jobList.jobUrls[i],
          companyUrl: jobList.companyUrls[i],
          companyLogoUrl: jobList.companyLogoUrls[i],
          jobDescription: jobList.jobDescriptions[i],
          parkId: 1,
          location: 'Trivandrum',
          scrapedDate: new Date().toISOString(),
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

    // Walking pages have different html structures, hence two different parsing logic is used
    if (!jobList.jobTitles[i].includes('Walk in')) {
      jobDescription = parseJobDetailPage(jobDetailPageHtml);
    } else {
      jobDescription = parseWalkinJobDetailPage(jobDetailPageHtml);
    }
    jobList.jobDescriptions.push(jobDescription.jobDescription);
    jobList.companyLogoUrls.push(jobDescription.companyLogoUrl);
    jobList.companyUrls.push(jobDescription.companyUrl);
    // Show in console the progress of parsing
    console.log(`Scraping ${i + 1}/${jobList.jobUrls.length}`);
  });
}

async function getHTML(url) {
  const { data: html } = await axiosService.get(url);
  return html;
}

function parseJobListPage(html) {
  const jobList = {
    jobIds: [],
    jobTitles: [],
    companyNames: [],
    closingDates: [],
    jobUrls: [],
    companyUrls: [],
    jobDescriptions: [],
    companyLogoUrls: [],
  };
  const $ = cheerio.load(html);
  // Parse Job Title, Job Url
  $('.jobTitleLink', html).each((i, elem) => {
    jobList.jobTitles.push($(elem).text());
    jobList.jobUrls.push($(elem).attr('href'));
    // Get vacancy_id from url
    jobList.jobIds.push(+$(elem).attr('href').split('vacancy_id=')[1]);
  });
  // Parse company name, company url
  $('.companyList > td:nth-child(2) > a', html).each((i, elem) => {
    jobList.companyNames.push($(elem).text());
  });
  // Parse closing date
  $('.companyList > td:nth-child(3)', html).each((i, elem) => {
    jobList.closingDates.push(convertDate($(elem).text()));
  });

  return jobList;
}

function parseJobDetailPage(jobDetailPageHtml) {
  const $ = cheerio.load(jobDetailPageHtml);
  const jobDescription = {
    postingDate: convertDate(
      $(
        '.arrived.det-text.group-effect1 > div:nth-child(3) > p:nth-child(2)',
        jobDetailPageHtml
      ).text()
    ),
    contactEmail: $(
      '.arrived.det-text.group-effect1 > div:nth-child(5) > a',
      jobDetailPageHtml
    ).text(),
    briefDescription: $(
      '.arrived.det-text.group-effect1 > div:nth-child(7) > :not(.head)',
      jobDetailPageHtml
    )
      .filter(":not(:contains('Job Description:'))")
      .text()
      .replace(/\n\t/g, '')
      .split('•')
      .map((x) => x.trim())
      .filter((x) => x)
      .join(),
    preferredSkills: $(
      '.arrived.det-text.group-effect1 > div:nth-child(9) > :not(.head)',
      jobDetailPageHtml
    )
      .filter(":not(:contains('Experience:')):not(:contains('Qualification:'))")
      .text()
      .replace(/\n\t/g, '')
      .split('•')
      .map((x) => x.trim())
      .filter((x) => x)
      .join(),
  };
  const companyLogoUrl = $('.owl-carousel > div > img').attr('src');
  const companyUrl = $('ul.list-sx > li:nth-child(3) > a').attr('href');
  return { jobDescription, companyLogoUrl, companyUrl };
}

function parseWalkinJobDetailPage(jobDetailPageHtml) {
  const $ = cheerio.load(jobDetailPageHtml);
  const jobDescription = {
    postingDate: convertDate(
      $(
        '.arrived.det-text.group-effect1 > div:nth-child(3) > p:nth-child(2)',
        jobDetailPageHtml
      ).text()
    ),
    walkinStartDate: $(
      '.arrived.det-text.group-effect1 > div:nth-child(4) > p:nth-child(2)',
      jobDetailPageHtml
    ).text(),
    walkinClosingDate: $(
      '.arrived.det-text.group-effect1 > div:nth-child(5) > p:nth-child(2)',
      jobDetailPageHtml
    ).text(),
    walkinTime: $(
      '.arrived.det-text.group-effect1 > div:nth-child(6) > p:nth-child(2)',
      jobDetailPageHtml
    ).text(),
    contactEmail: $(
      '.arrived.det-text.group-effect1 > div:nth-child(7) > a',
      jobDetailPageHtml
    ).text(),
    briefDescription: $(
      '.arrived.det-text.group-effect1 > div:nth-child(9) > :not(.head)',
      jobDetailPageHtml
    )
      .filter(":not(:contains('Job Description:'))")
      .text()
      .replace(/\n\t/g, '')
      .split('•')
      .map((x) => x.trim())
      .filter((x) => x)
      .join(),
    preferredSkills: $(
      '.arrived.det-text.group-effect1 > div:nth-child(11) > :not(.head)',
      jobDetailPageHtml
    )
      .filter(":not(:contains('Experience:')):not(:contains('Qualification:'))")
      .text()
      .replace(/\n\t/g, '')
      .split('•')
      .map((x) => x.trim())
      .filter((x) => x)
      .join(),
  };
  const companyLogoUrl = $('.owl-carousel > div > img').attr('src');
  const companyUrl = $('ul.list-sx > li:nth-child(3) > a').attr('href');
  return { jobDescription, companyLogoUrl, companyUrl };
}

function convertDate(dateString) {
  var dateParts = dateString.split('/');

  // month is 0-based, that's why we need dataParts[1] - 1
  var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);

  return dateObject;
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

export function runCron() {
  MongoClient.connect(
    connectionString,
    {
      useUnifiedTopology: true,
    },
    (err, client) => {
      if (err) return console.error(err);
      console.log('TP Cron connected to Database');
      const db = client.db('jobs-db');
      const jobsCollection = db.collection('jobs');

      getTechnoparkJobs().then((fetchedEntries) => {
        jobsCollection
          .find({ parkId: 1 })
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
