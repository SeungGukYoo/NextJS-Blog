"use client";
import React, { useCallback } from "react";

function PostContent({ content }) {
  const createMarkdown = useCallback(() => {
    return { __html: content };
  }, [content]);
  return (
    <div>
      <div dangerouslySetInnerHTML={createMarkdown()} />
    </div>
  );
}

export default PostContent;
