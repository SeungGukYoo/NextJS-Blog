import React from "react";

function Layout({ children }) {
  return (
    <div className=" max-w-[1024px] m-auto overflow-x-hidden">
      <h1 className="text-[48px] my-10">NextJS BLOG</h1>
      {children}
    </div>
  );
}

export default Layout;
