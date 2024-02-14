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

const rapid_agenda = new Agenda({ db: { address: mongoConnectionString, collection: 'scheduleJob' } });

const definedService = async (url, params) => {
  const options = {
    method: 'GET',
    url: process.env.X_RapidAPI_Path + url,
    params: params,
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
}

rapid_agenda.define('fixtureRounds', (job) => {
  const { url, params } = job.attrs.data;
  definedService(url, params);
})

await rapid_agenda.start();

await rapid_agenda.every('5 seconds', 'fixtureRounds', {
  url: 'fixtures/rounds',
  params: {
    league: '39',
    season: '2023'
  }
});
