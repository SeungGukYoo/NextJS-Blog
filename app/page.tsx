import React from "react";
import Post from "../ui/post";

type Tdata = {
  date: string;
  description: string;
  title: string;
  path: string;
};

interface IData {
  posts: Tdata[];
}

const getPosts = async () => {
  let base_url = process.env.NEXT_PUBLIC_LOCAL_URL;
  const data: IData = await fetch(`${base_url}/api/getPosts`).then((result) => result.json());
  return data;
};

async function Page() {
  const data = await getPosts();

  return (
    <div className="flex">
      {data.posts.map((data, idx) => {
        return <Post data={data} key={idx} />;
      })}
    </div>
  );
}

export default Page;
