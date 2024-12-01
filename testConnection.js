const { Client } = require('pg');

const client = new Client({
  user: 'aladamm78',
  host: 'localhost',
  database: 'jobly',
  password: 'ali011380',
  port: 5432,
});

client
  .connect()
  .then(() => {
    console.log('Connected to PostgreSQL');
    client.end();
  })
  .catch(err => console.error('Connection error', err.stack));
