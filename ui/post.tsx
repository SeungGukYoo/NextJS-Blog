"use client";
import { useRouter } from "next/navigation";
import React, { useCallback } from "react";

function Post({ data }) {
  const router = useRouter();

  const movePost = useCallback(() => {
    router.push(data.path);
  }, [data, router]);
  return (
    <div onClick={movePost} className="w-1/3 mx-5 mt-5 px-4 flex flex-col items-center border-solid border-[#eee]">
      <p className="h-[250px] w-full text-[18px] border-solid border-[#eee] py-[10px] px-[10px] mb-0">
        {data.description}
      </p>
      <div className="grid grid-cols-2 items-center w-full">
        <h1 className="col-span-1 text-[20px]">{data.title}</h1>
        <span className="col-span-1 text-[14px] justify-self-end">{data.date}</span>
      </div>
    </div>
  );
}

export default Post;
