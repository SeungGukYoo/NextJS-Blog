import React from "react";

function Post({ title, date, description }) {
  return (
    <div>
      <h1>{title}</h1>
      <p>{description}</p>
      <span>{date}</span>
    </div>
  );
}

export default Post;
