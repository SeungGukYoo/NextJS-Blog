import React from "react";
import Post from "../ui/post";

const getPosts = async () => {
  let base_url =
    process.env.NODE_ENV === "development" ? process.env.NEXT_PUBLIC_API_LOCAL_URL : process.env.NEXT_PUBLIC_VERCEL_URL;
  const data = await fetch(`${base_url}/api/getPosts`).then((result) => result.json());
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
