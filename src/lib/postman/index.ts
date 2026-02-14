import { HttpFile } from "../http_file";
import { PostmanRequestAdapter } from "./request";
import { PostmanContent, PostmanFolder } from "./types";

const schema = "https://schema.getpostman.com/json/collection/v2.1.0/collection.json";
export class Postman {
  private readonly files: HttpFile[] = [];

  addFiles(...files: HttpFile[]) {
    this.files.push(...files);
    return this;
  }

  generate(name: string): PostmanContent {
    const items = this.files.map(this.convertFile);
    return { info: { name, schema }, item: items };
  }

  private convertFile(file: HttpFile): PostmanFolder {
    return {
      name: file.service,
      item: file.getRequests().map((r) => new PostmanRequestAdapter(r).toPostmanItem())
    };
  }
}
