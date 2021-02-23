const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios')
const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

function handleEvent(type, data) {
  if(type === 'PostCreated') {
    const {id, title} = data;
    posts[id] = {id, title, comments: []}
  }

  if(type === 'CommentCreated') {
    const {id, postId, content, status} = data;
    posts[postId].comments.push({
      id,
      content,
      status
    });
  }

  if(type === 'CommentUpdated') {
    const {id, postId, content, status} = data;
    const post = posts[postId];
    const comment = post.comments.find(comment => comment.id === id);
    comment.content = content;
    comment.status = status; 
  }

}

app.post('/events', (req, res) => {
  const {type, data} = req.body;

  handleEvent(type, data);
  // console.log(posts.comments);
  res.send({});
});

app.get('/posts', (req, res) => {
  res.send(posts);
});

app.listen(4002, async () => {

  console.log('Server listening on port 4002');

  const res = await axios.get('http://event-bus-service:4005/events');

  for (let event of res.data) {
    console.log('Processing event: ', event.type);
    handleEvent(event.type, event.data);
  }
});