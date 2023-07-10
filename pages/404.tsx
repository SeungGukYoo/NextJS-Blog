import { useRouter } from "next/router";
import { useEffect } from "react";
import Layout from "../components/Layout";

export default function NotFound() {
  const router = useRouter();
  useEffect(() => {
    const moveListPage = setTimeout(() => {
      router.push("/");
    }, 1000);
    return () => clearTimeout(moveListPage);
  }, [router]);
  return (
    <Layout>
      <div className="w-full flex flex-col items-center">
        <h2 className="text-[48px]">Not Found</h2>
        <p className="text-[18px] text-center">
          주소가 잘못되었습니다. <br />
          잠시후 홈페이지로 이동되어집니다.
        </p>
      </div>
    </Layout>
  );
}
