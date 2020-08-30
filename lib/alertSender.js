const MongoClient = require('mongodb').MongoClient;
const sgMail = require('@sendgrid/mail');
const pug = require('pug');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const connectionString = process.env.CONN_STRING;

function buildLink(location, jobUrl) {
  switch (location) {
    case 'Trivandrum':
      return 'https://technopark.org/' + jobUrl;
    case 'Kochi':
      return 'http://infopark.in/' + jobUrl;
    case 'Kozhikode':
      return jobUrl;
  }
}

export async function mailSender() {
  MongoClient.connect(
    connectionString,
    {
      useUnifiedTopology: true,
    },
    (err, client) => {
      if (err) return console.error(err);
      console.log('Mail Sender Cron connected to Database');
      const db = client.db('jobs-db');

      const jobsCollection = db.collection('jobs');
      const subscriberCollection = db.collection('subscribers');
      const mailLogs = db.collection('logs');

      mailLogs
        .find({})
        .sort({ _id: -1 })
        .limit(1)
        .toArray()
        .then((logs) => {
          console.log('log', logs[0]);

          // get added jobs list for the day
          jobsCollection
            .find({ scrapedDate: { $gt: logs[0].alertedDate } })
            .toArray()
            .then((jobs) => {
              console.log('jobss', jobs.length);

              if (jobs && jobs.length) {
                // loop through subscribers
                subscriberCollection
                  .find({ verified: true, unsubscribed: false })
                  .toArray()
                  .then((subs) => {
                    console.log('subs', subs.length);
                    let subscribersAlerted = 0;
                    subs.forEach((sub) => {
                      let subMatches = [];

                      jobs.forEach((job) => {
                        // check if search query matches any in jobslist
                        const match = job.jobTitle
                          .toLowerCase()
                          .includes(sub.query.toLowerCase());

                        if (match) {
                          // push each match to email list
                          subMatches.push(job);
                        }
                      });

                      let matchesText = '';

                      if (subMatches && subMatches.length) {
                        subMatches.forEach((x) => {
                          matchesText += `${x.jobTitle} | ${
                            x.companyName
                          }  - ${buildLink(x.location, x.jobUrl)} \n`;

                          x.jobUrl = buildLink(x.location, x.jobUrl);

                          x.postedDate =
                            x.jobDescription && x.jobDescription.postingDate
                              ? new Date(
                                  x.jobDescription.postingDate
                                ).toDateString()
                              : '';
                        });

                        console.log('email', sub.email);

                        const html = pug.renderFile(
                          'views/job-alert-email.pug',
                          {
                            jobs: subMatches,
                            unsubscribeToken: sub.unsubscribeToken,
                            query: sub.query,
                          }
                        );

                        // send mail
                        const msg = {
                          to: sub.email,
                          from: {
                            email: 'findmeajob@abhinav.xyz',
                            name: 'Abhinav from Find Me a Job',
                          },
                          subject: `Someone just posted a matching job - '${sub.query}'`,
                          text: matchesText,
                          html: html,
                        };

                        sgMail
                          .send(msg)
                          .then(() => {
                            console.log('Message sent');
                            subscribersAlerted++;
                          })
                          .catch((error) => {
                            console.log(error.response.body);
                          });
                      }
                    });

                    // add logs
                    mailLogs.insertOne({
                      alertedDate: new Date().toISOString(),
                      subscribersAlerted,
                    });
                  });
              }
            });
        });
    }
  );
}
