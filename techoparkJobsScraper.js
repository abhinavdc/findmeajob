const rp = require('request-promise');
const $ = require('cheerio');
const baseUrl = 'https://www.technopark.org/';
const allJobEnteries = [];
const numberOfEnteriesToFetch = 5;

rp({ url: baseUrl + 'job-search', "rejectUnauthorized": false })
    .then(async (html) => {
        const jobList = parseJobListPage(html);

        await fetchAndParseJobDetailPage(jobList);

        for (i = 0; i < numberOfEnteriesToFetch; i++) {
            const entry = {
                jobTitle: jobList.jobTitles[i],
                companyName: jobList.companyNames[i],
                closingDate: jobList.closingDates[i],
                jobUrl: jobList.jobUrls[i],
                companyUrl: jobList.companyUrls[i],
                jobDescription: jobList.jobDescriptions[i]
            }
            allJobEnteries.push(entry);
        }
        console.log(allJobEnteries);
    })
    .catch(function (err) {
        //handle error
        console.log(err)
    });


async function fetchAndParseJobDetailPage(jobList) {
    await asyncForEach(jobList.jobUrls.slice(0, numberOfEnteriesToFetch), async (url, i) => {
        // Fetch Job details
        const jobDetailPageHtml = await rp({ url: baseUrl + url, "rejectUnauthorized": false });

        const jobDescription = parseJobDetailPage(jobDetailPageHtml);
        jobList.jobDescriptions.push(jobDescription);
        // Show in console the progress of parsing
        console.log(`Scraping ${i + 1}/${numberOfEnteriesToFetch}`);
    });
}

function parseJobListPage(html) {
    const jobList = {
        jobTitles: [],
        companyNames: [],
        closingDates: [],
        jobUrls: [],
        companyUrls: [],
        jobDescriptions: []
    };

    // Parse Job Title, Job Url
    $('.jobTitleLink', html).each((i, elem) => {
        jobList.jobTitles.push($(elem).text());
        jobList.jobUrls.push($(elem).attr('href'));
    });
    // Parse company name, company url
    $('.companyList > td:nth-child(2) > a', html).each((i, elem) => {
        jobList.companyNames.push($(elem).text());
        // remove '/' at the begining of the url
        jobList.companyUrls.push($(elem).attr('href').substring(1));
    });
    // Parse closing date
    $('.companyList > td:nth-child(3)', html).each((i, elem) => {
        jobList.closingDates.push(convertDate($(elem).text()));
    });
    
    return jobList;
}

function parseJobDetailPage(jobDetailPageHtml) {
    const jobDescription = {
        postingDate: $('.arrived.det-text.group-effect1 > div:nth-child(3) > p:nth-child(2)', jobDetailPageHtml).text(),
        contactEmail: $('.arrived.det-text.group-effect1 > div:nth-child(5) > a', jobDetailPageHtml).text(),
        briefDescription: $('.arrived.det-text.group-effect1 > div:nth-child(7) > p:nth-child(2)', jobDetailPageHtml).text(),
        preferredSkills: $('.arrived.det-text.group-effect1 > div:nth-child(9) > p:nth-child(3)', jobDetailPageHtml).text()
    };
    return jobDescription;
}

function convertDate(dateString) {
    var dateParts = dateString.split("/");

    // month is 0-based, that's why we need dataParts[1] - 1
    var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);

    return dateObject
}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

