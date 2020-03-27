const rp = require('request-promise');
const $ = require('cheerio');
const baseUrl = 'https://www.technopark.org/';
const allJobEnteries = [];
const numberOfEnteriesToFetch = 5;

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


rp({ url: baseUrl + 'job-search', "rejectUnauthorized": false })
    .then(async (html) => {
        const jobTitles = [];
        const companyNames = [];
        const closingDates = [];
        const jobUrls = [];
        const companyUrls = [];
        const jobDescriptions = [];

        // Parse Job Title, Job Url
        $('.jobTitleLink', html).each((i, elem) => {
            jobTitles.push($(elem).text());
            jobUrls.push($(elem).attr('href'));
        });

        // Parse company name, company url
        $('.companyList > td:nth-child(2) > a', html).each((i, elem) => {
            companyNames.push($(elem).text());
            // remove '/' at the begining of the url
            companyUrls.push($(elem).attr('href').substring(1));
        });

        // Parse closing date
        $('.companyList > td:nth-child(3)', html).each((i, elem) => {
            closingDates.push(convertDate($(elem).text()));
        });

        await asyncForEach(jobUrls.slice(0, numberOfEnteriesToFetch), async (url, i) => {
            const jobDescription = {
                postingDate: null,
                contactEmail: '',
                briefDescription: '',
                preferredSkills: ''
            };
            const jobDetailPageHtml = await rp({ url: baseUrl + url, "rejectUnauthorized": false });
            jobDescription.postingDate =
                $('.arrived.det-text.group-effect1 > div:nth-child(3) > p:nth-child(2)', jobDetailPageHtml).text();
            jobDescription.contactEmail =
                $('.arrived.det-text.group-effect1 > div:nth-child(5) > a', jobDetailPageHtml).text();
            
            jobDescription.briefDescription =
                $('.arrived.det-text.group-effect1 > div:nth-child(7) > p:nth-child(2)', jobDetailPageHtml).text();
            
            jobDescription.preferredSkills =
                $('.arrived.det-text.group-effect1 > div:nth-child(9) > p:nth-child(3)', jobDetailPageHtml).text();

            jobDescriptions.push(jobDescription);

            console.log(`Scraping ${i+1}/${numberOfEnteriesToFetch}`);  
        })

        for (i = 0; i < numberOfEnteriesToFetch; i++) {
            const entry = {
                jobTitle: jobTitles[i],
                companyName: companyNames[i],
                closingDate: closingDates[i],
                jobUrl: jobUrls[i],
                companyUrl: companyUrls[i],
                jobDescription: jobDescriptions[i]
            }
            allJobEnteries.push(entry);
        }

        console.log(allJobEnteries);


    })
    .catch(function (err) {
        //handle error
        console.log(err)
    });


