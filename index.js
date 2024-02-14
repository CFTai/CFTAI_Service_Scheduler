import 'dotenv/config';
import Agenda from 'agenda';
import axios from 'axios';

const mongoConnectionString = process.env.MONGO_URI;

// Documentation: https://betterstack.com/community/guides/scaling-nodejs/node-scheduled-tasks/


// agenda.define('dataExport', (job) => {
//   const { name, path } = job.attrs.data;
//   console.log(`Exporting ${name} data to ${path}`);
// });

// await agenda.start();

// await agenda.every('5 seconds', 'welcomeMessage');

// await agenda.every('5 seconds', 'dataExport', {
//   name: 'Sales report',
//   path: '/home/username/sales_report.csv',
// });

// agenda.define('dataExport', { priority: 'high' }, (job) => {



const rapid_agenda = new Agenda({ db: { address: mongoConnectionString, collection: 'rapidFootball' } });

rapid_agenda.define('fixtureRounds', async () => {
  const options = {
    method: 'GET',
    url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures/rounds',
    params: {
      league: '39',
      season: '2023'
    },
    headers: {
      'X-RapidAPI-Key': process.env.X_RapidAPI_Key,
      'X-RapidAPI-Host': process.env.X_RapidAPI_Host
    }
  }
  try {
    const response = await axios.request(options);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
})

await rapid_agenda.start();

await rapid_agenda.every('5 seconds', 'fixtureRounds');
