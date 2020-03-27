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
                jobId: jobList.jobIds[i],
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

        let jobDescription = {};

        // Walking pages have different html structures, hence two different parsing logic is used
        if (!jobList.jobTitles[i].includes('Walk in')) {
            jobDescription = parseJobDetailPage(jobDetailPageHtml);
        } else {
            jobDescription = parseWalkinJobDetailPage(jobDetailPageHtml);
        }
        jobList.jobDescriptions.push(jobDescription);
        // Show in console the progress of parsing
        console.log(`Scraping ${i + 1}/${numberOfEnteriesToFetch}`);
    });
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

    // Parse Job Title, Job Url
    $('.jobTitleLink', html).each((i, elem) => {
        jobList.jobTitles.push($(elem).text());
        jobList.jobUrls.push($(elem).attr('href'));
        // Get vacancy_id from url
        jobList.jobIds.push(+$(elem).attr('href').split('vacancy_id=')[1])
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
        htmlRaw: $('.col-sm-8', jobDetailPageHtml).html(),
        postingDate: $('.arrived.det-text.group-effect1 > div:nth-child(3) > p:nth-child(2)', jobDetailPageHtml).text(),
        contactEmail: $('.arrived.det-text.group-effect1 > div:nth-child(5) > a', jobDetailPageHtml).text(),
        briefDescriptionRaw: $('.arrived.det-text.group-effect1 > div:nth-child(7) > :not(.head)', jobDetailPageHtml).html(),
        briefDescription: $('.arrived.det-text.group-effect1 > div:nth-child(7) > :not(.head)', jobDetailPageHtml)
            .filter(':not(:contains(\'Job Description:\'))')
            .text()
            .replace(/\n\t/g, '')
            .split('•')
            .map((x) => x.trim())
            .filter((x) => x)
            .join(),
        preferredSkillsRaw: $('.arrived.det-text.group-effect1 > div:nth-child(9) > :not(.head)', jobDetailPageHtml).text(),
        preferredSkills: $('.arrived.det-text.group-effect1 > div:nth-child(9) > :not(.head)', jobDetailPageHtml)
            .filter(':not(:contains(\'Experience:\')):not(:contains(\'Qualification:\'))')
            .text()
            .replace(/\n\t/g, '')
            .split('•')
            .map((x) => x.trim())
            .filter((x) => x)
            .join()
    };
    return jobDescription;
}

function parseWalkinJobDetailPage(jobDetailPageHtml) {
    const jobDescription = {
        postingDate: $('.arrived.det-text.group-effect1 > div:nth-child(3) > p:nth-child(2)', jobDetailPageHtml).text(),
        walkinStartDate: $('.arrived.det-text.group-effect1 > div:nth-child(4) > p:nth-child(2)', jobDetailPageHtml).text(),
        walkinClosingDate: $('.arrived.det-text.group-effect1 > div:nth-child(5) > p:nth-child(2)', jobDetailPageHtml).text(),
        walkinTime: $('.arrived.det-text.group-effect1 > div:nth-child(6) > p:nth-child(2)', jobDetailPageHtml).text(),
        contactEmail: $('.arrived.det-text.group-effect1 > div:nth-child(7) > a', jobDetailPageHtml).text(),
        briefDescriptionRaw: $('.arrived.det-text.group-effect1 > div:nth-child(9) > :not(.head)', jobDetailPageHtml).html(),
        briefDescription: $('.arrived.det-text.group-effect1 > div:nth-child(9) > :not(.head)', jobDetailPageHtml)
            .filter(':not(:contains(\'Job Description:\'))')
            .text()
            .replace(/\n\t/g, '')
            .split('•')
            .map((x) => x.trim())
            .filter((x) => x)
            .join(),
        preferredSkillsRaw: $('.arrived.det-text.group-effect1 > div:nth-child(11) > :not(.head)', jobDetailPageHtml).html(),
        preferredSkills: $('.arrived.det-text.group-effect1 > div:nth-child(11) > :not(.head)', jobDetailPageHtml)
            .filter(':not(:contains(\'Experience:\')):not(:contains(\'Qualification:\'))')
            .text()
            .replace(/\n\t/g, '')
            .split('•')
            .map((x) => x.trim())
            .filter((x) => x)
            .join()
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

