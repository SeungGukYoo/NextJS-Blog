import { useRouter } from "next/router";
import React, { useCallback } from "react";

interface Post {
  title: string;
  description: string;
  date: string;
  path: string;
}

function PostsList({ posts }) {
  const router = useRouter();

  const movePost = useCallback(
    (path: string) => {
      router.push(path);
    },
    [router]
  );
  return (
    <div className="w-100% flex cursor-pointer">
      {posts.map((el: Post, idx: number) => {
        return (
          <div
            key={idx}
            onClick={() => movePost(el.path)}
            className="w-1/3 mx-5 mt-5 px-4 flex flex-col items-center border-solid border-[#eee]"
          >
            <p className="h-[250px] w-full text-[18px] border-solid border-[#eee] py-[10px] px-[10px] mb-0">
              {el.description}
            </p>
            <div className="grid grid-cols-2 items-center w-full">
              <h1 className="col-span-1 text-[20px]">{el.title}</h1>
              <span className="col-span-1 text-[14px] justify-self-end">{el.date}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default PostsList;
