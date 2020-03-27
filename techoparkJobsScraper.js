const rp = require('request-promise');
const $ = require('cheerio');
const url = 'https://www.technopark.org/job-search';

function convertDate(dateString) {
    var dateParts = dateString.split("/");
    
    // month is 0-based, that's why we need dataParts[1] - 1
    var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]); 

    return dateObject
}

rp({ url, "rejectUnauthorized": false })
    .then(function (html) {
        const jobTitles = [];
        const companyNames = [];
        const closingDate = [];
        const jobLinks = [];
        const allJobEnteries = [];

        $('.jobTitleLink', html).each((i, elem) => {
            jobTitles.push($(elem).text());
        });

        $('.jobTitleLink', html).each((i, elem) => {
            jobLinks.push($(elem).attr('href'));
        });

        $('.companyList > td:nth-child(2) > a', html).each((i, elem) => {
            companyNames.push($(elem).text());
        });

        $('.companyList > td:nth-child(3)', html).each((i, elem) => {
            closingDate.push(convertDate($(elem).text()));
        });

        for (i = 0; i < closingDate.length; i++) {
            const entry = {
                jobTitle: jobTitles[i],
                companyName: companyNames[i],
                closingDate: closingDate[i],
                jobLink: jobLinks[i]  
            }
            allJobEnteries.push(entry);
        }

        console.log(allJobEnteries);
    })
    .catch(function (err) {
        //handle error
        console.log(err)
    });