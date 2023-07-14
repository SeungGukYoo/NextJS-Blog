import fs from "fs";
import path from "path";

const getPostParams = async (req, res) => {
  try {
    const postDir = path.join(process.cwd(), "__posts");
    const fileNamesArray = fs.readdirSync(postDir);
    const removeFileExtensions = fileNamesArray.map((file) => {
      const replaceName = file.replace(/\.md$/, "");
      const obj = {
        id: replaceName,
      };
      return obj;
    });

    res.status(200).json({ params: removeFileExtensions });
  } catch (error) {
    throw new Error(error);
  }
};

export default getPostParams;
