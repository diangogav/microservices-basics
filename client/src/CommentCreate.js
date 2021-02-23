import  React, { useState } from "react";
import axios from 'axios';

const CommentCreate = ({id}) => {
  const [content, setContent] = useState('');
  
  const onSubmit = async (event) => {
    event.preventDefault();
    await axios.post(`http://posts.com/posts/${id}/comments`, {
      content
    });
    setContent(''); 
  }
  
  return (
    <div>
      <form onSubmit={onSubmit} className="form-group">
        <label>New comment</label>
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="form-control"  
        >
        </input>
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  )
};

export default CommentCreate;