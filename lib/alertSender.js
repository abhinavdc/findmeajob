const MongoClient = require('mongodb').MongoClient;
const sgMail = require('@sendgrid/mail');

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
              console.log('jobs', jobs.length);

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

                    let macthesHtml = '';
                    let matchesText = '';

                    subMatches.forEach((x) => {
                      macthesHtml += `<a href="${buildLink(
                        x.location,
                        x.jobUrl
                      )}">${x.jobTitle} | ${x.companyName}</a><br/>`;

                      matchesText += `${x.jobTitle} | ${
                        x.companyName
                      }  - ${buildLink(x.location, x.jobUrl)} \n`;
                    });

                    macthesHtml += `<br/> <a href="https://immense-basin-85534.herokuapp.com/unsubscribe?token=${sub.unsubscribeToken}"> Unsubscribe </a>`;

                    console.log('matchesText', matchesText);
                    console.log('macthesHtml', macthesHtml);

                    // send mail
                    const msg = {
                      to: sub.email,
                      from: 'abhinavdinesh95@gmail.com',
                      subject: 'Someone just posted a matching job',
                      text: matchesText,
                      html: macthesHtml,
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
                  });

                  // add logs
                  mailLogs.insertOne({
                    alertedDate: new Date().toISOString(),
                    subscribersAlerted,
                  });
                });
            });
        });
    }
  );
}
