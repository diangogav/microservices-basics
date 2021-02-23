import React from 'react';

const CommentList = ({comments}) => {
  const renderedComments = comments.map(comment => {
    let content;
    if(comment.status === 'restricted') {
      content = 'This comment was refused';
    }

    if(comment.status === 'pending') {
      content = 'This comment is waiting for moderation';
    }

    if(comment.status === 'authorized') {
      content = comment.content;
    }

    return <li key={comment.id}>{content}</li>;
  });

  return (
    <ul>
      {renderedComments}
    </ul>
  )
};

export default CommentList;