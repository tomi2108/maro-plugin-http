import { Config, Dir, ExecutionContext, ValidateConfig, WorkflowStep } from "@maro/maro";

import { HttpFile } from "../lib/http_file";

type Reads = {};
type Writes = { http_file: HttpFile };
type Options = {};

export class PromptHttpFile extends WorkflowStep<Reads, Writes, Options> {

  async run(ctx: ExecutionContext) {
    await new ValidateConfig({ keys: ["http.collection"] }).run();
    const config = Config.getView();
    const collection = new Dir(config.get("http.collection"));
    const collections = collection.readFiles();
    const files = collections.map((n) => new HttpFile(n.path));
    const http_file = await ctx.ui.promptChoice(files);
    return { http_file };
  }
}

