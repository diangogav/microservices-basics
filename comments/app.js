const { randomBytes } = require('crypto');
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const commentsByPostId = {};
const PORT = process.env.PORT || 4001;

app.use(bodyParser.json());
app.use(cors());

app.post('/posts/:id/comments', async (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { content } = req.body;
  const comments = commentsByPostId[req.params.id] || [];
  
  comments.push({ id, content, status: 'pending'});
  commentsByPostId[req.params.id] = comments;

  await axios.post('http://event-bus-service:4005/events', {
    type: "CommentCreated",
    data : {
      id, content,
      postId: req.params.id,
      status: 'pending'
    }
  });

  res.status(201).send(comments);
});

app.get('/posts/:id/comments', (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post('/events', async (req, res) => {
  const event = req.body;
  console.log(`Event received ${event.type}`);
  
  const {type, data} = event;

  if(type === 'CommentModerated') {
    console.log('CommentModerated', data);
    const {postId, id, status} = data;
    const comments = commentsByPostId[postId];
    const commentToUpdate = comments.find(comment => comment.id === id);
    commentToUpdate.status = status;

    await axios.post('http://event-bus-service:4005/events', {
      type: 'CommentUpdated',
      data
    });
  }

  res.status(200).json({});
});

app.listen(PORT, () => {
  console.log(`Server listning on port ${PORT}`);
});