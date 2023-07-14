import { Metadata } from "next";
import React from "react";
import PostContent from "../../ui/postContent";

type TData = { params: { id: string }[] };

export async function generateStaticParams() {
  let base_url = process.env.NEXT_PUBLIC_LOCAL_URL;

  if (process.env.NODE_ENV === "production") {
    base_url = process.env.NEXT_PUBLIC_VERCEL_URL;
  }
  const data: TData = await fetch(`${base_url}/api/getPostParams`).then((result) => result.json());
  return data.params;
}

type TParams = {
  params: {
    id: string;
  };
};

interface ContentMetaType {
  content: string;
  data: {
    categories: string[];
    date: string;
    description: string;
    slug: string;
    tags: string[];
    title: string;
  };
}
export async function generateMetadata({ params }: TParams): Promise<Metadata> {
  let base_url = process.env.NEXT_PUBLIC_LOCAL_URL;

  if (process.env.NODE_ENV === "production") {
    base_url = process.env.NEXT_PUBLIC_VERCEL_URL;
  }
  const json: ContentMetaType = await fetch(`${base_url}/api/getPostContent?id=${params.id}`, {
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

type TParam = {
  id: string;
};

async function getPostContent(params: TParam) {
  let base_url = process.env.NEXT_PUBLIC_LOCAL_URL;

  if (process.env.NODE_ENV === "production") {
    base_url = process.env.NEXT_PUBLIC_VERCEL_URL;
  }
  const data: ContentMetaType = await fetch(`${base_url}/api/getPostContent?id=${params.id}`, {
    method: "GET",
  }).then((result) => result.json());

  return data;
}

async function Page({ params }: { params: TParam }) {
  const postData = await getPostContent(params);
  return (
    <div>
      <PostContent content={postData.content} />
    </div>
  );
}
export default Page;
