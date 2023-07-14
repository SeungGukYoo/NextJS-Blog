import React from "react";
import Post from "../ui/post";

const getPosts = async () => {
  const data = await fetch("http://localhost:3000/api/getPosts").then((result) => result.json());
  return data;
};

async function Page() {
  const data = await getPosts();

  return (
    <div>
      {data.posts.map((data, idx) => {
        return <Post data={data} key={idx} />;
      })}
    </div>
  );
}

export default Page;
