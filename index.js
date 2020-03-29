import express from 'express';
import './lib/cron';

const app = express();

app.listen(2093, () => {
  console.log(`Example App running on port http://localhost:2093`);
});
