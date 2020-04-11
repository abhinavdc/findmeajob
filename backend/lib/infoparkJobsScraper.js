import { orderBy } from 'lodash';
import db from './db';
import axios from 'axios';
import https from 'https';
import cheerio from 'cheerio';

const baseUrl = 'http://infopark.in/';

const axiosService = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
});

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
      jobDescriptions: []
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

      // const jobList = parseJobListPage(data);

      // await fetchAndParseJobDetailPage(jobList);

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
          location: 'Kochi'
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
    dec: 11
  };
  var p = s.split(' ');
  return new Date(p[2], months[p[1].toLowerCase()], p[0]);
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
    jobDescriptions: []
  };
  const $ = cheerio.load(html);
  // Parse Job Title, Job Url
  $('.odd, .even', html).each((i, elem) => {
    console.log(elem.text());
    // jobList.jobTitles.push($(elem).text());
    // jobList.jobUrls.push($(elem).attr('href'));
    // // Get vacancy_id from url
    // jobList.jobIds.push(
    //   +$(elem)
    //     .attr('href')
    //     .split('vacancy_id=')[1]
    // );
  });
  // Parse company name, company url
  // $('.companyList > td:nth-child(2) > a', html).each((i, elem) => {
  //   jobList.companyNames.push($(elem).text());
  //   // remove '/' at the begining of the url
  //   jobList.companyUrls.push(
  //     $(elem)
  //       .attr('href')
  //       .substring(1)
  //   );
  // });
  // Parse closing date
  // $('.companyList > td:nth-child(3)', html).each((i, elem) => {
  //   jobList.closingDates.push(convertDate($(elem).text()));
  // });

  // return jobList;
}

function parseJobDetailPage(jobDetailPageHtml) {
  const $ = cheerio.load(jobDetailPageHtml);
  const jobDescription = {
    htmlRaw: $('.col-sm-8', jobDetailPageHtml).html(),
    postingDate: $(
      '.arrived.det-text.group-effect1 > div:nth-child(3) > p:nth-child(2)',
      jobDetailPageHtml
    ).text(),
    contactEmail: $(
      '.arrived.det-text.group-effect1 > div:nth-child(5) > a',
      jobDetailPageHtml
    ).text(),
    briefDescriptionRaw: $(
      '.arrived.det-text.group-effect1 > div:nth-child(7) > :not(.head)',
      jobDetailPageHtml
    ).html(),
    briefDescription: $(
      '.arrived.det-text.group-effect1 > div:nth-child(7) > :not(.head)',
      jobDetailPageHtml
    )
      .filter(":not(:contains('Job Description:'))")
      .text()
      .replace(/\n\t/g, '')
      .split('•')
      .map(x => x.trim())
      .filter(x => x)
      .join(),
    preferredSkillsRaw: $(
      '.arrived.det-text.group-effect1 > div:nth-child(9) > :not(.head)',
      jobDetailPageHtml
    ).text(),
    preferredSkills: $(
      '.arrived.det-text.group-effect1 > div:nth-child(9) > :not(.head)',
      jobDetailPageHtml
    )
      .filter(":not(:contains('Experience:')):not(:contains('Qualification:'))")
      .text()
      .replace(/\n\t/g, '')
      .split('•')
      .map(x => x.trim())
      .filter(x => x)
      .join()
  };
  return jobDescription;
}

function parseWalkinJobDetailPage(jobDetailPageHtml) {
  const $ = cheerio.load(jobDetailPageHtml);
  const jobDescription = {
    postingDate: $(
      '.arrived.det-text.group-effect1 > div:nth-child(3) > p:nth-child(2)',
      jobDetailPageHtml
    ).text(),
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
    briefDescriptionRaw: $(
      '.arrived.det-text.group-effect1 > div:nth-child(9) > :not(.head)',
      jobDetailPageHtml
    ).html(),
    briefDescription: $(
      '.arrived.det-text.group-effect1 > div:nth-child(9) > :not(.head)',
      jobDetailPageHtml
    )
      .filter(":not(:contains('Job Description:'))")
      .text()
      .replace(/\n\t/g, '')
      .split('•')
      .map(x => x.trim())
      .filter(x => x)
      .join(),
    preferredSkillsRaw: $(
      '.arrived.det-text.group-effect1 > div:nth-child(11) > :not(.head)',
      jobDetailPageHtml
    ).html(),
    preferredSkills: $(
      '.arrived.det-text.group-effect1 > div:nth-child(11) > :not(.head)',
      jobDetailPageHtml
    )
      .filter(":not(:contains('Experience:')):not(:contains('Qualification:'))")
      .text()
      .replace(/\n\t/g, '')
      .split('•')
      .map(x => x.trim())
      .filter(x => x)
      .join()
  };
  return jobDescription;
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

export function runCron2() {
  getInfoparkJobs().then(allEntries => {
    const existingEntries = db
      .get('ipJobs')
      .orderBy(['jobId'], ['desc'])
      .value();

    const lastExistingEntry =
      existingEntries && existingEntries.length
        ? existingEntries[0].jobId
        : null;

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

    db.set('ipJobs', newEntries).write();
  });
}
