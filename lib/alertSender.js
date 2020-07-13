const MongoClient = require('mongodb').MongoClient;

const connectionString =
  'mongodb+srv://abhinav:zqR143nfUQfPJzp5@cluster0-cygaf.mongodb.net/test?retryWrites=true&w=majority';

export function mailSender() {
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

      // jobsCollection.
    }
  );
}
