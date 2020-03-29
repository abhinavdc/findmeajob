import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

const adapter = new FileSync('./lib/db.json');
const db = low(adapter);
db.defaults({
  tpJobs: []
}).write();

export default db;
