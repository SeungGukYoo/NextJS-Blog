import fs from "fs";
import matter from "gray-matter";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import rehypeStringify from "rehype-stringify";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype/lib";

const getPostContent: (req: NextApiRequest, res: NextApiResponse) => Promise<void> = async (req, res) => {
  try {
    const id = req.query.id;
    const postDir = path.join(process.cwd(), "__posts");

    const fullFileName = id + ".md";
    const postPath = path.join(postDir, fullFileName);

    const postFile = fs.readFileSync(postPath, { encoding: "utf-8" });

    const { content, data } = matter(postFile);

    const remarkContent = await remark().use(remarkRehype).use(rehypeStringify).use(remarkGfm).process(content);

    res.status(200).json({ content: remarkContent.value, data: data });
  } catch (error) {
    throw new Error(error);
  }
};

export default getPostContent;
