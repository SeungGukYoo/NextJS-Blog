import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import React, { useCallback, useEffect } from "react";
import Layout from "../components/Layout";
import { getPost, getPostParams } from "../util/getPost";

function Page({ content, data }) {
  const createMarkdown = useCallback(() => {
    return { __html: content };
  }, [content]);

  return (
    <>
      <Head>
        <title>{data.title}</title>
        <meta name="description" content={data.description} />
        <meta name="keywords" content={data.tags.join(", ")} />
        <meta property="og:title" content={data.title} />
        <meta property="og:description" content={data.description} />
        <meta property="og:url" content={`https://example.com/${data.slug}`} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={data.date} />
        <meta property="article:section" content={data.categories.join(", ")} />
      </Head>
      <Layout>
        <div dangerouslySetInnerHTML={createMarkdown()} />
      </Layout>
    </>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { content, data } = await getPost(context.params.id);

  return {
    props: {
      content,
      data,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async (context) => {
  const data = await getPostParams();

  return {
    paths: data,
    fallback: false,
  };
};

export default Page;
