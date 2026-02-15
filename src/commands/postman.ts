import { Command, Dir, ValidateConfig } from "@maro/maro";

import { HttpFile } from "../lib/http_file";
import { Postman } from "../lib/postman";
import { PostmanFile } from "../lib/postman/types";

export const PostmanCommand: Command = {
  name: "postman",
  description: "Generate postman from http files",
  run: async ({ ctx, config }) => {
    const log = ctx.logger;
    await new ValidateConfig({ keys: ["http.collection"] }).run();
    const collection = new Dir(config.get("http.collection"));
    const collections = collection.readFiles();
    const files = collections.map((n) => new HttpFile(n.path));
    const postman = new Postman();
    postman.addFiles(...files);

    const today = new Date();
    const day = today.getDate().toString().padStart(2, "0");
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const year = today.getFullYear();
    const date = `${year}-${month}-${day}`;

    // TODO: support other envs and internal/external
    const name = `Apoderados cert external ${date}.postman_collection`;
    const file_name = `${name}.json`;
    const content = postman.generate(name);
    const postman_dir = collection.getRelative(config.get("http.postman_dir")) as Dir;
    const file = new PostmanFile(postman_dir.createFile(file_name).path);
    file.write(content);
    log.success(`${file} generated`);

  }
};
