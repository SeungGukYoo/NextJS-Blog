import { Metadata } from "next";
import React, { useCallback } from "react";
import PostContent from "../../ui/postContent";
import { getPost, getPostParams } from "../../util/getPost";

export async function generateStaticParams() {
  const params = await getPostParams();
  return [{ props: { params } }];
}
export async function generateMetadata({ params }): Promise<Metadata> {
  const { data } = await getPost(params.id);

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

export async function getPostContent(params) {
  const post = await getPost(params.id);
  return post;
}

export default async function Page({ params }) {
  const postData = await getPostContent(params);

  return (
    <>
      <h1>hihi</h1>
      <PostContent content={postData.content} />
    </>
  );
}
