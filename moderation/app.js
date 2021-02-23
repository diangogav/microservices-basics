const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

app.post('/events', async (req, res) => {
  const {type, data} = req.body;

  if(type === 'CommentCreated') {
    const {content} = data;
    const status = content.includes('orange') ? 'restricted' : 'authorized';

    await axios.post('http://event-bus-service:4005/events', {
      type: 'CommentModerated',
      data: {
        ...data,
        status
      }
    });
  };

  res.send({});
});

app.listen(4003, () => console.log('Server listeing on port 4003'));