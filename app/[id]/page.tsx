import { Metadata } from "next";
import React from "react";
import PostContent from "../../ui/postContent";

export async function generateStaticParams() {
  let base_url = process.env.NEXT_PUBLIC_NEXT_PUBLIC_VERCEL_URL || process.env.NEXT_PUBLIC_API_LOCAL_URL;
  const data = await fetch(`${base_url}/api/getPostParams`).then((result) => result.json());

  return data.params;
}
export async function generateMetadata({ params }): Promise<Metadata> {
  let base_url = process.env.NEXT_PUBLIC_NEXT_PUBLIC_VERCEL_URL || process.env.NEXT_PUBLIC_API_LOCAL_URL;

  const json = await fetch(`${base_url}/api/getPostContent?id=${params.id}`, {
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
  let base_url = process.env.NEXT_PUBLIC_NEXT_PUBLIC_VERCEL_URL || process.env.NEXT_PUBLIC_API_LOCAL_URL;

  const data = await fetch(`${base_url}/api/getPostContent?id=${params.id}`, {
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
