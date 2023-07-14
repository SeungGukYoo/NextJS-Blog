import { readFileSync, readdirSync } from "fs";
import matter from "gray-matter";
import path from "path";

const getPosts = async (req, res) => {
  try {
    const postDir = path.join(process.cwd(), "__posts");
    const fileNames = readdirSync(postDir);

    const posts = fileNames.map((el) => {
      const filepath = path.join(postDir, el);
      const fileContent = readFileSync(filepath, { encoding: "utf-8" });

      const { data } = matter(fileContent);
      const dataObj = {
        date: data.date,
        description: data.description,
        title: data.title,
        path: el.replace(/\.md$/, ""),
      };

      return dataObj;
    });
    res.status(200).json({ posts });
  } catch (error) {
    throw new Error(error);
  }
};

export default getPosts;
