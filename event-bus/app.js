const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 4005;
const events = [];

app.use(bodyParser.json());

app.post('/events', (req, res) => {
  const event = req.body
  events.push(event);
  axios.post('http://posts-clusterip-service:4000/events', event);
  axios.post('http://comments-service:4001/events', event);
  axios.post('http://query-service:4002/events', event);
  axios.post('http://moderation-service:4003/events', event);

  res.status(200).json("OK");
});

app.get('/events', (_req, res) => {
  res.send(events);
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))