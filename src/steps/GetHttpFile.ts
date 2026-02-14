import { AppRepo, Config, Dir, ExecutionContext, ValidateConfig, WorkflowStep } from "@maro/maro";

import { HttpFile } from "../lib/http_file";

type Reads = { app_repo: AppRepo };
type Writes = { http_file?: HttpFile };
type Options = {};

export class GetHttpFile extends WorkflowStep<Reads, Writes, Options> {

  async run(ctx: ExecutionContext, { app_repo }: Reads) {
    const log = ctx.logger;
    new ValidateConfig({ keys: ["paths.rest"] }).run();
    const rest_path = Config.getView().get("paths.rest");
    const collections = new Dir(rest_path).sub("Collections").readFiles();
    const files = collections.map((n) => new HttpFile(n.path));
    const { name } = await app_repo.getInfo();
    const http_file = files.find((f) => f.service === name);

    if (!http_file) {
      log.error(`Could not find http_file for app ${name}`);
      return {};
    }
    return { http_file };
  }
}
