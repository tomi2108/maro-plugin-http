import { Command, GetAppRepo } from "@maro/maro";

import { Swagger } from "../lib/swagger";
import { PromptHttpFile } from "../steps/PromptHttpFile";

export const SwaggerCommand: Command = {
  name: "swagger",
  description: "Generate swagger from an http file",
  run: async ({ ctx }) => {
    const log = ctx.logger;
    const { http_file } = await new PromptHttpFile().run(ctx);
    const app_name = http_file.service;
    const { app_repo } = await new GetAppRepo().run(ctx, { app_name });
    const swagger = new Swagger(http_file, app_repo);
    const file = swagger.generate();
    log.success(`${file} generated`);
  }
};
