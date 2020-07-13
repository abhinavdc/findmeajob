import { orderBy } from 'lodash';
import axios from 'axios';
import https from 'https';
import cheerio from 'cheerio';
const MongoClient = require('mongodb').MongoClient;

const connectionString =
  'mongodb+srv://abhinav:zqR143nfUQfPJzp5@cluster0-cygaf.mongodb.net/test?retryWrites=true&w=majority';

const baseUrl = 'http://www.cyberparkkerala.org/';

const axiosService = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

export async function getCyberparkJobs() {
  const allJobEnteries = [];
  try {
    const html = await getHTML(baseUrl + 'jm-ajax/get_listings/');

    if (html) {
      const jobList = parseJobListPage(html);

      // await fetchAndParseJobDetailPage(jobList);

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
          parkId: 3,
          location: 'Kozhikode',
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

// async function fetchAndParseJobDetailPage(jobList) {
//   await asyncForEach(jobList.jobUrls, async (url, i) => {
//     // Fetch Job details
//     const jobDetailPageHtml = await getHTML(baseUrl + url);

//     let jobDescription = {};

//     // Walking pages have different html structures, hence two different parsing logic is used
//     if (!jobList.jobTitles[i].includes('Walk in')) {
//       jobDescription = parseJobDetailPage(jobDetailPageHtml);
//     } else {
//       jobDescription = parseWalkinJobDetailPage(jobDetailPageHtml);
//     }
//     jobList.jobDescriptions.push(jobDescription);
//     // Show in console the progress of parsing
//     console.log(`Scraping ${i + 1}/${jobList.jobUrls.length}`);
//   });
// }

async function getHTML(url) {
  const { data: html } = await axiosService.get(url);
  return html.html;
}

function parseJobListPage(html) {
  const jobList = {
    jobIds: [],
    jobTitles: [],
    companyNames: [],
    closingDates: [],
    jobUrls: [],
    companyUrls: [],
    companyLogoUrls: [],
    jobDescriptions: [],
  };
  const $ = cheerio.load(html);

  $('.type-job_listing', html).each((i, elem) => {
    jobList.jobUrls.push($('a', elem).attr('href'));
    jobList.jobTitles.push($('.position > h3', elem).text());
    jobList.jobIds.push(+$(elem).attr('class').split(' ')[0].split('post-')[1]);
    jobList.companyNames.push($('.position > .company > strong', elem).text());
    jobList.companyLogoUrls.push($('a > img', elem).attr('src'));
    jobList.jobDescriptions.push({
      postingDate: new Date(
        $('a > .meta > .date > time', elem).attr('datetime')
      ),
      briefDescription: '',
    });
  });

  return jobList;
}

// function parseJobDetailPage(jobDetailPageHtml) {
//   const $ = cheerio.load(jobDetailPageHtml);
//   const jobDescription = {
//     htmlRaw: $('.col-sm-8', jobDetailPageHtml).html(),
//     postingDate: $(
//       '.arrived.det-text.group-effect1 > div:nth-child(3) > p:nth-child(2)',
//       jobDetailPageHtml
//     ).text(),
//     contactEmail: $(
//       '.arrived.det-text.group-effect1 > div:nth-child(5) > a',
//       jobDetailPageHtml
//     ).text(),
//     briefDescriptionRaw: $(
//       '.arrived.det-text.group-effect1 > div:nth-child(7) > :not(.head)',
//       jobDetailPageHtml
//     ).html(),
//     briefDescription: $(
//       '.arrived.det-text.group-effect1 > div:nth-child(7) > :not(.head)',
//       jobDetailPageHtml
//     )
//       .filter(":not(:contains('Job Description:'))")
//       .text()
//       .replace(/\n\t/g, '')
//       .split('•')
//       .map((x) => x.trim())
//       .filter((x) => x)
//       .join(),
//     preferredSkillsRaw: $(
//       '.arrived.det-text.group-effect1 > div:nth-child(9) > :not(.head)',
//       jobDetailPageHtml
//     ).text(),
//     preferredSkills: $(
//       '.arrived.det-text.group-effect1 > div:nth-child(9) > :not(.head)',
//       jobDetailPageHtml
//     )
//       .filter(":not(:contains('Experience:')):not(:contains('Qualification:'))")
//       .text()
//       .replace(/\n\t/g, '')
//       .split('•')
//       .map((x) => x.trim())
//       .filter((x) => x)
//       .join(),
//   };
//   return jobDescription;
// }

// function parseWalkinJobDetailPage(jobDetailPageHtml) {
//   const $ = cheerio.load(jobDetailPageHtml);
//   const jobDescription = {
//     postingDate: $(
//       '.arrived.det-text.group-effect1 > div:nth-child(3) > p:nth-child(2)',
//       jobDetailPageHtml
//     ).text(),
//     walkinStartDate: $(
//       '.arrived.det-text.group-effect1 > div:nth-child(4) > p:nth-child(2)',
//       jobDetailPageHtml
//     ).text(),
//     walkinClosingDate: $(
//       '.arrived.det-text.group-effect1 > div:nth-child(5) > p:nth-child(2)',
//       jobDetailPageHtml
//     ).text(),
//     walkinTime: $(
//       '.arrived.det-text.group-effect1 > div:nth-child(6) > p:nth-child(2)',
//       jobDetailPageHtml
//     ).text(),
//     contactEmail: $(
//       '.arrived.det-text.group-effect1 > div:nth-child(7) > a',
//       jobDetailPageHtml
//     ).text(),
//     briefDescriptionRaw: $(
//       '.arrived.det-text.group-effect1 > div:nth-child(9) > :not(.head)',
//       jobDetailPageHtml
//     ).html(),
//     briefDescription: $(
//       '.arrived.det-text.group-effect1 > div:nth-child(9) > :not(.head)',
//       jobDetailPageHtml
//     )
//       .filter(":not(:contains('Job Description:'))")
//       .text()
//       .replace(/\n\t/g, '')
//       .split('•')
//       .map((x) => x.trim())
//       .filter((x) => x)
//       .join(),
//     preferredSkillsRaw: $(
//       '.arrived.det-text.group-effect1 > div:nth-child(11) > :not(.head)',
//       jobDetailPageHtml
//     ).html(),
//     preferredSkills: $(
//       '.arrived.det-text.group-effect1 > div:nth-child(11) > :not(.head)',
//       jobDetailPageHtml
//     )
//       .filter(":not(:contains('Experience:')):not(:contains('Qualification:'))")
//       .text()
//       .replace(/\n\t/g, '')
//       .split('•')
//       .map((x) => x.trim())
//       .filter((x) => x)
//       .join(),
//   };
//   return jobDescription;
// }

// async function asyncForEach(array, callback) {
//   for (let index = 0; index < array.length; index++) {
//     await callback(array[index], index, array);
//   }
// }

export function runCron3() {
  MongoClient.connect(
    connectionString,
    {
      useUnifiedTopology: true,
    },
    (err, client) => {
      if (err) return console.error(err);
      console.log('CP Cron connected to Database');
      const db = client.db('jobs-db');
      const jobsCollection = db.collection('jobs');

      getCyberparkJobs().then((fetchedEntries) => {
        jobsCollection
          .find({ parkId: 3 })
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
