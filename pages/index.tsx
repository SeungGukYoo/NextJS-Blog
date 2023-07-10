import { GetServerSideProps, GetStaticPaths } from "next";
import Layout from "../components/Layout";
import PostsList from "../components/PostsList";
import styles from "../styles/Home.module.css";
import getPosts from "../util/getPosts";

export default function Home({ posts }) {
  return (
    <Layout>
      <PostsList posts={posts} />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const data = await getPosts();

  return {
    props: {
      posts: data,
    },
  };
};
