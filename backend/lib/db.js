import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

const adapter = new FileSync('./lib/db.json');
const db = low(adapter);
db.defaults({
  tpJobs: [],
  ipJobs: [],
  cpJobs: [],
  subscribers: [],
}).write();

export default db;
