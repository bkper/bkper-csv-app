import { http } from '@google-cloud/functions-framework';

http('doPost', (req, res) => {
  res.status(200).send('HTTP with Node.js in GCF 2nd gen!');
});