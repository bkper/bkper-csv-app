import { connect } from 'ngrok';
import { Bkper } from 'bkper-js';
import { getOAuthToken } from 'bkper'
import { App } from 'bkper-js';
import dotenv from 'dotenv';

import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

dotenv.config({path:`${__dirname}/../.env`})

process.env.NODE_ENV='development';

Bkper.setConfig({
  oauthTokenProvider: () => getOAuthToken(),
  apiKeyProvider: () => process.env.BKPER_API_KEY,
})

const app = new App();

(async function() {
  const url = await connect({ port: 3006 });
  console.log(`Started ngrok at ${url}`);
  await app.setWebhookUrlDev(url).patch()
})();

async function exit() {
  try {
    await app.setWebhookUrlDev(null).patch();
    console.log(' \nRemoved webhook.')
  } catch (err) {
    console.log(err)
  }
  process.exit();
}

process.on('exit', exit);
process.on('SIGINT', exit);
process.on('SIGUSR1', exit);
process.on('SIGUSR2', exit);
process.on('uncaughtException', exit);