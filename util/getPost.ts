import fs from "fs";
import matter from "gray-matter";
import path from "path";
import rehypeStringify from "rehype-stringify";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype/lib";

const getPost = async (id: string | string[]) => {
  try {
    const postDir = path.join(process.cwd(), "__posts");

    const fullFileName = id + ".md";
    const postPath = path.join(postDir, fullFileName);

    const postFile = fs.readFileSync(postPath, { encoding: "utf-8" });

    const { content, data } = matter(postFile);

    const remarkContent = await remark().use(remarkRehype).use(rehypeStringify).use(remarkGfm).process(content);

    return {
      content: remarkContent.value,
      data,
    };
  } catch (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }
};

const getPostParams = async () => {
  try {
    const postDir = path.join(process.cwd(), "__posts");
    const fileNamesArray = fs.readdirSync(postDir);
    const removeFileExtensions = fileNamesArray.map((file) => {
      const replaceName = file.replace(/\.md$/, "");
      const obj = {
        params: {
          id: replaceName,
        },
      };
      return obj;
    });
    return removeFileExtensions;
  } catch (error) {
    throw new Error(error);
  }
};

export { getPost, getPostParams };
