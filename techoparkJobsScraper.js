const rp = require('request-promise');
const $ = require('cheerio');
const url = 'https://www.technopark.org/job-search';

rp({ url, "rejectUnauthorized": false })
    .then(function (html) {
        const jobNames = [];
        const companyNames = [];
        const postingDates = [];
        const jobLinks = [];
        
        //success!
        jobNames.push($('.jobTitleLink', html).text());
        // jobLinks.push($('.jobTitleLink', html).attr());
        // const jobEntries = $('.jobTitleLink', html).attr('href');

        // for (let i = 0; i < 45; i++) {
        //     wikiUrls.push($('big > a', html)[i].attribs.href);
        // }
        // console.log(wikiUrls);

        console.log(jobNames);
        // console.log(jobLinks);
        // console.log(Object.values(jobEntries));
    })
    .catch(function (err) {
        //handle error
        console.log(err)
    });