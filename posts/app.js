const express = require("express");
const { randomBytes } = require('crypto'); 
const bodyParser = require('body-parser');
const cors = require('cors');
const { default: axios } = require("axios");
const app = express();

app.use(bodyParser.json());
app.use(cors());
const posts = {};

const PORT = process.env.PORT || 4000;

app.post('/posts/create', async (req, res) => {
  const { title } = req.body;
  const id = randomBytes(16).toString('hex');

  posts[id] = {
    id, title
  };

  await axios.post('http://event-bus-service:4005/events', {
    type: 'PostCreated',
    data: { id, title }
  })

  return res.json(posts[id]);
});

app.post('/events', (req, res) => {
  const event = req.body;
  console.log(`Event received ${event.type}`);
  
  res.status(200).json({});
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT} version 0.0.1`));