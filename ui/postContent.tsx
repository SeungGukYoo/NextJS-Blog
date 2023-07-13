import React from "react";

function PostContent(props) {
  const { content } = props;

  const createMarkdown = () => {
    return { __html: content };
  };

  return (
    <div>
      <div dangerouslySetInnerHTML={createMarkdown()} />
    </div>
  );
}

export default PostContent;
