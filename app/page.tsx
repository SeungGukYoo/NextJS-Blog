import React from "react";
import Post from "../ui/post";
import getPosts from "../util/getPosts";

async function Page() {
  const posts = await getPosts();
  return (
    <div>
      {posts.map((data, idx) => {
        return <Post data={data} key={idx} />;
      })}
    </div>
  );
}

export default Page;
