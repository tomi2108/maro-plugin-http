import {
  Action,
  AppRepo,
  ExecutionContext,
  getPaths,
  loading,
  MrCreateEvent
} from "@maro/maro";

import { Swagger } from "../lib/swagger";
import { GetHttpFile } from "../steps/GetHttpFile";

export class GenerateSwagger implements Action<MrCreateEvent> {
  event = MrCreateEvent;

  @loading("Generating swagger")
  async execute(event: MrCreateEvent) {
    const repo = event.ctx;
    if (!AppRepo.isAppRepo(repo.dir)) return;
    const paths = getPaths("backend");
    if (paths.every((p) => p.path !== repo.dir.path)) return;
    const app_repo = new AppRepo(repo.dir);
    const ctx = ExecutionContext.get();
    const { http_file } = await new GetHttpFile().run(ctx, { app_repo });
    if (!http_file) return;
    const file = new Swagger(http_file, app_repo).generate();
    await repo.add(file);
    await repo.commit("fix: add swagger");
  }

}
