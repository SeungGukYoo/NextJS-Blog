import { Metadata } from "next";
import React from "react";
import PostContent from "../../ui/postContent";

type TData = { params: { id: string }[] };

export async function generateStaticParams() {
  const data: TData = await fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL}/api/getPostParams`, {
    headers: {
      Accept: "application/json",
    },
  }).then((result) => result.json());
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
  const json: ContentMetaType = await fetch(
    `${process.env.NEXT_PUBLIC_VERCEL_URL}/api/getPostContent?id=${params.id}`,
    {
      headers: {
        Accept: "application/json",
      },
      method: "GET",
    }
  ).then((result) => result.json());
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
  const data: ContentMetaType = await fetch(
    `${process.env.NEXT_PUBLIC_VERCEL_URL}/api/getPostContent?id=${params.id}`,
    {
      headers: {
        Accept: "application/json",
      },
      method: "GET",
    }
  ).then((result) => result.json());

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
