import "../styles/globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <div className=" max-w-[1024px] m-auto overflow-x-hidden">
          <h1 className="text-[48px] my-10">NextJS BLOG</h1>
          {children}
        </div>
      </body>
    </html>
  );
}
