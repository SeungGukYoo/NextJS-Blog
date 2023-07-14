import { Metadata } from "next";
import React from "react";
import PostContent from "../../ui/postContent";

export async function generateStaticParams() {
  const data = await fetch("http://localhost:3000/api/getPostParams").then((result) => result.json());

  return data.params;
}
export async function generateMetadata({ params }): Promise<Metadata> {
  const json = await fetch(`http://localhost:3000/api/getPostContent?id=${params.id}`, {
    method: "GET",
  }).then((result) => result.json());
  const data = json.data;
  return {
    title: data?.title,
    description: data?.description,
    other: {
      ["date"]: data?.date,
      ["slug"]: data?.slug,
      ["tags"]: data?.tags,
      ["categories"]: data?.categories,
    },
  };
}

async function getPostContent(params) {
  const data = await fetch(`http://localhost:3000/api/getPostContent?id=${params.id}`, {
    method: "GET",
  }).then((result) => result.json());

  return data;
}

async function Page({ params }) {
  const postData = await getPostContent(params);

  return (
    <div>
      <PostContent content={postData.content} />
    </div>
  );
}
export default Page;
